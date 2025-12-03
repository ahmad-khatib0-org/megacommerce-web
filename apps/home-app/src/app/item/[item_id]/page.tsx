import { redirect } from 'next/navigation'

import { Trans } from '@megacommerce/shared/server'
import { SearchParams } from '@megacommerce/shared'
import { ServerError } from '@megacommerce/ui/server'

import ProductDetailsMedia from '@/components/products/product-details-media'
import { getProduct } from '@/app/item/[item_id]/helpers'

type Props = {
  searchParams: SearchParams
  params: Promise<{ item_id: string }>
}

async function Page({ params }: Props) {
  const { item_id } = await params
  const lang = await Trans.getUserLang()
  const result = await getProduct(lang, item_id)

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
          <section className='px-4 pt-4'>
            <ProductDetailsMedia media={result.media!} />
          </section>
        </main>
      </>
    )
  }
}

export default Page
