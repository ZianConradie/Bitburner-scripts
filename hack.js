/** @param {NS} ns **/
export async function main(ns) {
    // --- Find all servers (recursive scan) ---
    const visited = new Set();
    const servers = [];

    function scanAll(host) {
        visited.add(host);
        servers.push(host);
        for (const next of ns.scan(host)) {
            if (!visited.has(next)) scanAll(next);
        }
    }
    scanAll("home");

    // --- Filter servers: required hacking level <= half your level ---
    const myHack = ns.getHackingLevel();
    const validTargets = servers.filter(s => {
        if (s === "home") return false;
        const req = ns.getServerRequiredHackingLevel(s);
        const maxMoney = ns.getServerMaxMoney(s);
        return req <= Math.ceiling(myHack / 2) && maxMoney > 0; // must have money
    });

    if (validTargets.length === 0) {
        ns.tprint("No valid targets found.");
        return;
    }

    // --- Pick best target: highest max money, then lowest min security ---
    const target = validTargets.reduce((best, s) => {
        const maxMoney = ns.getServerMaxMoney(s);
        const minSec = ns.getServerMinSecurityLevel(s);

        if (!best) return s;

        const bestMax = ns.getServerMaxMoney(best);
        const bestMinSec = ns.getServerMinSecurityLevel(best);

        if (maxMoney > bestMax) return s;
        if (maxMoney === bestMax && minSec < bestMinSec) return s;

        return best;
    }, null);

    ns.tprint(`Selected target: ${target}`);

    // --- Main loop ---
    while (true) {
        const sec = ns.getServerSecurityLevel(target);
        const baseSec = ns.getServerBaseSecurityLevel(target);
        const money = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);

        if (sec > baseSec + 2) {
            await ns.weaken(target);
        } else if (money < maxMoney * 0.95) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}
