'use client'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button } from '@mantine/core'
import { toast } from 'react-toastify'

type Props = {
  steps: React.ReactNode[]
  labels: string[]
  clickNext: string
  nextMsg: string
  prevMsg: string
  subMsg: string
  onNext: (idx: number) => Promise<boolean>
  onSubmit: () => void
  className?: string
}

export type StepperHandle = {
  updateStep: (idx: number) => void
}

export const Stepper = forwardRef<StepperHandle, Props>(
  ({ labels, steps, clickNext, nextMsg, prevMsg, className, onNext, onSubmit, subMsg }, ref) => {
    const [current, setCurrent] = useState(0)

    useImperativeHandle(ref, () => ({
      updateStep: (idx: number) => setCurrent(idx),
    }))

    const onStepClick = async (idx: number) => {
      if (idx > current) {
        toast(clickNext)
        return
      }
      setCurrent(idx)
    }

    const onClickNext = async () => {
      if (await onNext(current)) setCurrent((prev) => prev + 1)
    }

    const onClickPrev = () => {
      if (current > 0) setCurrent((prev) => prev - 1)
    }

    return (
      <div className={`flex flex-col gap-y-4 items-center *:w-full w-full ${className ?? ''}`}>
        <ul className="flex items-center gap-x-8">
          {labels.map((step, idx) => {
            const isCompleted = idx < current
            const isCurrent = idx === current
            const isUpcoming = idx > current

            return (
              <li
                key={step}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onStepClick(idx)}>
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-xl font-medium mb-1
                  ${isCompleted ? 'bg-orange-500 text-white' : ''}
                  ${isCurrent ? 'bg-white border-[5px] border-orange-500 text-orange-500' : ''}
                  ${isUpcoming ? 'border border-orange-300 text-orange-300' : ''}
                `}>
                  {idx + 1}
                </div>
                <span className="text-base text-gray-600 font-bold">{step}</span>
              </li>
            )
          })}
        </ul>
        <div className="mb-auto">{steps[current]}</div>
        <div className="flex justify-around items-center mt-auto">
          <Button onClick={() => onClickPrev()} title={prevMsg}>
            {prevMsg}
          </Button>
          {current + 1 < steps.length && (
            <Button
              onClick={() => onClickNext()}
              title={nextMsg}
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              variant="gradient">
              {nextMsg}
            </Button>
          )}
          {current + 1 === steps.length && (
            <Button onClick={() => onSubmit()} title={subMsg}>
              {subMsg}
            </Button>
          )}
        </div>
      </div>
    )
  },
)
