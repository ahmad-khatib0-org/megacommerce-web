'use client'
import { useState } from 'react'
import { IconChevronDown, IconChevronUp, IconQuestionMark, IconMessage } from '@tabler/icons-react'
import { Button } from '@mantine/core'

import { ObjString } from '@megacommerce/shared'

type FAQItem = {
  question: string
  answer: string
}

type FAQProps = {
  faqs: FAQItem[]
  tr: ObjString
}

function ProductDetailsFAQ({ faqs, tr }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const mockFaqs: FAQItem[] = [
    {
      question: 'Is this product available in other colors?',
      answer:
        'Yes, this model is also available in black, white, and gray. Please check the variant selection above.',
    },
    {
      question: 'What is the return period?',
      answer:
        'We offer a 30-day free return policy from the date of delivery. Items must be unused and in original packaging.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping usually takes 10-15 business days, but delivery dates can vary based on your location and are estimated in the "Buy Now" section.',
    },
  ]

  const effectiveFaqs = faqs.length > 0 ? faqs : mockFaqs

  return (
    <div className='qa--wrap--ZsIkLSs p-4 bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <IconQuestionMark size={24} className='text-red-500' />
          {tr.faq}
        </h2>
        <Button variant='light' color='red' size='sm' leftSection={<IconMessage size={18} />}>
          {tr.askAQuestion}
        </Button>
      </div>

      <div className='divide-y divide-gray-100'>
        {effectiveFaqs.map((faq, index) => (
          <div key={index} className='py-3'>
            <button
              className='flex justify-between items-start w-full text-left font-medium text-gray-800 hover:text-red-500 transition-colors'
              onClick={() => toggleFAQ(index)}>
              <span className='flex-1 pr-4'>{faq.question}</span>
              {openIndex === index ? (
                <IconChevronUp size={20} className='text-red-500 shrink-0' />
              ) : (
                <IconChevronDown size={20} className='text-gray-500 shrink-0' />
              )}
            </button>
            {openIndex === index && (
              <p className='mt-2 text-gray-600 text-sm pl-2 border-l-2 border-red-200 transition-all duration-300'>
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetailsFAQ
