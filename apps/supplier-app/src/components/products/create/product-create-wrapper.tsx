'use client'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.min.css'
import { Button, Stepper } from "@mantine/core"
import { ObjString, ValueLabel } from "@megacommerce/shared"

import ProductCreateHooks from "@/components/products/create/product-create-hooks"
import ProductCreateIdentity, { Category } from "@/components/products/create/product-create-identity"
import ProductCreateDescription from "@/components/products/create/product-create-description"
import ProductCreateMedia from "@/components/products/create/product-create-media"
import ProductCreateOffer from '@/components/products/create/product-create-offer'
import ProductCreateDetails from '@/components/products/create/product-create-details'

type Props = {
  tr: ObjString
  categories: Category[]
  offering: ValueLabel[]
  filfillment: ValueLabel[]
}

const ProductCreateWrapper = ({ tr, categories, offering, filfillment }: Props) => {
  const { active, setActive, identityForm, descForm, offerForm, offerWithouVariantForm, detailsFormRef, nextStep, prevStep, uppy, images, setImages, variantsImages, setVariantsImages } = ProductCreateHooks({ tr })

  return (
    <main>
      <section className="grid grid-rows-[1fr,auto] bg-slate-100/90 h-full">
        <Stepper
          active={active}
          onStepClick={setActive}
          // allowNextStepsSelect={false}
          className="bg-white"
          styles={{
            root: { width: '100%', display: 'flex', flexDirection: 'column' },
            separator: { display: "none" },
            step: { display: "felx", flexDirection: 'column', rowGap: '1rem' },
            steps: { marginTop: '1rem', justifyContent: 'space-evenly', width: '100%' },
            content: { display: 'flex', justifyContent: 'center', padding: '2rem 0px' },
          }}>
          <Stepper.Step label={tr.proIden} aria-label={tr.proIden} >
            <ProductCreateIdentity tr={tr} form={identityForm} categories={categories} />
          </Stepper.Step>
          <Stepper.Step label={tr.proDesc} aria-label={tr.proDesc} >
            <ProductCreateDescription tr={tr} form={descForm} />
          </Stepper.Step>
          <Stepper.Step label={tr.proDet} aria-label={tr.proDet} >
            <ProductCreateDetails reference={detailsFormRef} tr={tr} hasVariations={identityForm.values.has_variations} />
          </Stepper.Step>
          <Stepper.Step label={tr.proMedia} aria-label={tr.proMedia} >
            <ProductCreateMedia tr={tr} uppy={uppy} images={images} setImages={setImages} variantsImages={variantsImages} setVariantsImages={setVariantsImages} />
          </Stepper.Step>
          <Stepper.Step label={tr.offer} aria-label={tr.offer} >
            <ProductCreateOffer
              tr={tr}
              offering={offering}
              filfillment={filfillment}
              hasVariations={identityForm.values.has_variations}
              form={offerForm}
              withouVariantForm={offerWithouVariantForm}
            />
          </Stepper.Step>
          <Stepper.Step label={tr.safety} aria-label={tr.safety} >
          </Stepper.Step>
        </Stepper>
        <div className="flex items-center justify-between px-12 border-t py-4">
          <Button>{tr.can}</Button>
          <div className="flex items-center gap-x-4">
            <Button onClick={prevStep} variant="default">{tr.back}</Button>
            <Button onClick={async () => await nextStep()}>{tr.svAndCon}</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductCreateWrapper
