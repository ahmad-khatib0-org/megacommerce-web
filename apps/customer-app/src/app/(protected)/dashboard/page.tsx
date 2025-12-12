import { Trans } from '@megacommerce/shared/server'
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getTranslations(lang: string) {
  const tr = Trans.tr
  return {
    title: tr(lang, 'dashboard.profile.title'),
    fullName: tr(lang, 'dashboard.profile.full_name'),
    email: tr(lang, 'dashboard.profile.email'),
    username: tr(lang, 'dashboard.profile.username'),
    memberSince: tr(lang, 'dashboard.profile.member_since'),
    emailVerified: tr(lang, 'dashboard.profile.email_verified'),
    verified: tr(lang, 'dashboard.profile.verified'),
    notVerified: tr(lang, 'dashboard.profile.not_verified'),
    tryAgain: tr(lang, 'actions.try_again'),
  }
}

async function DashboardPage({ searchParams }: Props) {
  const lang = await Trans.getUserLang()
  const tr = await getTranslations(lang)

  return <DashboardWrapper tr={tr} />
}

export default DashboardPage
