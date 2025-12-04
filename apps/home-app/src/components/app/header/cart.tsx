'use client'
import { useCartStore } from '@/store/cart'
import { Badge, HoverCard, Group, Text, Stack, Button, ScrollArea } from '@mantine/core'
import { IconShoppingCart, IconTrash, IconShoppingCartOff } from '@tabler/icons-react'

type Props = {
  tr: Record<string, string> // Translations
}

function Cart({ tr }: Props) {
  const { items, total, removeItem, clearCart } = useCartStore()
  const itemsNumber = items.length

  return (
    <HoverCard width={320} shadow='md' position='bottom-end'>
      <HoverCard.Target>
        <div className='flex h-full items-center gap-x-2 px-3 cursor-pointer'>
          <IconShoppingCart size={36} />
          <div className='flex flex-col justify-evenly h-full'>
            <Badge className='bg-black/90 text-white font-bold'>{itemsNumber}</Badge>
            <p>{tr.cart}</p>
          </div>
        </div>
      </HoverCard.Target>

      <HoverCard.Dropdown>
        <div className='p-2'>
          <Group justify='space-between' mb='sm'>
            <Text size='lg' fw={700}>
              {tr.cart}
            </Text>
            {itemsNumber > 0 && (
              <Button size='xs' variant='subtle' color='red' onClick={clearCart}>
                {tr.clearCart}
              </Button>
            )}
          </Group>

          {itemsNumber === 0 && (
            <div className='py-8 flex flex-col items-center justify-center'>
              <IconShoppingCartOff size={48} className='text-gray-300 mb-3' />
              <Text c='dimmed' ta='center' mb='md'>
                {tr.cartEmpty}
              </Text>
              <Button
                variant='outline'
                color='orange'
                size='sm'
                onClick={() => {
                  // You can add navigation to products page here
                  console.log('Navigate to shop')
                }}>
                {tr.startShopping}
              </Button>
            </div>
          )}

          {itemsNumber > 0 && (
            <>
              <ScrollArea.Autosize mah={340} type='scroll' scrollbarSize={6}>
                <Stack gap='xs' pr='xs'>
                  {items.map((item) => (
                    <Group key={item.id} justify='space-between' className='border-b border-gray-100 pb-2'>
                      <div className='flex-1'>
                        <Text size='sm' fw={500} lineClamp={1}>
                          {item.name}
                        </Text>
                        <Text size='xs' c='dimmed'>
                          {item.quantity} × ${item.price.toFixed(2)}
                        </Text>
                      </div>
                      <Text fw={600}>${(item.quantity * item.price).toFixed(2)}</Text>
                      <Button size='xs' variant='subtle' color='red' onClick={() => removeItem(item.id)}>
                        <IconTrash size={16} />
                      </Button>
                    </Group>
                  ))}
                </Stack>
              </ScrollArea.Autosize>

              <Group justify='space-between' mt='md' pt='md' className='border-t border-gray-200'>
                <Text fw={700}>{tr.total}:</Text>
                <Text fw={700} size='lg' className='text-orange-500'>
                  ${total.toFixed(2)}
                </Text>
              </Group>
              <Button
                component='a'
                href={'/checkout'}
                fullWidth
                variant='filled'
                color='red'
                mt='md'
                className='py-2 font-bold'>
                {tr.checkout}
              </Button>
            </>
          )}
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default Cart
