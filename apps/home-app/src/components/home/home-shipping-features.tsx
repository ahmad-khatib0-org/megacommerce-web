'use client'
import Image from "next/image"
import { Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

import { ObjString } from "@megacommerce/shared"
import { Assets } from "@/helpers/shared"

type Props = {
  tr: ObjString
}

function HomeShippingFeatures({ tr }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const Item = (img: string, text: string, onClick = true) => {
    return <div onClick={onClick ? () => open() : () => { }} className="flex justify-center items-center gap-x-2">
      <div className="relative size-8">
        <Image src={img} alt={text} fill sizes="100%" className="object-cover" />
      </div>
      <p className="text-[#633201] font-bold">{text}</p>
    </div>

  }

  return <>
    <div className="bg-slate-200/60 flex justify-evenly items-center py-4">
      {Item(Assets.freeShipping, tr.freeShipping)}
      {Item(Assets.fastDelivery, tr.fastDelivery)}
      {Item(Assets.freeReturn, tr.freeReturn)}
    </div>
    <Modal.Root opened={opened} onClose={close}>
      <Modal.Overlay />
      <Modal.Content className="rounded-xl">
        <Modal.Header>
          <Modal.Title>{tr.commit}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-start">
            {Item(Assets.freeShipping, tr.freeShipping, false)}
            <p className="font-light mb-4 mt-1.5">{tr.freeShippingDesc}</p>
            {Item(Assets.fastDelivery, tr.fastDeliveryGet, false)}
            <p className="font-light mb-4 mt-1.5">{tr.fastDeliveryDesc}</p>
            {Item(Assets.freeReturn, tr.freeReturnOn, false)}
            <p className="font-light mb-4 mt-1.5">{tr.freeReturnDesc}</p>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>

  </>
}

export default HomeShippingFeatures
