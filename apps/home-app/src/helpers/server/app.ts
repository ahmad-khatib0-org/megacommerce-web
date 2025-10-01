import 'server-only'
import { Pool } from 'pg'

interface Category {
  id: string,
  name: string
  subcategories: { id: string, name: string }[]
}

export class AppData {
  private static _instance: AppData

  private _categories: Category[] = []

  public static instance(): AppData {
    if (!this._instance) this._instance = new AppData()
    return this._instance
  }

  public async init(db: Pool): Promise<void> {
    try {
      const rows = await db.query("SELECT id, name FROM categories")
      this._categories = rows.rows as typeof this._categories
      console.log(this._categories);
    } catch (err) {
      throw Error(`failed to init categories: ${err}`)
    }
  }
}

