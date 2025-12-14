import { Metadata } from 'next'

import { Trans } from '@megacommerce/shared/server'
import SupplierProfileWrapper from '@/components/profile/supplier-profile-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const tr = Trans.tr
  const lang = await Trans.getUserLang()
  return {
    title: tr(lang, 'profile.supplier.title'),
  }
}

const getTranslations = (lang: string) => {
  const tr = Trans.tr
  return {
    title: tr(lang, 'profile.supplier.title'),
    fullName: tr(lang, 'profile.supplier.full_name'),
    email: tr(lang, 'profile.supplier.email'),
    username: tr(lang, 'profile.supplier.username'),
    membership: tr(lang, 'profile.supplier.membership'),
    createdAt: tr(lang, 'profile.supplier.created_at'),
    updatedAt: tr(lang, 'profile.supplier.updated_at'),
    emailVerified: tr(lang, 'profile.supplier.email_verified'),
    emailNotVerified: tr(lang, 'profile.supplier.email_not_verified'),
    loading: tr(lang, 'profile.supplier.loading'),
    errorLoading: tr(lang, 'profile.supplier.error_loading'),
    tryAgain: tr(lang, 'actions.try_again'),
  }
}

async function Page() {
  const lang = await Trans.getUserLang()
  const trans = getTranslations(lang)

  return <SupplierProfileWrapper tr={trans} />
}

export default Page
