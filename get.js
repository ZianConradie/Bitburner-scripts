/** @param {NS} ns */
export async function main(ns) {
    const serverName=ns.args[0]
    const serverLevel=ns.args[1]
    // run [scriptName] [ns.args[0]] [ns.args[1]] [ns.args[2]] [etc]
    ns.purchaseServer(serverName,serverLevel)
}