import { Dispatch, SetStateAction, useEffect } from 'react'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'

import { ObjString } from '@megacommerce/shared'
import { buildAttachment } from '@/helpers/client'

type Props = {
  setImg: Dispatch<SetStateAction<Attachment | undefined>>
  tr: ObjString
  uppy: Uppy
}

function SignupAdditionalInfoForm({ tr, uppy, setImg }: Props) {
  useEffect(() => {
    uppy.on('file-added', async (res) => setImg(await buildAttachment(res)))
    uppy.on('file-removed', (_) => setImg(undefined))
  }, [uppy, setImg])

  return (
    <div className="flex flex-col col-span-full w-full">
      <p className="font-medium text-center my-4 tx-primary text-lg">
        {tr.logo} ({tr.optional})
      </p>
      <Dashboard
        uppy={uppy}
        height={350}
        width="100%"
        proudlyDisplayPoweredByUppy={false}
        note=""
        hideUploadButton={true}
        locale={{
          strings: {
            browseFiles: 'select from device',
          },
        }}
      />
    </div>
  )
}

export default SignupAdditionalInfoForm
