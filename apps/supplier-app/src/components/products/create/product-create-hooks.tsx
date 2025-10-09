import { useEffect, useState } from "react"
import Uppy, { Meta, UppyFile } from '@uppy/core'
import ImageEditor from "@uppy/image-editor"
import { useForm } from "@mantine/form"
import { yupResolver } from "mantine-form-yup-resolver"
import { toast } from "react-toastify"

import { Attachment } from "@megacommerce/proto/web/shared/v1/attachment"
import { buildAttachment } from "@megacommerce/shared/client"
import { ObjString, PRODUCTS_MAX_IMAGES_COUNT, PRODUCTS_IMAGE_ACCEPTED_TYPES, PRODUCTS_IMAGE_MAX_SIZE_BYTES } from "@megacommerce/shared"

import { Products } from "@/helpers/client"

type Props = {
  tr: ObjString
}

function ProductCreateHooks({ tr }: Props) {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState<Attachment[]>([])
  const [imageErr, setImageErr] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const identityForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.identityFormValues(),
    validate: yupResolver(Products.identityForm(tr))
  })

  const descForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.descriptionFormValues(),
    validate: yupResolver(Products.descriptionForm(tr))
  })

  const nextStep = () => {
    let valid = false
    if (active === 0) valid = !identityForm.validate().hasErrors
    if (!valid) {
      toast.error(tr.correct)
      return
    }
    setActive((current) => (current < 6 ? current + 1 : current))
  }

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [uppy] = useState(() => {
    return new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: PRODUCTS_MAX_IMAGES_COUNT,
        maxFileSize: PRODUCTS_IMAGE_MAX_SIZE_BYTES,
        allowedFileTypes: PRODUCTS_IMAGE_ACCEPTED_TYPES,
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
    const handleFileAdded = async (f: UppyFile<Meta, Record<string, never>>) => {
      const files = [...images, await buildAttachment(f)]
      setImages(files)
    }

    const handleFileRemoved = (f: UppyFile<Meta, Record<string, never>>) => {
      const files = images.filter((img) => img.id !== f.id)
      setImages(files)
    }

    const handleEditComplete = async (f: UppyFile<Meta, Record<string, never>>) => {
      const files = [...images.filter((img) => img.id !== f.id), await buildAttachment(f)]
      setImages(files)
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
  }, [uppy, setImages])

  return {
    active,
    setActive,
    identityForm,
    descForm,
    nextStep,
    prevStep,
    uppy,
    images,
  }
}

export default ProductCreateHooks
