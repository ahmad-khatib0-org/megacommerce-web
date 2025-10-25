import 'server-only'
import AppUploader from "@/components/app/header/app-uploader"
import { ClientInformation, Trans } from "@megacommerce/shared/server"

type Props = {
  info: ClientInformation
}

function AppHeader({ info }: Props) {
  const tr = Trans.tr
  const lang = info.language
  const trans = {
    cancel: tr(lang, "cancel"),
    uploading: tr(lang, 'upload.uploading_file'),
    completed: tr(lang, 'upload.uploading_complete'),
    tryAgain: tr(lang, 'actions.try_again'),
  }

  return (
    <div className="h-14 bg-sugar flex justify-end items-center px-8">
      <AppUploader tr={trans} />
    </div>
  )
}

export default AppHeader
