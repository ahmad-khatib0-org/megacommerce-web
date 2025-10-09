'use client'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.min.css'
import { Button, Stepper } from "@mantine/core"
import { ObjString } from "@megacommerce/shared"

import ProductCreateHooks from "@/components/products/create/product-create-hooks"
import ProductCreateIdentity, { Category } from "@/components/products/create/product-create-identity"
import ProductCreateDescription from "@/components/products/create/product-create-description"
import ProductCreateMedia from "@/components/products/create/product-create-media"

type Props = {
  tr: ObjString
  categories: Category[]
}

const ProductCreateWrapper = ({ tr, categories }: Props) => {
  const { active, setActive, identityForm, descForm, nextStep, prevStep, uppy } = ProductCreateHooks({ tr })

  return (
    <main>
      <section className="grid grid-rows-[1fr,auto] bg-slate-100/90 min-h-screen max-h-screen w-screen">
        <Stepper
          active={active}
          onStepClick={setActive}
          // allowNextStepsSelect={false}
          className="bg-white"
          styles={{
            root: { width: '100vw', display: 'flex', flexDirection: 'column', overflowY: 'hidden' },
            separator: { display: "none" },
            step: { display: "felx", flexDirection: 'column', rowGap: '1rem' },
            steps: { marginTop: '1rem', justifyContent: 'space-evenly', width: '100%' },
            content: { display: 'flex', justifyContent: 'center', padding: '2rem 0px', overflowY: 'auto' },
          }}>
          <Stepper.Step label={tr.proIden} aria-label={tr.proIden} >
            <ProductCreateIdentity tr={tr} form={identityForm} categories={categories} />
          </Stepper.Step>
          <Stepper.Step label={tr.proDesc} aria-label={tr.proDesc} >
            <ProductCreateDescription tr={tr} form={descForm} />
          </Stepper.Step>
          <Stepper.Step label={tr.proMedia} aria-label={tr.proMedia} >
            <ProductCreateMedia uppy={uppy} tr={tr} />
          </Stepper.Step>
          <Stepper.Step label={tr.offer} aria-label={tr.offer} >
          </Stepper.Step>
          <Stepper.Step label={tr.safety} aria-label={tr.safety} >
          </Stepper.Step>
        </Stepper>
        <div className="flex items-center justify-between px-12 border-t py-4">
          <Button>{tr.can}</Button>
          <div className="flex items-center gap-x-4">
            <Button onClick={prevStep} variant="default">{tr.back}</Button>
            <Button onClick={nextStep}>{tr.svAndCon}</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductCreateWrapper
