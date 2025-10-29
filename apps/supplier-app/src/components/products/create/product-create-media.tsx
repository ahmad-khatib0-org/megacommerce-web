import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import { Button, HoverCard, Select } from '@mantine/core'
import { IconSquareX } from '@tabler/icons-react'
import { toast } from 'react-toastify'

import { Attachment } from '@megacommerce/proto/web/shared/v1/attachment'
import { Button as SharedButton } from '@megacommerce/ui/shared'
import { ObjString, PRODUCTS_MAX_IMAGES_COUNT } from '@megacommerce/shared'
import { useProductsStore } from '@/store'

type Props = {
  tr: ObjString
  uppy: Uppy
  errMsg?: string
  images: Attachment[]
  setImages: Dispatch<SetStateAction<Attachment[]>>
  variantsImages: { [key: string]: { title: string; images: Attachment[] } }
  setVariantsImages: Dispatch<SetStateAction<{ [key: string]: { title: string; images: Attachment[] } }>>
}

function ProductCreateMedia({
  tr,
  uppy,
  errMsg,
  images,
  setImages,
  variantsImages,
  setVariantsImages,
}: Props) {
  const titles = useProductsStore((state) => state.product_details_variations_titles)
  const [title, setTitle] = useState<string | null>('')
  const [showAssign, setShowAssign] = useState(false)

  const assignImages = () => {
    if (!title) {
      toast.error(tr.assignErr)
      return
    }

    const currentImages = images
    if (currentImages.length === 0) {
      toast.error(tr.noImagesToAssign)
      return
    }

    // Update variants images
    setVariantsImages((prevVariants) => {
      const existing = prevVariants[title!]
      const newVariants = { ...prevVariants }

      if (existing) {
        const length = existing.images.length + currentImages.length
        if (length > PRODUCTS_MAX_IMAGES_COUNT) {
          toast.error(tr.maxForVar)
          return prevVariants
        }
        const varImages = [...existing.images, ...currentImages]
        newVariants[title!] = {
          images: varImages,
          title: titles.find((t) => t.value === title)?.label ?? '',
        }
      } else {
        if (currentImages.length > PRODUCTS_MAX_IMAGES_COUNT) {
          toast.error(tr.maxForVar)
          return prevVariants
        }
        newVariants[title!] = {
          images: [...currentImages],
          title: titles.find((t) => t.value === title)?.label ?? '',
        }
      }
      return newVariants
    })

    // These state updates must happen after setVariantsImages
    setImages([])
    uppy.clear()
    setShowAssign(false)
  }

  const handleShowButton = () => {
    const len = uppy.getFiles().length
    if (len > 0 && !showAssign) {
      setShowAssign(true)
    } else if (len === 0 && showAssign) {
      setShowAssign(false)
    }
  }

  const removeVariantImage = (variant: string, fileID: string) => {
    const toastId = Date.now().toString()
    const confirmDelete = () => {
      const existing = variantsImages[variant]
      if (!existing) {
        toast.error(tr.imgNotFound)
        return
      }
      existing.images = existing.images.filter((img) => img.id !== fileID)
      const newVariants = { ...variantsImages }
      newVariants[variant] = existing
      setVariantsImages(newVariants)
    }
    toast.warn(
      <div className='flex flex-col px-6'>
        <p className='font-light'>{tr.rmImgVar}</p>
        <div className='flex gap-6 mt-2'>
          <SharedButton onClick={() => toast.dismiss(toastId)} className='border border-orange-300'>
            {tr.can}
          </SharedButton>
          <SharedButton
            className='bg-orange-400 text-white'
            onClick={() => {
              confirmDelete()
              toast.dismiss(toastId)
            }}>
            {tr.confirm}
          </SharedButton>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, toastId }
    )
  }

  useEffect(() => {
    handleShowButton()
  }, [uppy.getFiles().length])

  return (
    <div className='flex flex-col justify-center w-full px-2 mt-4 h-full'>
      {errMsg && <p className='block font-medium text-center my-3 text-red-500 text-lg'>{errMsg}</p>}
      <div className='grid grid-cols-[62%,1fr] h-full'>
        <div className='flex flex-col'>
          <p className='text-center my-4'>{tr.proMediaDesc}</p>
          {titles.length > 0 && (
            <div className='flex justify-evenly items-end mb-2'>
              <Select
                className='w-80'
                styles={{ dropdown: { zIndex: 99999 } }}
                label={tr.imgRelVar}
                placeholder={tr.varImages}
                aria-label={tr.varImages}
                data={titles}
                value={title}
                onChange={setTitle}
                allowDeselect={false}
                withAsterisk
                size='sm'
              />
              {showAssign && (
                <HoverCard width={380} shadow='md'>
                  <HoverCard.Target>
                    <Button onClick={() => assignImages()}>{tr.assign}</Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown style={{ zIndex: 999999 }}>
                    <p>{tr.assignInfo}</p>
                  </HoverCard.Dropdown>
                </HoverCard>
              )}
            </div>
          )}
          <Dashboard
            uppy={uppy}
            height={350}
            width='100%'
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
      {Object.keys(variantsImages).length > 0 &&
        Object.keys(variantsImages).map((variant) => {
          return (
            <div key={variant} className='flex flex-col border border-black/70 px-2 py-4 mb-8'>
              <p className='text-center mb-2 font-medium w-full border border-orange-300 py-3'>
                {tr.imgRelVar}: {variantsImages[variant].title}
              </p>
              <div className='flex flex-wrap gap-x-6 gap-y-4 mt-2'>
                {variantsImages[variant].images.map((img) => {
                  return (
                    <div
                      key={img.id}
                      className='relative size-60 border border-black/20 rounded-md shadow-sm'>
                      <Image
                        src={img.base64}
                        alt={img.filename}
                        sizes='100%'
                        fill
                        className='object-cover rounded-md'
                      />
                      <div
                        onClick={() => removeVariantImage(variant, img.id)}
                        className='absolute -right-2 -top-2 bg-white cursor-pointer'>
                        <IconSquareX />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ProductCreateMedia
