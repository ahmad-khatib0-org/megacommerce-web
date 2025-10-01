import { Trans } from "@megacommerce/shared/server";

import Categories from "@/components/home/categories";
import HomeNavbar from "@/components/home/home-navbar";
import { AppData } from "@/helpers/server";

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    allCats: 'All Categories'
  }
}

export default async function Index() {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)
  const cats = AppData.instance().categories

  return <>
    <HomeNavbar tr={tr} />
    <Categories tr={tr} categories={cats} />
  </>
}
