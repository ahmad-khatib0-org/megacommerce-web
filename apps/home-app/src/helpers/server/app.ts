import 'server-only'
import { Pool } from 'pg'

import { CategoryTranslations } from '@megacommerce/proto/products/v1/product_categories'
import { IDName } from '@megacommerce/shared'

interface Category {
  id: string
  name: string
  image: string
  subcategories: IDName[]
  translations: CategoryTranslations[]
}

export class AppData {
  private static _instance: AppData
  private db!: Pool

  public static instance(): AppData {
    if (!this._instance) this._instance = new AppData()
    return this._instance
  }

  public async init(db: Pool): Promise<void> {
    this.db = db
    await this.initCategories()
  }

  private _categories: Category[] = []
  private async initCategories(): Promise<void> {
    try {
      const rows = await this.db.query('SELECT id, name, image, subcategories, translations FROM categories')
      this._categories = rows.rows as typeof this._categories
    } catch (err) {
      throw Error(`failed to init categories: ${err}`)
    }
  }

  get categories() {
    return this._categories
  }
}
