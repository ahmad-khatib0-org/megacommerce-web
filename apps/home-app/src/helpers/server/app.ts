import 'server-only'
import { Pool } from 'pg'
import { IDName } from '@megacommerce/shared'

interface Category {
  id: string,
  name: string
  image: string
  subcategories: IDName[]
}

export class AppData {
  private static _instance: AppData

  public static instance(): AppData {
    if (!this._instance) this._instance = new AppData()
    return this._instance
  }

  public async init(db: Pool): Promise<void> {
    try {
      const rows = await db.query("SELECT id, name, image, subcategories FROM categories")
      this._categories = rows.rows as typeof this._categories
      console.log(this._categories);
    } catch (err) {
      throw Error(`failed to init categories: ${err}`)
    }
  }

  private _categories: Category[] = []
  get categories() { return this._categories }
}

