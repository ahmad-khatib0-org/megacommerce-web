import path from 'path'
import { readdir, readFile } from 'fs/promises'

export interface TransEntry {
  id: string
  tr: string
}

export class Trans {
  private static _instance: Trans

  public static instance(): Trans {
    if (!Trans._instance) Trans._instance = new Trans()
    return Trans._instance
  }

  async initTranslations(): Promise<void> {
    try {
      const transDir = path.resolve(process.cwd(), 'src/static/server/translations')
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
    } catch (e) {
      console.log(e)
      throw Error('failed to init translations ', e as Error)
    }
  }
}
