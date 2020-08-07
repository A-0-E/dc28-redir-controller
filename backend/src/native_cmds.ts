import { execFile } from 'child_process';
import util from 'util';
import { format, transports, createLogger } from 'winston';
import { logRoot } from './logger';

const logger = logRoot.child({ defaultMeta: { service: 'native-commands' }, })

const exec = util.promisify(execFile);

const sudo_path = "/usr/bin/sudo"
const iptables_path = "/sbin/iptables";
const chain_name = "fwdctrl_chain";

const iptables_regex = /-A fwdctrl_chain -d (?<sip>[\d\.]+)\/32 -p tcp -m tcp --dport (?<sport>\d+) -m comment --comment "\|time=(?<time>\d+)\|" -j DNAT --to-destination (?<dip>[\d\.]+):(?<dport>\d+)/gm;

type fwRule = {
    sourceip: string;
    sourceport: number;
    destip: string;
    destport: number;
    time: number;
}

enum fwAction {
    ADD,
    DEL,
};

let needSudo: boolean = ((process.env.NEED_SUDO?.length || 0) > 0) || false

async function executeIPTables(args: string[]) {
    logger.silly("Execute firewall command", { args })
    if (needSudo) {
        return await exec(sudo_path, [iptables_path, ...args])
    } else {
        return await exec(iptables_path, args)
    }
}

async function getAllRules() {
    let { stdout } = await executeIPTables(["-t", "nat", "-S", chain_name]);
    let captured;
    let rules: fwRule[] = [];
    while (captured = iptables_regex.exec(stdout)) {
        let sourceip = captured.groups?.["sip"];
        let sourceport = parseInt(captured.groups?.["sport"] || "");
        let destip = captured.groups?.["dip"];
        let destport = parseInt(captured.groups?.["dport"] || "");
        let time = parseInt(captured.groups?.["time"] || "");
        if (!sourceip || !sourceport || !destip || !destport || !time) {
            continue;
        }
        rules.push({ sourceip, sourceport, destip, destport, time })
    }
    return rules;
}

async function forwardOperate(rule: fwRule, action: fwAction) {
    let fwArgs = ["-t", "nat"];
    switch (action) {
        case fwAction.ADD:
            {
                fwArgs.push("-A");
                break;
            }
        case fwAction.DEL:
            {
                fwArgs.push("-D");
                break;
            }
    }
    fwArgs.push(chain_name);
    // add target parameters
    fwArgs.push(...["-d", rule.sourceip,
        "-p", "tcp",
        "--dport", rule.sourceport.toString(),
        "-m", "comment", "--comment", `|time=${rule.time.toString()}|`,
        "-j", "DNAT", "--to", `${rule.destip}:${rule.destport.toString()}`
    ]);
    await executeIPTables(fwArgs);
}

async function addForward(rule: fwRule) {
    logger.info("Adding forward", {rule})
    return forwardOperate(rule, fwAction.ADD)
}

async function delForward(rule: fwRule) {
    logger.info("Removing forward", {rule})
    return forwardOperate(rule, fwAction.DEL)
}

export { getAllRules as getAllStatus, addForward, delForward, fwRule }