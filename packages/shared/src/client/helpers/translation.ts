import 'client-only'
const Mustache = require('mustache')

import { Translations } from './translations'
import { TranslationsEN } from './translations/en'
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_SYMBOL } from '../../constants'

const en = TranslationsEN

export const tr = <P extends Record<string, any>>(
  lang: string,
  id: keyof Translations,
  params?: P
): string => {
  let result = ''
  if (id.includes('{{') && id.includes('}}') && !params) {
    throw Error(`The translation id: ${id} needs translations parameters`)
  }
  if (!AVAILABLE_LANGUAGES[lang]) lang = DEFAULT_LANGUAGE_SYMBOL

  switch (lang) {
    case 'en':
      result = Mustache.render(en[id], params)
  }

  return result
}
