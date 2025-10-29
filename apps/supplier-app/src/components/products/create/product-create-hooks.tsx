import { useEffect, useRef, useState } from 'react'
import Uppy, { Meta, UppyFile } from '@uppy/core'
import ImageEditor from '@uppy/image-editor'
import { useForm } from '@mantine/form'
import { object } from 'yup'
import { yupResolver } from 'mantine-form-yup-resolver'
import { toast } from 'react-toastify'

import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { buildAttachment, handleGrpcWebErr, tr as translator } from '@megacommerce/shared/client'
import {
  ObjString,
  PRODUCTS_MAX_IMAGES_COUNT,
  PRODUCTS_IMAGE_ACCEPTED_TYPES,
  PRODUCTS_IMAGE_MAX_SIZE_BYTES,
  PRODUCTS_MIN_IMAGES_COUNT,
} from '@megacommerce/shared'

import { ProductCreateDetailsHandlers } from '@/components/products/create/product-create-details'
import { ProductCreateOfferWithVariationsHandler } from '@/components/products/create/product-create-offer-with-variations'
import {
  ProductCreateOfferFormValues,
  ProductCreateOfferPriceFormValues,
} from '@/components/products/create/product-create-offer'
import { ProductCreateSafetyAndCompliance } from '@/components/products/create/product-create-safety-and-compliance'
import { Products, productsClient } from '@/helpers/client'
import { useAppStore, useProductsStore } from '@/store'

type Props = {
  tr: ObjString
}

function ProductCreateHooks({ tr }: Props) {
  const detailsFormRef = useRef<ProductCreateDetailsHandlers>(null)
  const offerWithVariantFormRef = useRef<ProductCreateOfferWithVariationsHandler>(null)
  const safetyFormRef = useRef<ProductCreateSafetyAndCompliance>(null)

  const [active, setActive] = useState(0)
  const [images, setImages] = useState<Attachment[]>([])
  const [variantsImages, setVariantsImages] = useState<{
    [key: string]: { title: string; images: Attachment[] }
  }>({})
  const [productDetailsLoading, setProductDetailsLoading] = useState(false)
  const [imageErr, setImageErr] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const info = useAppStore((state) => state.clientInfo)
  const setProductsData = useProductsStore((s) => s.set_product_details_data)
  const setProductDetailsFormValues = useProductsStore((state) => state.set_product_details_form_values)
  const setProductDetailsVariationFormValues = useProductsStore(
    (state) => state.set_product_details_variations_form_values
  )
  const setProductDetailsVariationsTitles = useProductsStore(
    (state) => state.set_product_details_variations_titles
  )
  const productDetailsVariationsTitles = useProductsStore((state) => state.product_details_variations_titles)
  const setProductOfferFormValues = useProductsStore((state) => state.set_product_offer_form_values)
  const setProductSafetyFormValues = useProductsStore((state) => state.set_product_safety_form_values)

  const identityForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.identityFormValues(),
    validate: yupResolver(Products.identityForm(tr)),
  })

  const descForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.descriptionFormValues(),
    validate: yupResolver(Products.descriptionForm(tr)),
  })

  const offerForm = useForm<ProductCreateOfferFormValues>({
    validateInputOnBlur: true,
    initialValues: Products.offerFormValues(),
    validate: yupResolver(Products.offerForm(tr)) as any,
  })

  const offerWithouVariantForm = useForm<ProductCreateOfferPriceFormValues>({
    validateInputOnBlur: true,
    initialValues: Products.offerPriceFormValues(),
    validate: yupResolver(object().shape(Products.offerPriceForm(tr))) as any,
  })

  const nextStep = async () => {
    let valid = false
    let errMsg = null

    if (active === 0) {
      valid = !identityForm.validate().hasErrors
    } else if (active === 1) {
      valid = !descForm.validate().hasErrors
    } else if (active === 2) {
      valid = validateDetailsForm()
    } else if (active === 3) {
      const err = validateMediaForm()
      if (!err) valid = true
      else errMsg = err
    } else if (active === 4) {
      valid = validateOfferForm()
    } else if (active === 5) {
      valid = validateSafetyForm()
    }

    if (!valid) {
      toast.error(errMsg ?? tr.correct)
      return
    }

    if (active === 0) {
      try {
        const response = await productsClient.ProductData({
          subcategory: {
            category: identityForm.values.category,
            subcategory: identityForm.values.subcategory,
          },
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
    if (variations) {
      valid = !variations().validate().hasErrors
      const values = variations().getValues()
      setProductDetailsVariationFormValues(values)
      if (!valid) return false
      const titles = values.variations.map((variation) => ({
        label: variation['title'] as string,
        value: variation['id'] as string,
      }))
      setProductDetailsVariationsTitles(titles)
    }
    valid = !shared.validate().hasErrors
    setProductDetailsFormValues(shared.getValues())
    return valid
  }

  const validateMediaForm = (): string | null => {
    if (identityForm.values.has_variations) {
      for (const title of productDetailsVariationsTitles) {
        if (Object.keys(variantsImages).length === 0) return tr.proImgVar
        const current = variantsImages[title.value]
        if (!current || (current && current.images.length === 0)) {
          return translator(info.language, 'products.media.variant_images.missing_for_variant', {
            Max: PRODUCTS_MAX_IMAGES_COUNT,
            Min: PRODUCTS_MIN_IMAGES_COUNT,
            Title: title.label,
          })
        } else if (current && current.images.length > PRODUCTS_MAX_IMAGES_COUNT) {
          return translator(info.language, 'products.media.variant_images.exceeded_for_variant', {
            Max: PRODUCTS_MAX_IMAGES_COUNT,
            Title: title.label,
          })
        }
      }
    } else {
      if (images.length < PRODUCTS_MIN_IMAGES_COUNT || images.length > PRODUCTS_MAX_IMAGES_COUNT) {
        return translator(info.language, 'products.images.length.error', {
          Max: PRODUCTS_MAX_IMAGES_COUNT,
          Min: PRODUCTS_MIN_IMAGES_COUNT,
        })
      }
    }
    return null
  }

  const validateOfferForm = (): boolean => {
    let valid = false
    valid = !offerForm.validate().hasErrors
    if (!valid) return false
    if (identityForm.values.has_variations && offerWithVariantFormRef.current) {
      const form = offerWithVariantFormRef.current.getForm()
      valid = !form.validate().hasErrors
    } else {
      valid = !offerWithouVariantForm.validate().hasErrors
    }

    const base = offerForm.getValues()
    const withoutVariant = offerWithouVariantForm.getValues()
    const withVariant = offerWithVariantFormRef.current?.getForm
    setProductOfferFormValues({
      base,
      withoutVariant,
      withVariant: withVariant ? withVariant().getValues() : undefined,
    })
    return valid
  }

  const validateSafetyForm = (): boolean => {
    let valid = false
    const form = safetyFormRef.current?.getForm
    if (form) {
      valid = !form().validate().hasErrors
      setProductSafetyFormValues(form().getValues())
    }
    return valid
  }

  const prevStep = () => {
    const sharedForm = detailsFormRef.current?.getForm()
    const varForm = detailsFormRef.current?.getVariationsForm
    if (sharedForm) setProductDetailsFormValues(sharedForm.getValues())
    if (varForm) {
      const values = varForm().getValues()
      const titles = values.variations.map((variation) => ({
        label: variation['title'] as string,
        value: variation['id'] as string,
      }))
      setProductDetailsVariationFormValues(values)
      setProductDetailsVariationsTitles(titles)
    }
    if (active === 4) {
      const base = offerForm.getValues()
      const withoutVariant = offerWithouVariantForm.getValues()
      const withVariant = offerWithVariantFormRef.current?.getForm
      setProductOfferFormValues({
        base,
        withoutVariant,
        withVariant: withVariant ? withVariant().getValues() : undefined,
      })
    } else if (active === 5 && safetyFormRef.current) {
      setProductSafetyFormValues(safetyFormRef.current.getForm().getValues())
    }

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
      const newAttachment = await buildAttachment(f)
      setImages((prevImages) => [...prevImages, newAttachment])
    }

    const handleFileRemoved = (f: UppyFile<Meta, Record<string, never>>) => {
      setImages((prevImages) => prevImages.filter((img) => img.id !== f.id))
    }

    const handleEditComplete = async (f: UppyFile<Meta, Record<string, never>>) => {
      const newAttachment = await buildAttachment(f)
      setImages((prevImages) => [...prevImages.filter((img) => img.id !== f.id), newAttachment])
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
  }, [uppy])

  // Return a stable object without causing re-renders
  return {
    info,
    active,
    setActive,
    identityForm,
    descForm,
    detailsFormRef,
    offerForm,
    offerWithouVariantForm,
    offerWithVariantFormRef,
    productDetailsLoading,
    uppy,
    images,
    setImages,
    variantsImages,
    setVariantsImages,
    safetyFormRef,
    nextStep,
    prevStep,
  }
}

export default ProductCreateHooks
