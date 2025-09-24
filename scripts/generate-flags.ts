import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";

const flagsDir = path.join(process.cwd(), "..", "packages", "ui", "src", "assets", "flags");
const outFile = path.join(process.cwd(), "..", "packages", "ui", "src", "lib", "data", "countries-flags.ts");

async function run() {
  await mkdir(path.dirname(outFile), { recursive: true })
  const files = await readdir(flagsDir)
  const images = files.filter(f => /\.(svg|png|jpg|jpeg)$/i.test(f));
  const imports: string[] = []
  const mapEntries: string[] = [];

  for (const img of images) {
    const name = path.basename(img).replace(/\.[^.]+$/, ""); // us, fr
    const id = name.replace(/[^a-zA-Z0-9_$]/g, "_"); // safe TS identifier
    imports.push(`import ${id}Flag from "../../assets/flags/${img}";`);
    mapEntries.push(`  "${name.toLowerCase()}": ${id}Flag,`);
  }

  const content = `// THIS FILE IS AUTO GENERATED, DON'T EDIT - run: cd scripts than: pnpm run generate:flags
  /* eslint-disable */

  ${imports.join("\n")}

  export const FLAGS = {
    ${mapEntries.join("\n")}
  } as const;

  export type FlagKey = keyof typeof FLAGS;
  `

  await writeFile(outFile, content, "utf8");

  console.log(`Generated ${outFile} with ${images.length} flags`);
}

run().catch(err => { console.error(err); process.exit(1); });

