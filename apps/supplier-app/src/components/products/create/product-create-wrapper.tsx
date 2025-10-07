'use client'
import { useState } from "react"
import { Button, Stepper } from "@mantine/core"
import { ObjString } from "@megacommerce/shared"

type Props = {
  tr: ObjString
}

const ProductCreateWrapper = ({ tr }: Props) => {
  const [active, setActive] = useState(1);

  const nextStep = () => {
    setActive((current) => (current < 6 ? current + 1 : current))
  }
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <main>
      <section className="grid grid-rows-[1fr,auto] bg-slate-50 min-h-screen">
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          className="bg-white"
          styles={{
            separator: { display: "none" },
            step: { display: "felx", flexDirection: 'column', rowGap: '1rem' }
          }}>
          <Stepper.Step label={tr.proIden} aria-label={tr.proIden} >
          </Stepper.Step>
          <Stepper.Step label={tr.proDesc} aria-label={tr.proDesc} >
          </Stepper.Step>
          <Stepper.Step label={tr.proVar} aria-label={tr.proVar} >
          </Stepper.Step>
          <Stepper.Step label={tr.proMedia} aria-label={tr.proMedia} >
          </Stepper.Step>
          <Stepper.Step label={tr.offer} aria-label={tr.offer} >
          </Stepper.Step>
          <Stepper.Step label={tr.safety} aria-label={tr.safety} >
          </Stepper.Step>
        </Stepper>
        <div className="flex items-center justify-between px-12 border-t py-4">
          <Button>{tr.can}</Button>
          <div className="flex items-center gap-x-4">
            <Button variant="default" onClick={prevStep}>{tr.back}</Button>
            <Button onClick={nextStep}>{tr.svAndCon}</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductCreateWrapper
