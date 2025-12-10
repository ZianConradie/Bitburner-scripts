/** @param {NS} ns */
export async function main(ns) {
    const home = "home";
    const script = "hack.js";

    const selfRam = ns.getScriptRam(ns.getScriptName());
    const maxRam = ns.getServerMaxRam(home) - selfRam;
    const scriptRam = ns.getScriptRam(script);
    const threads = Math.floor(maxRam / scriptRam);

    ns.exec("hack.js", "home", threads)
}
