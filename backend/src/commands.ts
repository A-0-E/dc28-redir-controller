import { execFile } from 'child_process';
import util from 'util';

const exec = util.promisify(execFile);

const sudo_path = "/usr/bin/sudo"
const iptables_path = "/sbin/iptables";
const chain_name = "fwdctrl_chain";

const iptables_regex = /-A fwdctrl_chain -d (?<sip>[\d\\.]+)\/32 -p tcp -m tcp --dport (?<sport>\d+) -j DNAT --to-destination (?<dip>[\d\\.]+):(?<dport>\d+)/gm;

type fwRule = {
    sourceip: string;
    sourceport: number;
    destip: string;
    destport: number;
}

enum fwAction {
    ADD,
    DEL,
};

async function executeIPTables(args: string[]) {
    return await exec(sudo_path, [iptables_path, ...args])
}

async function getAllStatus() {
    let { stdout } = await executeIPTables(["-t", "nat", "-S", chain_name]);
    let captured;
    let rules: fwRule[] = [];
    while (captured = iptables_regex.exec(stdout)) {
        let sourceip = captured.groups?.["sip"];
        let sourceport = parseInt(captured.groups?.["sport"] || "");
        let destip = captured.groups?.["dip"];
        let destport = parseInt(captured.groups?.["dport"] || "");
        if (!sourceip || !sourceport || !destip || !destport) {
            continue;
        }
        rules.push({ sourceip, sourceport, destip, destport })
    }
    return rules;
}

async function forwardOperate(rule: fwRule, action: fwAction){
    let fwArgs = ["-t", "nat"];
    switch (action) {
        case fwAction.ADD:
            {
                fwArgs.push("-I");
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
        "-j", "DNAT", "--to", `${rule.destip}:${rule.destport.toString()}`]);
    await executeIPTables(fwArgs);
}

async function addForward(rule: fwRule) {
    return forwardOperate(rule, fwAction.ADD)
}

async function delForward(rule: fwRule) {
    return forwardOperate(rule, fwAction.DEL)
}

export {getAllStatus, addForward, delForward, fwRule}