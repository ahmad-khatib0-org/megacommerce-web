'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 89.99,
          quantity: 1,
          image: '/images/login.png',
        },
        {
          id: '2',
          name: 'Smart Watch Series 5',
          price: 199.99,
          quantity: 1,
          image: '/images/login.png',
        },
        {
          id: '3',
          name: 'USB-C Fast Charger',
          price: 24.99,
          quantity: 2,
          image: '/images/login.png',
        },
      ],
      total: 339.96, // Calculated: 89.99 + 199.99 + (24.99 * 2)

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)

          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
            const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return { items: updatedItems, total: newTotal }
          } else {
            const newItems = [...state.items, item]
            const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return { items: newItems, total: newTotal }
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const filteredItems = state.items.filter((item) => item.id !== id)
          const newTotal = filteredItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: filteredItems, total: newTotal }
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => {
          const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
          const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items: updatedItems, total: newTotal }
        })
      },

      clearCart: () => {
        set({ items: [], total: 0 })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
