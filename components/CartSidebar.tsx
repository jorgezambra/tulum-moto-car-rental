'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import BookingModal from './BookingModal'

interface CartSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function CartSidebar({ isOpen: externalIsOpen, onClose: externalOnClose }: CartSidebarProps = {} as CartSidebarProps) {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose()
    } else {
      setInternalIsOpen(false)
    }
  }

  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Cart Button - Only show if not externally controlled */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-turquoise hover:bg-reef-deep text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 flex items-center gap-2"
          aria-label="Open cart"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {t('cart.title') || 'Your Cart'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close cart"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {t('cart.empty') || 'Your cart is empty'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={`${item.vehicle.id}-${index}`}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.vehicle.images[0]}
                              alt={item.vehicle.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {item.vehicle.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.startDate.toLocaleDateString()} -{' '}
                              {item.endDate.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.days} {t('vehicle.booking.days') || 'days'}
                            </p>
                            <p className="text-turquoise font-bold mt-1">
                              {formatPrice(item.total, { includeSuffix: false })}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.vehicle.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {t('cart.total') || 'Total'}
                    </span>
                    <span className="text-2xl font-bold text-turquoise">
                      {formatPrice(totalPrice, { includeSuffix: false })}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCheckout(true)
                      handleClose()
                    }}
                    className="w-full bg-turquoise hover:bg-reef-deep text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t('cart.checkout') || 'Complete Reservation'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      {showCheckout && (
        <BookingModal
          cartItems={items}
          onClose={() => {
            setShowCheckout(false)
            clearCart()
          }}
        />
      )}
    </>
  )
}

