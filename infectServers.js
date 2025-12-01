/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");

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

    ns.tprint(`Found ${servers.length} servers.`);


    // --- Infect and deploy scripts ---
    for (const host of servers) {
        if (host === "home") continue;

        // Try to root the server
        if (!ns.hasRootAccess(host)) {
            try {
                if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(host);
                if (ns.fileExists("FTPCrack.exe", "home")) ns.ftpcrack(host);
                if (ns.fileExists("relaySMTP.exe", "home")) ns.relaysmtp(host);
                if (ns.fileExists("HTTPWorm.exe", "home")) ns.httpworm(host);
                if (ns.fileExists("SQLInject.exe", "home")) ns.sqlinject(host);

                ns.nuke(host);
                ns.tprint(`✔ Rooted ${host}`);
            } catch {
                ns.tprint(`❌ Could not root ${host}`);
            }
        }

        if (!ns.hasRootAccess(host)) {
            ns.tprint(`⚠ Skipped ${host} (no root access)`);
            continue;
        }

        // --- Copy hack.js ---
        const ok = await ns.scp("hack.js", host);
        if (!ok) {
            ns.tprint(`❌ Failed to copy hack.js → ${host}`);
            continue;
        }
        ns.tprint(`📁 Copied hack.js → ${host}`);

        // --- Calculate max threads ---
        const maxRam = ns.getServerMaxRam(host);
        const scriptRam = ns.getScriptRam("hack.js");
        const threads = Math.floor(maxRam / scriptRam);

        if (threads < 1) {
            ns.tprint(`⚠ ${host}: Not enough RAM for even 1 thread.`);
            continue;
        }

        ns.killall(host);

        const freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        const threadsNow = Math.floor(freeRam / scriptRam);

        // --- Run hack.js targeting the BEST TARGET ---
        ns.exec("hack.js", host, threadsNow);

        ns.tprint(`▶ ${host}: hack.js running with ${threadsNow}.`);
    }

    ns.tprint("✔ Infection complete. hack.js deployed everywhere.");
}
