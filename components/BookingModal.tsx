'use client'

import { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CartItem } from '@/contexts/CartContext'

interface BookingModalProps {
  cartItems?: CartItem[]
  vehicle?: any
  startDate?: Date
  endDate?: Date
  deliveryEnabled?: boolean
  insuranceEnabled?: boolean
  pickupTime?: string
  dropoffTime?: string
  total?: number
  subtotal?: number
  discount?: number
  discountPercent?: number
  onClose: () => void
}

export default function BookingModal({
  cartItems = [],
  vehicle,
  startDate,
  endDate,
  deliveryEnabled = false,
  insuranceEnabled = false,
  pickupTime = '10:00',
  dropoffTime = '10:00',
  total,
  subtotal,
  discount,
  discountPercent,
  onClose,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'in-person' | 'mercado-pago' | null>(null)
  const { formatPrice, currency } = useCurrency()
  const { t } = useLanguage()

  // Calculate totals from cart items if available
  const items = cartItems.length > 0 ? cartItems : []
  const totalPrice = items.length > 0
    ? items.reduce((sum, item) => sum + item.total, 0)
    : total || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.whatsapp) {
      alert(t('booking.fillFields') || 'Please fill in all required fields')
      return
    }
    setPaymentMethod('in-person')
  }

  const handleWhatsApp = () => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      alert(t('booking.fillFields') || 'Please fill in all required fields')
      return
    }

    // Generate structured message
    let message = `🚗 *Rental Request - Tulum OnWheels*\n\n`
    message += `*Customer Information:*\n`
    message += `Name: ${formData.name}\n`
    message += `Email: ${formData.email}\n`
    message += `WhatsApp: ${formData.whatsapp}\n\n`
    
    message += `*Rental Details:*\n`
    
    if (items.length > 0) {
      items.forEach((item, index) => {
        message += `\n*Vehicle ${index + 1}:* ${item.vehicle.name}\n`
        message += `Dates: ${item.startDate.toLocaleDateString()} ${item.pickupTime} - ${item.endDate.toLocaleDateString()} ${item.dropoffTime}\n`
        message += `Duration: ${item.days} days (${item.hours.toFixed(1)} hours)\n`
        if (item.deliveryEnabled) message += `✓ Delivery to location\n`
        if (item.insuranceEnabled) message += `✓ Insurance coverage\n`
        message += `Subtotal: ${formatPrice(item.subtotal, { includeSuffix: false })}\n`
        if (item.discount > 0) {
          message += `Discount (${item.discountPercent}%): -${formatPrice(item.discount, { includeSuffix: false })}\n`
        }
        message += `Total: ${formatPrice(item.total, { includeSuffix: false })}\n`
      })
    } else if (vehicle) {
      message += `Vehicle: ${vehicle.name}\n`
      message += `Dates: ${startDate?.toLocaleDateString()} ${pickupTime} - ${endDate?.toLocaleDateString()} ${dropoffTime}\n`
      if (deliveryEnabled) message += `✓ Delivery to location\n`
      if (insuranceEnabled) message += `✓ Insurance coverage\n`
      message += `Total: ${formatPrice(totalPrice, { includeSuffix: false })}\n`
    }
    
    message += `\n*Payment Method:* ${paymentMethod === 'mercado-pago' ? 'Mercado Pago (Secure Payment)' : 'Pay in Person'}\n\n`
    message += `Total Amount: ${formatPrice(totalPrice, { includeSuffix: false })}\n\n`
    message += `Please confirm availability and provide payment instructions.`

    const whatsappUrl = `https://wa.me/5219841234567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  const handleMercadoPago = () => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      alert(t('booking.fillFields') || 'Please fill in all required fields')
      return
    }
    setPaymentMethod('mercado-pago')
    // In real implementation, this would redirect to Mercado Pago
    alert('Mercado Pago payment flow would open here. This is a mock implementation.')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {t('booking.title') || 'Complete Your Reservation'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
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

            {/* Booking Summary */}
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  {t('cart.items') || 'Your Items'}
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                      <p className="font-semibold text-gray-800">{item.vehicle.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.days} {t('vehicle.booking.days') || 'days'} • {formatPrice(item.total, { includeSuffix: false })}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    {t('cart.total') || 'Total'}
                  </span>
                  <span className="text-2xl font-bold text-turquoise">
                    {formatPrice(totalPrice, { includeSuffix: false })}
                  </span>
                </div>
              </div>
            )}

            {/* Customer Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t('booking.customerInfo') || 'Customer Information'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.name') || 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.email') || 'Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.whatsapp') || 'WhatsApp Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  placeholder="+52 984 123 4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>
            </form>

            {/* Payment Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t('booking.paymentOptions') || 'Payment Options'}
              </h3>

              {/* Pay in Person */}
              <button
                onClick={() => {
                  if (!formData.name || !formData.email || !formData.whatsapp) {
                    alert(t('booking.fillFields') || 'Please fill in all required fields')
                    return
                  }
                  setPaymentMethod('in-person')
                  handleWhatsApp()
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {t('booking.payInPerson') || 'Pay in Person'}
              </button>

              {/* Mercado Pago */}
              <button
                onClick={handleMercadoPago}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 relative"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-sm opacity-90">
                      {t('booking.securePayment') || 'Secure Payment via'}
                    </div>
                    <div className="text-lg">Mercado Pago</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('booking.secure') || 'Secure Payment'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('booking.verified') || 'Verified Business'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('booking.instant') || 'Instant Confirmation'}</span>
                </div>
              </div>
              
              {/* Mercado Pago Logo */}
              <div className="flex justify-center">
                <div className="bg-gray-50 rounded-lg p-4 inline-flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {t('booking.poweredBy') || 'Powered by'}
                  </span>
                  <div className="text-blue-600 font-bold text-lg">Mercado Pago</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
