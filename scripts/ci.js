import { Storage } from "@jamiephan/casclib";
import { Archive, MPQ_COMPRESSION_ZLIB } from "@jamiephan/stormlib";

import os from "os";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CASC_CACHE_DIR = `${os.tmpdir()}/s2ma-casc-cache`;
const EXTRACTED_DIR = path.join(process.cwd(), "s2ma");
const MAPS_DIR = path.join(process.cwd(), "maps");
const MODS_DIR = path.join(process.cwd(), "mods");
const EXTRA_MAPS_DIR = path.join(process.cwd(), "extra_maps");

const MAP_FILE_EXTENSION = ".stormmap";
const MOD_FILE_EXTENSION = ".stormmod";

const GITHUB_BASE_URL = "https://github.com/jamiephan/HeroesOfTheStorm_S2MA";

const GAMESTRINGS_PATH = "enus.stormdata/localizeddata/gamestrings.txt";

const EXTRA_MAP_CASC_PATHS = [
  "mods\\heroes.stormmod\\base.stormmaps\\maps\\heroes\\singleplayermaps\\(10)trymemode.stormmap",
  "mods\\heroes.stormmod\\base.stormmaps\\maps\\heroes\\singleplayermaps\\startingexperience\\tutorial01.stormmap",
  "mods\\heroes.stormmod\\base.stormmaps\\maps\\heroes\\singleplayermaps\\startingexperience\\tutorialmapmechanics.stormmap",
  "mods\\heroes.stormmod\\base.stormmaps\\maps\\heroes\\singleplayermaps\\startingexperience\\tutorialveteran.stormmap",
];

// -- Helpers --

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir);
}

function* iterateCascFind(storage, pattern) {
  const first = storage.findFirstFile(pattern);
  if (first) {
    yield first;
    let next = storage.findNextFile();
    while (next) {
      yield next;
      next = storage.findNextFile();
    }
  }
  storage.findClose();
}

function readCascFile(storage, filePath) {
  const file = storage.openFile(filePath);
  const data = file.readAll();
  file.close();
  return data;
}

function addFileToArchive(archive, archivePath, data) {
  const file = archive.createFile(archivePath, Date.now(), data.length);
  file.write(data, MPQ_COMPRESSION_ZLIB);
  file.finish();
}

// -- Extraction --

function extractS2maFiles(storage) {
  for (const { fileName } of iterateCascFind(storage, "*.s2ma")) {
    const data = readCascFile(storage, fileName);
    fs.writeFileSync(path.join(EXTRACTED_DIR, path.basename(fileName)), data);
  }
}

function extractExtraMaps(storage) {
  for (const cascDir of EXTRA_MAP_CASC_PATHS) {
    const archivePath = path.join(EXTRA_MAPS_DIR, path.basename(cascDir));
    const archive = new Archive();
    archive.create(archivePath);
    let modName = "Unknown Mod";
    
    for (const { fileName } of iterateCascFind(storage, cascDir + "/*")) {
      const data = readCascFile(storage, fileName);
      const relPath = fileName.replace(cascDir + "\\", "");
      if (relPath.replace(/\\/g, "/") === GAMESTRINGS_PATH) {
        const match = data.toString().match(/DocInfo\/Name=(.+)/);
        if (match?.[1]) {
          modName = match[1].trim();
        } else {
          console.warn(`Warning: ${cascDir} has gamestrings.txt but could not find mod name`);
        }
      }
      addFileToArchive(archive, relPath, data);
    }
    
    archive.compact();

    archive.close();

    // Rename the archive to include the mod name for easier classification later
    const newArchivePath = path.join(EXTRA_MAPS_DIR, `${modName}${MAP_FILE_EXTENSION}`);
    fs.renameSync(archivePath, newArchivePath);
  }
}

function commitChanges() {
  // Fetch the game version from CASC_CACHE_DIR/versions
  // Sample content:
  // 
  // Region!STRING:0|BuildConfig!HEX:16|CDNConfig!HEX:16|KeyRing!HEX:16|BuildId!DEC:4|VersionsName!String:0|ProductConfig!HEX:16
  // ## seqn = 3702338
  // us|b364abaf571c0a6af01680615fbc7c0d|83df5351e1fd568aed0415693b7b3818||96881|2.55.16.96881|a0c5874544505acfa8952db0b0a4e48f
  // eu|b364abaf571c0a6af01680615fbc7c0d|83df5351e1fd568aed0415693b7b3818||96881|2.55.16.96881|a0c5874544505acfa8952db0b0a4e48f
  // cn|a1eb46877f0c27e66f1dcd169866b34b|83df5351e1fd568aed0415693b7b3818||89566|2.55.3.89566|a0c5874544505acfa8952db0b0a4e48f
  // kr|b364abaf571c0a6af01680615fbc7c0d|83df5351e1fd568aed0415693b7b3818||96881|2.55.16.96881|a0c5874544505acfa8952db0b0a4e48f
  // tw|b364abaf571c0a6af01680615fbc7c0d|83df5351e1fd568aed0415693b7b3818||96881|2.55.16.96881|a0c5874544505acfa8952db0b0a4e48f
  // sg|b364abaf571c0a6af01680615fbc7c0d|83df5351e1fd568aed0415693b7b3818||96881|2.55.16.96881|a0c5874544505acfa8952db0b0a4e48f

  // Fetch the VersionsName from the list from the us region
  const versionsFile = fs.readFileSync(path.join(CASC_CACHE_DIR, "versions"), "utf8");
  const lines = versionsFile.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("##"));

  const headerLine = lines[0];
  const headers = headerLine.split("|").map((h) => h.split("!")[0]);
  const versionsNameIndex = headers.indexOf("VersionsName");

  if (versionsNameIndex === -1) {
    throw new Error("Could not find VersionsName column in versions file");
  }

  const usLine = lines.find((l) => l.startsWith("us|"));
  if (!usLine) {
    throw new Error("Could not find us region in versions file");
  }

  const gameVersion = usLine.split("|")[versionsNameIndex];
  console.log(`Game version: ${gameVersion}`);

  // Commit with message "Updated Files to ${gameVersion}"
  execSync(`git add .`);
  execSync(`git commit -m "Updated Files to ${gameVersion}"`);
  execSync(`git push`);

}

// -- Classification --

function getModName(archive, fileName) {
  if (!archive.hasFile(GAMESTRINGS_PATH)) {
    return "Unknown Mod";
  }

  const file = archive.openFile(GAMESTRINGS_PATH);
  const data = file.readAll();
  file.close();

  const match = data.toString().match(/DocInfo\/Name=(.+)/);
  if (match?.[1]) {
    return match[1].trim();
  }

  console.warn(`Warning: ${fileName} has gamestrings.txt but could not find mod name`);
  return "Unknown Mod";
}

function classifyAndCopyFiles() {
  const fileMapping = [];

  for (const fileName of fs.readdirSync(EXTRACTED_DIR)) {
    const filePath = path.join(EXTRACTED_DIR, fileName);
    const archive = new Archive();

    try {
      archive.open(filePath);
    } catch {
      fileMapping.push({ fileName, modName: null, type: "other" });
      continue;
    }

    const modName = getModName(archive, fileName);
    const type = archive.hasFile("mapscript.galaxy") ? "map" : "mod";
    const ext = type === "map" ? MAP_FILE_EXTENSION : MOD_FILE_EXTENSION;
    const destDir = type === "map" ? MAPS_DIR : MODS_DIR;

    fileMapping.push({ fileName, modName, type });
    fs.copyFileSync(filePath, path.join(destDir, `${modName}${ext}`));
    archive.close();
  }

  return fileMapping;
}

// -- Table generation --

function s2maLink(fileName) {
  return `[\`${fileName}\`](${GITHUB_BASE_URL}/blob/main/s2ma/${fileName})`;
}

function treeLink(dir, file) {
  const encoded = file.replace(/ /g, "%20");
  return `[\`${dir}/${file}\`](${GITHUB_BASE_URL}/tree/main/${dir}/${encoded})`;
}

function nameTreeLink(modName, dir, file) {
  const encoded = file.replace(/ /g, "%20");
  return `[\`${modName}\`](${GITHUB_BASE_URL}/tree/main/${dir}/${encoded})`;
}

function generateFullTableRows(entries) {
  return entries
    .sort((a, b) => a.fileName.localeCompare(b.fileName))
    .map(({ fileName, modName, type }) => {
      const s2ma = s2maLink(fileName);
      if (type === "map") {
        return `| ${s2ma} | \`Map\` | ${treeLink("maps", `${modName}${MAP_FILE_EXTENSION}`)} |`;
      } else if (type === "mod") {
        return `| ${s2ma} | \`Mod\` | ${treeLink("mods", `${modName}${MOD_FILE_EXTENSION}`)} |`;
      }
      return `| ${s2ma} | \`Null\` | \`Null\` |`;
    })
    .join("\n");
}

function generateTypedTableRows(entries, dir, ext) {
  return entries
    .sort((a, b) => a.modName.localeCompare(b.modName))
    .map(({ fileName, modName }) => {
      const file = `${modName}${ext}`;
      return `| ${nameTreeLink(modName, dir, file)} | ${s2maLink(fileName)} |`;
    })
    .join("\n");
}

function generateNullTableRows(entries) {
  return entries
    .sort((a, b) => a.fileName.localeCompare(b.fileName))
    .map(({ fileName }) => `| ${s2maLink(fileName)} |`)
    .join("\n");
}

function generateTableMd(fileMapping) {
  const fullTableRows = generateFullTableRows([...fileMapping]);
  const mapsTableRows = generateTypedTableRows(
    fileMapping.filter((e) => e.type === "map"),
    "maps",
    MAP_FILE_EXTENSION,
  );
  const modsTableRows = generateTypedTableRows(
    fileMapping.filter((e) => e.type === "mod"),
    "mods",
    MOD_FILE_EXTENSION,
  );
  const nullTableRows = generateNullTableRows(
    fileMapping.filter((e) => e.type === "other"),
  );

  return `# \`*.s2ma\` Tables

The tables are generated by [\`scripts/ci.js\`](${GITHUB_BASE_URL}/blob/main/scripts/ci.js).

- [Full Table](#table-full)

- [Maps only Table](#table-maps)

- [Mods only Table](#table-mods)

- [Null only Table](#table-null)


<a name="table-full" />

## Full Table

| s2ma | type | path |
 |-|-|-|
${fullTableRows}

---
<a name="table-maps" />

## Maps only Table

This table only contains the Map files:

| Map Name | s2ma |
|-|-|
${mapsTableRows}

---
<a name="table-mods" />

## Mods only Table

This table only contains the Mod files:

| Mod Name | s2ma |
|-|-|
${modsTableRows}

---
<a name="table-null" />

## Null only Table

This table only contains the Null files (Undecided Files):

| s2ma |
|-|
${nullTableRows}
`;
}

// -- Main --

function main() {
  resetDir(EXTRACTED_DIR);
  resetDir(MAPS_DIR);
  resetDir(MODS_DIR);
  resetDir(EXTRA_MAPS_DIR);

  const storage = new Storage();
  storage.openOnline(`${CASC_CACHE_DIR}*hero`);

  extractS2maFiles(storage);
  extractExtraMaps(storage);
  storage.close();

  const fileMapping = classifyAndCopyFiles();

  const tablePath = path.join(process.cwd(), "TABLE.md");
  fs.writeFileSync(tablePath, generateTableMd(fileMapping), "utf8");
  console.log(`Generated TABLE.md at ${tablePath}`);

  commitChanges();
}

main();
