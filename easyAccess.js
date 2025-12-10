/** @param {NS} ns */
export async function main(ns) {
  const mode = (ns.args[0] || "help");

  //Original repo (don't change)
  const ORIGINALREPO = "ZianConradie/Bitburner-scripts";

  //You can change this though
  const repo = "ZianConradie/Bitburner-scripts";

  switch (mode) {

    case "list": {
      const files = await getFiles(ns, repo);
      ns.tprint(files);
      break;
    }

    case "show": {
      const fileName = ns.args[1];
      const url = `https://raw.githubusercontent.com/${repo}/main/${fileName}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch file: " + res.status);

      ns.tprint(await res.text());
      break;
    }

    case "download": {
      const fileName = ns.args[1];
      const url = `https://raw.githubusercontent.com/${repo}/main/${fileName}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch file: " + res.status);

      ns.write(fileName, await res.text(), "w");
      ns.tprint("File Created: " + fileName);
      break;
    }

    case "downloadall": {
      const files = await getFiles(ns, repo);
      ns.tprint(`Found ${files.length} files. Starting download...`);

      for (const file of files) {
        const url = `https://raw.githubusercontent.com/${repo}/main/${file}`;
        const res = await fetch(url);

        if (!res.ok) {
          ns.tprint(`❌ Failed: ${file} (HTTP ${res.status})`);
          continue;
        }

        await ns.write(file, await res.text(), "w");
        ns.tprint(`✅ Downloaded: ${file}`);

        // Avoid throttling
        await ns.sleep(300);
      }

      ns.tprint("🎉 Finished downloading all files!");
      break;
    }

    case "repository":
    case "repo":
      ns.tprint("Current repository: " + repo);
      break;

    case "credits": {
      const adaptorName = "ChkChkChkBoom";
      const adaptorContact = "@chkchkchkboom on discord";
      const origName = "Made by ChkChkChkBoom (@chkchkchkboom on discord)";

      if (adaptorName === "ChkChkChkBoom") {
        ns.tprint("\n" + origName);
      } else {
        ns.tprint(
          `\nAdapted by ${adaptorName} (${adaptorContact}). ${origName}. Original repository was ${ORIGINALREPO}`
        );
      }
      break;
    }

    case "help":
    default:
      ns.tprint(
        "\nCommands:\n" +
        "help: displays help\n" +
        "credits: shows credits\n" +
        "list: display file tree\n" +
        "show: display a file\n" +
        "download: downloads a file to Bitburner\n" +
        "downloadall: downloads ALL files except LICENSE & README.md\n" +
        "repo (or repository): displays repository used"
      );
      break;
  }
}

async function getFiles(ns, repo) {
  const url = `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("GitHub returned HTTP " + res.status);
  }

  const data = await res.json();

  if (!data.tree) {
    ns.tprint("GitHub response missing .tree — likely wrong branch or rate-limited.");
    ns.tprint(JSON.stringify(data));
    throw new Error("Invalid GitHub API response");
  }

  // ---- IGNORE LIST ----
  const ignore = new Set(["LICENSE", "README.md"]);

  return data.tree
    .filter(entry => entry.type === "blob")
    .map(entry => entry.path)
    .filter(path => !ignore.has(path)); // ignore files
}
