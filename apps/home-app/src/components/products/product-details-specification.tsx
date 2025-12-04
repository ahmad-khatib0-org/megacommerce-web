'use client'

import { ObjString } from '@megacommerce/shared'

type Specification = {
  key: string
  value: string
}

type SpecsTableProps = {
  specifications: Specification[]
  tr: ObjString
}

function ProductDetailsSpecification({ specifications, tr }: SpecsTableProps) {
  const mockSpecs: Specification[] = [
    { key: 'Brand Name', value: 'MegaBrand' },
    { key: 'Item Type', value: 'T-Shirt' },
    { key: 'Material', value: 'Cotton, Polyester' },
    { key: 'Applicable Season', value: 'Spring and Summer' },
    { key: 'Pattern Type', value: 'Geometric' },
    { key: 'Collar', value: 'O-Neck' },
  ]
  const effectiveSpecs = specifications.length > 0 ? specifications : mockSpecs

  return (
    <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm py-6 my-10'>
      <h2 className='text-xl font-bold mb-4'>{tr.specifications}</h2>
      <div className='divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden'>
        {effectiveSpecs.map((spec, index) => (
          <div key={index} className='flex bg-gray-50 even:bg-white'>
            <span className='w-1/3 p-3 text-sm font-medium text-gray-600 shrink-0 border-r border-gray-100'>
              {spec.key}
            </span>
            <span className='flex-1 p-3 text-sm text-gray-800'>{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetailsSpecification
