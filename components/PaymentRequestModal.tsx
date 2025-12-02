'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface BookingSummary {
  vehicleName: string
  quantity: number
  deliveryEnabled: boolean
  insuranceEnabled: boolean
  rentalPeriod: string
  pickupTime: string
  dropoffTime: string
  pricePerDay: string
  subtotal: string
  total: string
  deliveryFee: string | null
  insuranceFee: string | null
  days: number
}

interface PaymentRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; phone: string; email: string }) => void
  summary?: BookingSummary | null
}

export default function PaymentRequestModal({
  isOpen,
  onClose,
  onSubmit,
  summary,
}: PaymentRequestModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.classList.add('body-lock')
      
      // Prevent scroll on backdrop
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.classList.remove('body-lock')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('body-lock')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, phone, email })
    // Reset form
    setName('')
    setPhone('')
    setEmail('')
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
            style={{ touchAction: 'none' }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto my-auto"
              style={{ touchAction: 'auto' }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Payment Request
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {summary && (
                  <div className="mb-6 bg-turquoise/5 border border-turquoise/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle</p>
                        <p className="text-base font-bold text-gray-900">{summary.vehicleName}</p>
                      </div>
                      <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white border border-turquoise/30 text-reef-ink">
                        {summary.quantity}x
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-semibold">Rental:</span> {summary.rentalPeriod} ({summary.days}{' '}
                        {summary.days === 1 ? 'day' : 'days'})
                      </p>
                      <p>
                        <span className="font-semibold">Pickup:</span> {summary.pickupTime} ·{' '}
                        <span className="font-semibold">Dropoff:</span> {summary.dropoffTime}
                      </p>
                      <p>
                        <span className="font-semibold">Delivery:</span> {summary.deliveryEnabled ? 'Yes' : 'No'} ·{' '}
                        <span className="font-semibold">Insurance:</span> {summary.insuranceEnabled ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="border-t border-white/40 pt-3 space-y-1 text-sm text-gray-800">
                      <p className="flex justify-between">
                        <span>{summary.quantity} x {summary.pricePerDay}</span>
                        <span>{summary.subtotal}</span>
                      </p>
                      {summary.deliveryFee && (
                        <p className="flex justify-between text-gray-600">
                          <span>Delivery</span>
                          <span>{summary.deliveryFee}</span>
                        </p>
                      )}
                      {summary.insuranceFee && (
                        <p className="flex justify-between text-gray-600">
                          <span>Insurance</span>
                          <span>{summary.insuranceFee}</span>
                        </p>
                      )}
                      <p className="flex justify-between text-lg font-bold text-reef-ink">
                        <span>Total</span>
                        <span>{summary.total}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-turquoise hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg text-base transition-all transform hover:scale-105 shadow-lg"
                  >
                    Submit Payment Request
                  </button>
                </form>

                {/* Need to Know Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-base font-bold text-gray-800 mb-3 text-center">
                    {t('vehicle.policies.title')}
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-xs text-gray-600 border-2 border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-turquoise flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      {t('vehicle.policies.license')}
                    </li>
                    <li className="text-xs text-gray-600 border-2 border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-turquoise flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {t('vehicle.policies.deposit')}
                    </li>
                    <li className="text-xs text-gray-600 border-2 border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-turquoise flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('vehicle.policies.fuel')}
                    </li>
                    <li className="text-xs text-gray-600 border-2 border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-turquoise flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {t('vehicle.policies.support')}
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(modalContent, document.body)
}

