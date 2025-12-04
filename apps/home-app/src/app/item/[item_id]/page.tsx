import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'

import { Trans } from '@megacommerce/shared/server'
import { SearchParams } from '@megacommerce/shared'
import { ServerError } from '@megacommerce/ui/server'

import ProductDetailsMedia from '@/components/products/product-details-media'
import ProductDetailsBuy from '@/components/products/product-details-buy'
import ProductDetailsPricing from '@/components/products/product-details-pricing'
import ProductDetailsInit from '@/components/products/product-details-init'
import ProductDetailsReviewStats from '@/components/products/product-details-review-stats'
import ProductDetailsReviewsFilter from '@/components/products/product-details-reviews-filter'
import ProductDetailsReviews from '@/components/products/product-details-reviews'
const ProductDetailsCategoryFashion = dynamic(
  () => import('@/components/products/product-details-category-fashion')
)

import { deserializeDetails, getProduct, getTrans } from '@/app/item/[item_id]/helpers'

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
    const details = await deserializeDetails(result.details!, lang, result.category, result.subcategory)
    return (
      <>
        <main>
          <ProductDetailsInit
            productId={result.id}
            details={details.details}
            initialOffer={result.offer!}
            initialCurrencyCode={result.currencyCode}
          />
          <section className='grid grid-cols-[75%_25%] px-4 pt-4'>
            <div className='flex flex-col gap-x-2 me-2'>
              <div className='flex gap-x-2'>
                <ProductDetailsMedia media={result.media!} />
                <div className='flex flex-col'>
                  <div className='mb-2'>
                    {result.brandName && (
                      <div className='inline-flex justify-center items-center bg-blue-500 px-2 py-0.5 rounded-md text-white mr-2 align-top'>
                        <p>{result.brandName}</p>
                        <IconPlus color='yellow' className='font-bold' />
                      </div>
                    )}
                    <h1 className='inline font-bold text-lg align-top'>{result.title}</h1>
                  </div>
                  <ProductDetailsPricing welcomeDealDiscount={10} />
                  <ProductDetailsCategoryFashion
                    productId={result.id}
                    details={details}
                    media={result.media!}
                  />
                </div>
              </div>
              <ProductDetailsReviewStats
                tr={tr}
                averageRating={4.5}
                totalReviews={100}
                ratingCounts={[
                  { star: 5, count: 10 },
                  { star: 4, count: 20 },
                  { star: 3, count: 30 },
                  { star: 2, count: 40 },
                  { star: 1, count: 50 },
                ]}
              />
              <ProductDetailsReviewsFilter filters={[]} currentFilter='all' tr={tr} />
              <ProductDetailsReviews />
            </div>
            <ProductDetailsBuy
              tr={tr}
              currency={result.currencyCode}
              soldBy={'Zara corpuration ICI'}
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
