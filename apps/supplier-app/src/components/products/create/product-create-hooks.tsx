import { useEffect, useRef, useState } from "react"
import Uppy, { Meta, UppyFile } from '@uppy/core'
import ImageEditor from "@uppy/image-editor"
import { useForm } from "@mantine/form"
import { yupResolver } from "mantine-form-yup-resolver"
import { toast } from "react-toastify"

import { Attachment } from "@megacommerce/proto/web/shared/v1/attachment"
import { buildAttachment, handleGrpcWebErr } from "@megacommerce/shared/client"
import { ObjString, PRODUCTS_MAX_IMAGES_COUNT, PRODUCTS_IMAGE_ACCEPTED_TYPES, PRODUCTS_IMAGE_MAX_SIZE_BYTES } from "@megacommerce/shared"

import { ProductCreateOfferFormValues } from "@/components/products/create/product-create-offer"
import { ProductCreateDetailsHandlers } from "@/components/products/create/product-create-details"
import { Products, productsClient } from "@/helpers/client"
import { useProductsStore } from "@/store"

type Props = {
  tr: ObjString
}

function ProductCreateHooks({ tr }: Props) {
  const detailsFormRef = useRef<ProductCreateDetailsHandlers>(null)
  const [active, setActive] = useState(0);
  const [images, setImages] = useState<Attachment[]>([])
  const [productDetailsLoading, setProductDetailsLoading] = useState(false)
  const [imageErr, setImageErr] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const setProductsData = useProductsStore((s) => s.set_product_details_data)
  const setProductDetailsFormValues = useProductsStore((state) => state.set_product_details_form_values)
  const setProductDetailsVariationFormValues = useProductsStore((state) => state.set_product_details_variations_form_values)

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

  const offerForm = useForm<ProductCreateOfferFormValues>({
    validateInputOnBlur: true,
    initialValues: Products.offerFormValues(),
    validate: yupResolver(Products.offerForm(tr)) as any
  })

  const nextStep = async () => {
    let valid = false
    if (active === 0) {
      valid = !identityForm.validate().hasErrors
    } else if (active === 1) {
      valid = !descForm.validate().hasErrors
    } else if (active === 2) {
      valid = validateDetailsForm()
    } else if (active === 4) {
      valid = !offerForm.validate().hasErrors
    }

    if (!valid) {
      toast.error(tr.correct)
      return
    }

    if (active === 0) {
      try {
        const response = await productsClient.ProductData({
          subcategory: { category: identityForm.values.category, subcategory: identityForm.values.subcategory }
        })
        if (response.error) {
          toast.error(response.error.message)
          return
        }
        setProductsData(response.data!)
      } catch (err) {
        toast.error(handleGrpcWebErr(err))
        return
      }
    }
    setActive((current) => (current < 6 ? current + 1 : current))
  }

  const validateDetailsForm = (): boolean => {
    let valid = false
    const shared = detailsFormRef.current?.getForm()!
    const variations = detailsFormRef.current?.getVariationsForm

    console.log(`the variation is: ${variations}`);
    if (variations) {
      valid = !variations().validate().hasErrors
      setProductDetailsVariationFormValues(variations().getValues())
      if (!valid) return false
    }
    valid = !shared.validate().hasErrors
    setProductDetailsFormValues(shared.getValues())

    return valid
  }

  const prevStep = () => {
    const sharedForm = detailsFormRef.current?.getForm();
    const varForm = detailsFormRef.current?.getVariationsForm
    if (sharedForm) setProductDetailsFormValues(sharedForm.getValues())
    if (varForm) setProductDetailsVariationFormValues(varForm().getValues())
    setActive((current) => (current > 0 ? current - 1 : current))
  }

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
    offerForm,
    detailsFormRef,
    nextStep,
    prevStep,
    uppy,
    images,
    productDetailsLoading,
  }
}

export default ProductCreateHooks
