"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  slug: string
  title: string
  collectionLabel: string
  image: string
  size: string
  price: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
  clear: () => void
}

export const cartKey = (item: Pick<CartItem, 'productId' | 'size'>) => `${item.productId}:${item.size}`

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = cartKey(item)
          const existing = state.items.find((cartItem) => cartKey(cartItem) === key)

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartKey(cartItem) === key
                  ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                  : cartItem,
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          }
        }),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => cartKey(item) !== key),
        })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            cartKey(item) === key ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'ukish-cart',
    },
  ),
)
