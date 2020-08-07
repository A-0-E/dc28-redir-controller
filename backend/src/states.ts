import { getAllStatus, addForward, delForward, fwRule } from './native_cmds'
import { ServiceState, State, Config } from './generated/graphql'
import { PubSub } from 'apollo-server';
import { SubscriptionType } from './messages';
import { mapIPtoTeam, mapPorttoService, newServiceStateItem, serviceStateToRule, jsonEqual } from './utils';
import { logRoot } from './logger';

const logger = logRoot.child({ defaultMeta: { service: 'state-manager' }, })


let serviceState: ServiceState[];

// Parse from firewall rules to service state
async function parseRulesToStates(rules: fwRule[], config: Config): Promise<ServiceState[]> {
    let states: ServiceState[] = []
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let ruleTeam = mapIPtoTeam(rule.destip, config);
        let [ruleService, ruleState] = mapPorttoService(rule.destport, config)
        states.push({
            team: ruleTeam,
            service: ruleService,
            state: ruleState,
            updatedAt: rule.time,
        });
    }
    return states;
}

// Compare if current state equals with saved state
async function compareState(config: Config): Promise<void> {
    // get rules
    let newState = await parseRulesToStates(await getAllStatus(), config);
    // compare if rules length are different
    if (!jsonEqual(newState, serviceState)) {
        throw new Error(`Mismatch in json equal`)
    }
}

export async function changeState(config: Config, pubsub: PubSub, newState: State, serviceName: string, teamName?: string | null): Promise<ServiceState[]> {
    // if team name is not defined, all teams will be affected
    let teamList: string[] = []
    if (!teamName) {
        teamList = config.team.map(m => m.name)
    } else {
        teamList.push(teamName)
    }
    // For each team, set service to the state by steps
    for (let i = 0; i < teamList.length; i++) {
        let teamName = teamList[i]
        let newItem = newServiceStateItem(serviceName, teamName, newState, config)
        serviceState = serviceState.filter((val) => {
            // 1. check current states to see existing configs
            let hit = jsonEqual(val.team, newItem.team) && jsonEqual(val.service, newItem.service)
            if (hit) {
                // 2. remove previous settings from iptables and local storage, if any
                let hitRule = serviceStateToRule(val);
                if (hitRule) {
                    delForward(hitRule).catch((e) => new Error(`Can not delete: ${e}`));
                } else {
                    throw Error(`Found an improper state: ${val}`)
                }
            }
            return !hit
        })
        // 3. if new set is not ignore:
        //  3a. add new forward rule based on the state
        //  3b. update to local state set
        let newRule = serviceStateToRule(newItem);
        if (newRule) {
            await addForward(newRule)
            serviceState.push(newItem)
        }
        // 4. publish the message
        pubsub.publish(SubscriptionType.ServiceStateChanged, { serviceStateChanged: newItem })
    }
    return serviceState
}

// Return local state directly
export function getState() { return serviceState }

// Make a full reset and send out notifications
export async function resetState(pubsub: PubSub, config: Config): Promise<void> {
    logger.warn("resetState triggered")
    serviceState = await parseRulesToStates(await getAllStatus(), config);
    // Send out the full-reload signal
    pubsub.publish(SubscriptionType.ForceReload, { forceReload: true })
}

let watching = false

// Get state peridoically and send ForceReload if not same with local storage
export async function watchState(watchTimeout: number, pubsub: PubSub, getConfig: () => Config) {
    if (watching) {
        throw new Error("watchState should only be called once")
    }
    watching = true
    try {
        await resetState(pubsub, getConfig())
    } catch (e) {
        logger.error(`Fatal error: can not reset state`, e)
        process.exit(-1)
    }
    setInterval(async () => {
        try {
            await compareState(getConfig())
        } catch (e) {
            logger.warn(`Got different state (${e}), force reloading`)
            await resetState(pubsub, getConfig())
        }
    }, watchTimeout * 1000);
}