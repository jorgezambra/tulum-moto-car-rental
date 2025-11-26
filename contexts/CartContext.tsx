'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Vehicle } from '@/types'

export interface CartItem {
  vehicle: Vehicle
  startDate: Date
  endDate: Date
  pickupTime: string
  dropoffTime: string
  deliveryEnabled: boolean
  insuranceEnabled: boolean
  subtotal: number
  discount: number
  discountPercent: number
  total: number
  days: number
  hours: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (vehicleId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeFromCart = (vehicleId: string) => {
    setItems((prev) => prev.filter((item) => item.vehicle.id !== vehicleId))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const getTotalItems = () => {
    return items.length
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

