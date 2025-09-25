import { getCookie } from 'cookies-next/client'
import { AVAILABLE_LANGUAGES, COOKIE_CURRENCY, COOKIE_LANGUAGE, COOKIE_LOCATION, DEFAULT_CURRENCY, DEFAULT_LANGUAGE } from "../constants";
import { AppCookies } from "../models";

/** 
 *  gets the essential cookies that are stored for user, such as lang, currency... 
 *  TODO: get the location from ip (E,g using fingerprintjs)
 */
export function getAppCookies(): AppCookies {
  let language = (getCookie(COOKIE_LANGUAGE) ?? "") as string
  let currency = (getCookie(COOKIE_CURRENCY) ?? "") as string
  let location = (getCookie(COOKIE_LOCATION) ?? "") as string

  if (!language || !AVAILABLE_LANGUAGES.includes(language)) language = DEFAULT_LANGUAGE
  if (!currency) currency = DEFAULT_CURRENCY
  if (!location) currency = DEFAULT_CURRENCY

  return { location, language, currency }
}
