import YAML from 'yaml';
import fs from 'fs';
import util from 'util';
import chokidar from 'chokidar';

import { Config, Team, Service, State } from './generated/graphql'
import { PubSub } from 'apollo-server';
import { SubscriptionType } from './messages';
import { logRoot } from './logger';

const logger = logRoot.child({ defaultMeta: { service: 'stoarge' }, })

const read = util.promisify(fs.readFile);

type configFile = Config & { iptables_command_name: string }

let config: configFile;

async function reload(filename: string): Promise<void> {
    const file = await read(filename, { encoding: "utf-8" })
    let newConfig: configFile = await YAML.parse(file)
    for (let i = 0; i < newConfig.service.length; i++) {
        if (!newConfig.service[i].stealthPort) {
            newConfig.service[i].stealthPort = newConfig.service[i].normalPort + 10000;
        }
    }
    newConfig.updatedAt = Date.now()
    // Logic check
    // There should be no teams/services with the same name
    let teams: string[] = []
    let services: string[] = []
    newConfig.team.forEach(m => teams.push(m.name.trim()))
    newConfig.service.forEach(m => services.push(m.name.trim()))
    if (teams.length != new Set(teams).size) {
        throw new Error("Duplicate team name!")
    }
    if (services.length != new Set(services).size) {
        throw new Error("Duplicate service name!")
    }
    // update all configs
    config = newConfig
}

export function getConfig() { return config }

let watching = false

export async function startWatch(filename: string, pubsub: PubSub) {
    if (watching) {
        throw new Error("watchState should only be called once")
    }
    watching = true    // One-liner for current directory
    try {
        await reload(filename)
    } catch (e) {
        logger.error(`Fatal error: can not do first load`, e)
        process.exit(-1)
    }
    chokidar.watch(filename).on('all', async (event, path) => {
        logger.info(`Received ${event} for ${path}`)
        try {
            await reload(filename);
        } catch (e) {
            logger.error(`Reload failed: ${e}`)
            return
        }
        // if config changed, push a full-reload notification
        pubsub.publish(SubscriptionType.Config, { config: config })
    });
}

