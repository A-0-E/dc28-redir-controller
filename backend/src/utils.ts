import { Config, Service, State, Team, ServiceState } from "./generated/graphql"
import { fwRule } from "./native_cmds"

// given a ip, return the team related with it
export const mapIPtoTeam = (ip: string, config: Config): Team => {
    let ret = config.team.find((val) => val.ip === ip)
    if (ret) {
        return ret
    }
    throw new Error(`IP ${ip} have no team!`)
}

// given a port, return the service name and state related with it
export const mapPorttoService = (port: number, config: Config): [Service, State] => {
    let ret = config.service.find((val) => val.normalPort === port)
    if (ret) {
        return [ret, State.Normal]
    }
    ret = config.service.find((val) => val.stealthPort === port)
    if (ret) {
        return [ret, State.Stealth]
    }
    throw new Error(`Port ${port} have no service!`)
}

// generate a new service state object based on given arguments
export const newServiceStateItem = (serviceName: string, teamName: string, state: State, config: Config): ServiceState => {
    let team = config.team.find(m => m.name === teamName)
    if (!team) {
        throw new Error(`Team ${teamName} not found in config!`)
    }
    let service = config.service.find(m => m.name === serviceName)
    if (!service) {
        throw new Error(`Service ${serviceName} not found in config!`)
    }
    return {
        team: team,
        service: service,
        state: state,
        updatedAt: Date.now(),
    }
}

// convert out iptables rule from the service state
// undefiend will be returned if no rule required
export const serviceStateToRule = (newItem: ServiceState): fwRule | undefined => {
    switch (newItem.state) {
        case State.Normal:
            return {
                time: newItem.updatedAt,
                sourceip: newItem.team.ip,
                sourceport: newItem.service.stealthPort,
                destip: newItem.team.ip,
                destport: newItem.service.normalPort,
            }
        case State.Stealth:
            return {
                time: newItem.updatedAt,
                sourceip: newItem.team.ip,
                sourceport: newItem.service.normalPort,
                destip: newItem.team.ip,
                destport: newItem.service.stealthPort,
            }
    }
}

export const jsonEqual = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
}