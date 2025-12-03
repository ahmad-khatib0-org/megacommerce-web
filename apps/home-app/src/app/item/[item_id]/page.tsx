import { redirect } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'

import { Trans } from '@megacommerce/shared/server'
import { SearchParams } from '@megacommerce/shared'
import { ServerError } from '@megacommerce/ui/server'

import ProductDetailsMedia from '@/components/products/product-details-media'
import { getProduct, getTrans } from '@/app/item/[item_id]/helpers'
import ProductDetailsBuy from '@/components/products/product-details-buy'

type Props = {
  searchParams: SearchParams
  params: Promise<{ item_id: string }>
}

async function Page({ params }: Props) {
  const { item_id } = await params
  const lang = await Trans.getUserLang()
  const result = await getProduct(lang, item_id)
  const tr = getTrans(lang)

  if ('err' in result && 'notFound' in result) {
    if (result.notFound) {
      const searchParams = new URLSearchParams({ message: result.err, code: '404' })
      redirect(`/not-found?${searchParams.toString()}`)
    }
    return <ServerError />
  } else {
    return (
      <>
        <main>
          <section className='grid grid-cols-[75%_25%] px-4 pt-4'>
            <div className='flex'>
              <ProductDetailsMedia media={result.media!} />
              <div className='flex justify-center items-center gap-x-2'>
                {result.brandName && (
                  <div className='flex justify-center items-center bg-blue-500 px-2 py-1 rounded-md text-white'>
                    <p>{result.brandName}</p>
                    <IconPlus color='yellow' className='font-bold' />
                  </div>
                )}
                <h1 className='font-bold text-2xl'>{result.title}</h1>
              </div>
            </div>
            <ProductDetailsBuy
              tr={tr}
              soldBy={'Zara corpuration ICI'}
              price={45.66}
              deliveryDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
              shipTo='France, Paris, street...'
              shippingPrice={0}
            />
          </section>
        </main>
      </>
    )
  }
}

export default Page
