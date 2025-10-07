import { Trans } from "@megacommerce/shared/server"
import ProductCreateWrapper from "@/components/products/create/product-create-wrapper"

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    proIden: "Product Identity",
    proDesc: "Product Description",
    proVar: "Product Variants",
    proMedia: "Product Media",
    offer: "Offer",
    safety: "Safety & Compliance",
    back: "Back",
    svAndCon: "Save & Continue",
    can: "Cancel"
  }
}

async function Page({ }) {
  const lang = await Trans.getUserLang()
  const tr = getTranslations(lang)

  return (<ProductCreateWrapper tr={tr} />)
}

export default Page
