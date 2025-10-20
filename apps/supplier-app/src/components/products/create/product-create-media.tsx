import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import { ObjString } from '@megacommerce/shared'

type Props = {
  tr: ObjString
  uppy: Uppy
  errMsg?: string
}

function ProductCreateMedia({ tr, uppy, errMsg }: Props) {
  return (
    <div className="flex flex-col justify-center w-full px-2">
      {errMsg && <p className="block font-medium text-center my-3 text-red-500 text-lg">{errMsg}</p>}
      <div className='grid grid-cols-[62%,1fr]'>
        <div className='flex flex-col'>
          <p className="text-center my-4">{tr.proMediaDesc}</p>
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
        <div className='flex items-center justify-center'>Video Selection</div>
      </div>
    </div>
  )
}

export default ProductCreateMedia
