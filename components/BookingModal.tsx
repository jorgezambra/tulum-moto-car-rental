'use client'

import { useState } from 'react'
import { Vehicle } from '@/types'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingModalProps {
  vehicle: Vehicle
  startDate: Date
  endDate: Date
  deliveryEnabled: boolean
  total: number
  subtotal?: number
  discount?: number
  discountPercent?: number
  onClose: () => void
}

export default function BookingModal({
  vehicle,
  startDate,
  endDate,
  deliveryEnabled,
  total,
  subtotal,
  discount,
  discountPercent,
  onClose,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'mercado-pago' | 'whatsapp' | null>(null)
  const { formatPrice, currency } = useCurrency()
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real implementation, this would submit to backend
    console.log('Booking submitted:', {
      vehicle,
      dates: { startDate, endDate },
      formData,
      total,
      paymentMethod,
    })
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'd like to rent ${vehicle.name} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. Name: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}`
    const whatsappUrl = `https://wa.me/5219841234567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleMercadoPago = () => {
    // Mock Mercado Pago integration
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
                {t('booking.title')}
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
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-2">{t('booking.details')}</h3>
              <p className="text-gray-600">{vehicle.name}</p>
              <p className="text-gray-600">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </p>
              {deliveryEnabled && (
                <p className="text-gray-600">
                  Delivery to: {formData.deliveryAddress || 'Address to be provided'}
                </p>
              )}
              <div className="mt-4 space-y-1">
                {subtotal !== undefined && (
                  <div className="flex justify-between text-gray-600">
                    <span>{t('vehicle.booking.subtotal')}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                )}
                {discount !== undefined && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      {t('vehicle.booking.discount')} ({discountPercent}%)
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {deliveryEnabled && (
                  <div className="flex justify-between text-gray-600">
                    <span>{t('vehicle.booking.deliveryFee')}</span>
                    <span>{formatPrice(100)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-turquoise pt-2 border-t border-gray-300">
                  <span>{t('vehicle.booking.total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Guest Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.name')} *
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
                  {t('booking.email')} *
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
                  {t('booking.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>

              {deliveryEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking.deliveryAddress')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: e.target.value,
                      })
                    }
                    placeholder={t('booking.deliveryAddress')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  />
                </div>
              )}
            </form>

            {/* Payment Options */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">{t('booking.paymentOptions')}</h3>

              <button
                onClick={() => {
                  if (!formData.name || !formData.email || !formData.phone) {
                    alert(t('booking.fillFields'))
                    return
                  }
                  setPaymentMethod('mercado-pago')
                  handleMercadoPago()
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                {t('booking.mercadoPago')}
              </button>

              <button
                onClick={() => {
                  if (!formData.name || !formData.email || !formData.phone) {
                    alert(t('booking.fillFields'))
                    return
                  }
                  if (deliveryEnabled && !formData.deliveryAddress) {
                    alert(t('booking.enterAddress'))
                    return
                  }
                  setPaymentMethod('whatsapp')
                  handleWhatsApp()
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('booking.whatsapp')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


