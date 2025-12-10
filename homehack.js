/** @param {NS} ns */
export async function main(ns){
    ns.atExit((ns)=>{
        let home = "home";
        let script = "hack.js";
        let selfRam = ns.getScriptRam(ns.getScriptName());
        let maxRam = ns.getServerMaxRam(home) - ns.getServerUsedRam(home) + selfRam;
        let scriptRam = ns.getScriptRam(script);
        let threads = Math.floor(maxRam / scriptRam);
        ns.exec("hack.js", "home", threads-1);
        })
    ns.exit()
}