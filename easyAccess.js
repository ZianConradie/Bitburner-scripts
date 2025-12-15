/** @param {NS} ns */
export async function main(ns) {
  const mode = (ns.args[0]||"help")
  //Original repo (don't change)
  const ORIGINALREPO="ZianConradie/Bitburner-scripts"
  //You can change this though
  const repo = "ZianConradie/Bitburner-scripts"
  switch (mode) {
    case "list": {
      ns.tprint(await getFiles(ns,repo))
      break
    }
    case "show": {
      let fileName0 = ns.args[1]
      let u0 = "https://raw.githubusercontent.com/"+repo+"/main/" + fileName0
      let re0 = await fetch(u0)
      if (!re0.ok) throw new Error("Failed to fetch file")
      let data0 = await re0.text()
      ns.tprint(data0)
      break
      }
    case "download": {
      let fileName1 = ns.args[1]
      let u1 = "https://raw.githubusercontent.com/"+repo+"/main/" + fileName1
      let re1 = await fetch(u1)
      if (!re1.ok) throw new Error("Failed to fetch file")
      let data1 = await re1.text()
      ns.write(fileName1, data1, "w")
      ns.tprint("File Created")
      break
    }
    case "downloadall": {
      const files = await getFiles()
      ns.tprint(`Found ${files.length} files. Starting download...`)

      for (const file of files) {
        const url = "https://raw.githubusercontent.com/"+repo+"/main/" + file
        const res = await fetch(url)

        if (!res.ok) {
          ns.tprint(`❌ Failed: ${file} (HTTP ${res.status})`)
          continue
        }

        const text = await res.text()
        await ns.write(file, text, "w")

        ns.tprint(`✅ Downloaded: ${file}`)

        await ns.sleep(300) // avoid GitHub throttling
      }

      ns.tprint("🎉 Finished downloading all files!")
      break
    }
    //This works, I think
    case "repository":
    case "repo": {
      ns.tprint("Current repository: "+repo)
      break
    }
    case "credits": {
      //Replace with your name if you use this elsewhere
      const adaptorName="ChkChkChkBoom"
      //Replace with contact info
      const adaptorContact="@chkchkchkboom on discord"
      //DON'T CHANGE THIS
      const origName="Made by ChkChkChkBoom (@chkchkchkboom on discord)"
      let str=""
      //Don't change
      if (adaptorName=="ChkChkChkBoom"){
        str+="\n"+origName
      }
      else{
        //Don't change
        str+="\nAdapted by "+adaptorName+" ("+adaptorContact+"). "+origName+". Original repository was ZianConradie/Bitburner-scripts"
      }
      ns.tprint(str)
      break
    }
    case "help": {
      ns.tprint("\nCommands:\nhelp: displays help\ncredits: shows credits\nlist: display file tree\nshow: display a file\ndownload: downloads a file to Bitburner\ndownloadall: downloads ALL files except LICENSE & README.md\nrepo (or repository): displays repository used")
      break
    }
  }
}

async function getFiles(ns,repo) {
    const url = "https://api.github.com/repos/"+repo+"/git/trees/main?recursive=1"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("GitHub returned HTTP " + res.status)
    }
    const data = await res.json()
    if (!data.tree) {
        console.log("GitHub response:", data)
        throw new Error("GitHub response missing .tree — wrong branch or rate-limited?")
    }

    // ---- IGNORE LIST ----
    const ignore = new Set([
        "LICENSE",
        "README.md"
    ])

    return data.tree
        .filter(entry => entry.type === "blob")
        .map(entry => entry.path)
        .filter(path => !ignore.has(path))   // <-- ignore files here
}
