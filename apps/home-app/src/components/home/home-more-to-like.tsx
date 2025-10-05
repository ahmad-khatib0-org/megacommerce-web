'use client'
import Image from "next/image"
import { Rating } from "@mantine/core"
import { IconArrowRight } from "@tabler/icons-react"
import { ObjString } from "@megacommerce/shared"

import { ProductItem, ProductItemMetadata, ProductItemMetadataType } from "@megacommerce/proto/web/products/v1/product_list"
import { Assets } from "@/helpers/shared"

type Props = {
  tr: ObjString
}

function HomeMoreToLike({ tr }: Props) {
  const items: ProductItem[] = [
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-4$" },
      rating: 4.5,
      sold: 200,
      meta: [
        { type: ProductItemMetadataType.CUPON, label: '3$ off on 15$' },
        { type: ProductItemMetadataType.NEW_SHOPPER, label: 'New shoppers save 1.5$' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-4$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 2$ off' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, savePercentage: "-10%" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, savePercentage: "-20%" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-5$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-5$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $' },
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-4$" },
      rating: 4.5,
      sold: 200,
      meta: [
        { type: ProductItemMetadataType.CUPON, label: '3$ off on 15$' },
        { type: ProductItemMetadataType.NEW_SHOPPER, label: 'New shoppers save 1.5$' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-4$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 2$ off' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, savePercentage: "-10%" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, savePercentage: "-20%" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-5$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $', discountPrice: 30.12, saveAmount: "-5$" },
      rating: 4.5,
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    },
    {
      id: 'id',
      image: '/images/login.png',
      title: "the product name is the product name is the product ...",
      price: { amount: 34.44, formatted: '34.44 $' },
      sold: 300,
      meta: [
        { type: ProductItemMetadataType.BUNDLE, label: 'Buy 3 and get 1' },
      ]
    }
  ]

  const buildMetaItem = (meta: ProductItemMetadata, idx: number) => {
    switch (meta.type) {
      case ProductItemMetadataType.CUPON:
        return <div key={idx} className="flex items-center gap-x-1 px-1">
          <Image src={Assets.percentage} alt="percentage" sizes="16px" width={16} height={16} className="object-fill" />
          <p className="text-red-400">{meta.label}</p>
        </div>
      case ProductItemMetadataType.BUNDLE:
        return <div key={idx} className="flex items-center gap-x-1 px-1">
          <p className="font-light">{meta.label}</p>
          <IconArrowRight size={20} />
        </div>
      case ProductItemMetadataType.NEW_SHOPPER:
        return <div key={idx} className="flex items-center gap-x-1 px-1">
          <Image src={Assets.arrowDown} alt={meta.label} sizes="16px" width={16} height={16} className="object-fill" />
          <p className="text-red-400">{meta.label}</p>
        </div>
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,240px))] w-[94%] mx-auto gap-x-3 gap-y-6">
      {items.map((p, idx) => <div key={idx} className="grid grid-rows-[208px,1fr] border border-transparent hover:border hover:border-black/20 hover:shadow-sm pb-2">
        <div className="relative h-52 w-full">
          <Image src={p.image} alt={p.title} fill sizes="100%" />
        </div>
        <div className="flex flex-col justify-evenly">
          <p className="line-clamp-1 px-1">{p.title}</p>
          <div className="flex items-center gap-x-1 h-7 px-1">
            <p className="font-bold">{p.price?.formatted}</p>
            {p.price?.discountPrice && <p className="line-through font-light text-sm">{p.price.discountPrice}</p>}
            {(p.price?.savePercentage || p.price?.saveAmount) &&
              <p className="font-normal text-red-500 text-sm">{p.price?.savePercentage ?? p.price?.saveAmount}</p>
            }
          </div>
          {(p.rating || p.sold) && <div className="flex items-center gap-x-1 px-1">
            {p.rating && <div className="flex items-center gap-x-0.5">
              <Rating readOnly defaultValue={p.rating} fractions={2} />
              {p.rating}
              <p>|</p>
            </div>}
            {p.sold} {tr.sold}
          </div>}
          {p.meta.map((m, idx) => buildMetaItem(m, idx))}
        </div>
      </div>)}
    </div>
  )
}

export default HomeMoreToLike

