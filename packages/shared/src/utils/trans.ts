import path = require('path')
import { readdir, readFile } from 'fs/promises'

import type { TransEntry, Translations } from '../models'

export async function initTranslations(transPath = 'src/static/server/translations'): Promise<Translations> {
  try {
    const transDir = path.resolve(process.cwd(), transPath)
    const transFiles = await readdir(transDir)
    const jsonFiles = transFiles.filter((f) => f.endsWith('.json'))

    const allLangs: { [key: string]: TransEntry[] } = {}

    await Promise.all(
      jsonFiles.map(async (f) => {
        const filePath = path.join(transDir, f)
        const lang = f.split('.')[1]
        const content = await readFile(filePath, 'utf-8')
        const parsed = JSON.parse(content) as TransEntry[]
        allLangs[lang] = parsed
      }),
    )

    return allLangs
  } catch (e) {
    console.log(e)
    throw Error(`failed to init translations ${e}`)
  }
}
