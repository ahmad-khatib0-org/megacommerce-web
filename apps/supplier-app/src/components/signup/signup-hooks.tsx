import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import Uppy, { Meta, UppyFile } from '@uppy/core'
import ImageEditor from '@uppy/image-editor'
import { yupResolver } from 'mantine-form-yup-resolver'

import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { ObjString, UserImageAcceptedTypes, UserImageMaxSizeBytes } from '@megacommerce/shared'
import { buildAttachment } from '@megacommerce/shared/client'
import { SignupHelpers } from '@/helpers/client'

type Props = {
  tr: ObjString
  setImage: Dispatch<SetStateAction<Attachment | undefined>>
}

function SignupHooks({ tr, setImage }: Props) {
  const infoForm = useForm({
    validateInputOnBlur: true,
    validate: yupResolver(SignupHelpers.infoForm(tr)),
    initialValues: SignupHelpers.infoFormValues(),
  })

  const authForm = useForm({
    validateInputOnBlur: true,
    validate: yupResolver(SignupHelpers.authInfoForm(tr)),
    initialValues: SignupHelpers.authInfoFormValues(),
  })

  const [uppy] = useState(() => {
    return new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: UserImageMaxSizeBytes,
        allowedFileTypes: UserImageAcceptedTypes,
      },
    }).use(ImageEditor, {
      quality: 0.9,
      cropperOptions: {
        viewMode: 1,
        aspectRatio: 1,
        zoomable: true,
        rotatable: true,
        scalable: true,
      },
    })
  })

  useEffect(() => {
    const handleFileAdded = async (file: UppyFile<Meta, Record<string, never>>) => {
      setImage(await buildAttachment(file))
    }

    const handleFileRemoved = () => setImage(undefined)

    const handleEditComplete = async (updatedFile: UppyFile<Meta, Record<string, never>>) => {
      setImage(await buildAttachment(updatedFile))
    }

    uppy.on('file-added', handleFileAdded)
    uppy.on('file-removed', handleFileRemoved)
    uppy.on('file-editor:complete', handleEditComplete)

    // Cleanup
    return () => {
      uppy.off('file-added', handleFileAdded)
      uppy.off('file-removed', handleFileRemoved)
      uppy.off('file-editor:complete', handleEditComplete)
    }
  }, [uppy, setImage])

  return { infoForm, authForm, uppy }
}

export default SignupHooks
