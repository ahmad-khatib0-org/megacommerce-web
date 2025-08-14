import { Dispatch, SetStateAction } from 'react'
import { FilePondFile } from 'filepond'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'

import { ObjString, UserImageAcceptedTypes, UserImageMaxSizeKB } from '@megacommerce/shared'

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
)

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
  setImg: Dispatch<SetStateAction<FilePondFile[]>>
  tr: ObjString
}

export interface SignupAdditionalInfoFormValues {
  image: string
}

function SignupAdditionalInfoForm({ tr, image, setImg }: Props) {
  return (
    <div className="flex flex-col col-span-full">
      <p className="font-medium text-center my-4 tx-primary text-lg">
        {tr.logo} ({tr.optional})
      </p>
      <FilePond
        files={image}
        onupdatefiles={setImg}
        credits={false}
        maxFileSize={`${UserImageMaxSizeKB}kb`}
        labelMaxFileSizeExceeded={tr.maxImgSz}
        labelMaxFileSize={tr.maxImgSz}
        acceptedFileTypes={UserImageAcceptedTypes}
        allowImageExifOrientation={true}
        allowFileTypeValidation={true}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  )
}

export default SignupAdditionalInfoForm
