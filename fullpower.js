/** @param {NS} ns */
export async function main(ns) {
    //WILL UPDATE SOON
    //But not now
    // Where to send to
    const target = ns.args[0]
    // What to send
    const send = ns.args[1]
    // How much it costs
    const cost = ns.args[2]
    // Params of sent script
    let args=[]
    const len = ns.args.length
    for (let i=3;i<len;i++){
        args.push(ns.args[i])
    }
    const amnt = Math.floor((ns.getServerMaxRam(target)-ns.getServerUsedRam(target))/cost)
    if (amnt>0){
        ns.scp(send,target,"home")
        ns.exec(send,target,amnt,args)
    }
}