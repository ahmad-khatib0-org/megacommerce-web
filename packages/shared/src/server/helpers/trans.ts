import 'server-only'
import { CommonV1 } from '@megacommerce/proto'
import { Translations } from '../models'

export async function getTranslations(client: CommonV1.Common.CommonServiceClient): Promise<Translations> {
  return new Promise((resolve, reject) => {
    const req = CommonV1.Trans.TranslationsGetRequest.create()
    client.translationsGet(req, (err, res) => {
      if (err) reject(err)
      if (res.error) reject(res.error)

      const allLangs: Translations = {}
      for (const [lang, tr] of Object.entries(res.data)) {
        const langTrans: { [key: string]: string } = {}
        tr.trans.map((item) => (langTrans[item.id] = item.tr))
        allLangs[lang] = langTrans
      }

      resolve(allLangs)
    })
  })
}
