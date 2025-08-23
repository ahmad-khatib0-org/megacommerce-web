import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'

import { ObjString } from '@megacommerce/shared'

type Props = {
  tr: ObjString
  uppy: Uppy
  errMsg?: string
}

function SignupAdditionalInfoForm({ tr, uppy, errMsg }: Props) {
  return (
    <div className="flex flex-col col-span-full w-full">
      <p className="font-medium text-center my-4 tx-primary text-lg">
        {tr.logo} ({tr.optional})
      </p>
      {errMsg && <p className="block font-medium text-center my-3 text-red-500 text-lg">{errMsg}</p>}
      <Dashboard
        uppy={uppy}
        height={350}
        width="100%"
        proudlyDisplayPoweredByUppy={false}
        note={tr.maxImgSz}
        hideUploadButton={true}
        showProgressDetails={true}
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
