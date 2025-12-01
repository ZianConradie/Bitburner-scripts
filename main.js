/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        ns.killall("home")
        ns.exec("upgradeServers.js", "home", 1)
        ns.exec("infectServers.js", "home", 1)
        ns.exec("homehack.js", "home", 1)
        // 10 minutes
        await ns.sleep(600000)
    }
    
}
