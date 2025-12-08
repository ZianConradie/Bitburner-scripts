/** @param {NS} ns */
export async function main(ns) {
  const mode = (ns.args[0]||"list")
  switch (mode) {
    case "list":
      ns.tprint(await getFiles(ns))
      break
    case "show":
      let fileName0 = ns.args[1]
      let u0 = "https://raw.githubusercontent.com/ZianConradie/Bitburner-scripts/main/" + fileName0
      let re0 = await fetch(u0)
      if (!re0.ok) throw new Error("Failed to fetch file")
      let data0 = await re0.text()
      ns.tprint(data0)
      break
    case "download":
      let fileName1 = ns.args[1]
      let u1 = "https://raw.githubusercontent.com/ZianConradie/Bitburner-scripts/main/" + fileName1
      let re1 = await fetch(u1)
      if (!re1.ok) throw new Error("Failed to fetch file")
      let data1 = await re1.text()
      ns.write(fileName1, data1, "w")
      ns.tprint("File Created")
      break
    case "credits":
      ns.tprint("\nMade by ChkChkChkBoom (@chkchkchkboom on Discord)")
      break
    case "help":
      ns.tprint("\nCommands:\nhelp: displays help\ncredits: shows credits\nlist: display file tree\nshow: display a file\ndownload: downloads a file to Bitburner")
      break
  }
}
async function getFiles() {
    const url = "https://api.github.com/repos/ZianConradie/Bitburner-scripts/git/trees/main?recursive=1"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("GitHub returned HTTP " + res.status)
    }
    const data = await res.json()
    if (!data.tree) {
        console.log("GitHub response:", data)
        throw new Error("GitHub response missing .tree — wrong branch or rate-limited?")
    }
    return data.tree
        .filter(entry => entry.type === "blob")
        .map(entry => entry.path)
}
