'use client'
import { useState } from 'react'
import { Button } from '@mantine/core'
import { toast } from 'react-toastify'

type Props = {
  steps: React.ReactNode[]
  labels: string[]
  clickNext: string
  nextMsg: string
  prevMsg: string
  className?: string
}

export function Stepper({ labels, steps, clickNext, nextMsg, prevMsg, className }: Props) {
  const [current, setCurrent] = useState(0)

  const onStepClick = async (idx: number) => {
    if (idx > current) {
      toast(clickNext)
      return
    }
    setCurrent(idx)
  }

  return (
    <div className={`flex flex-col items-center *:w-full w-full ${className ?? ''}`}>
      <ul className="flex items-center gap-8 mb-4">
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
      <div className="mt-4">{steps[current]}</div>
      <div className="flex justify-around items-center mt-10">
        <Button title={prevMsg}>{prevMsg}</Button>
        <Button title={nextMsg} gradient={{ from: 'blue', to: 'cyan', deg: 90 }} variant="gradient">
          {nextMsg}
        </Button>
      </div>
    </div>
  )
}
