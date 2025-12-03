'use client'

import { useState, useMemo } from 'react'
import { Vehicle } from '@/types'
import Image from 'next/image'
import Calendar from './Calendar'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'
import PaymentRequestModal from './PaymentRequestModal'

interface VehicleDetailsExpandedProps {
  vehicle: Vehicle
  onClose?: () => void
}

export default function VehicleDetailsExpanded({
  vehicle,
  onClose,
}: VehicleDetailsExpandedProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [insuranceEnabled, setInsuranceEnabled] = useState(false)
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [quantity, setQuantity] = useState(1)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const { addToCart } = useCart()

  const formatHours = (hours: number) =>
    Number.isInteger(hours) ? hours : hours.toFixed(1)

  const combineDateAndTime = (date: Date | null, time: string) => {
    if (!date) return null
    const [hours, minutes] = time.split(':').map(Number)
    const safeHours = Number.isFinite(hours) ? hours : 10
    const safeMinutes = Number.isFinite(minutes) ? minutes : 0
    const combined = new Date(date)
    combined.setHours(safeHours, safeMinutes, 0, 0)
    return combined
  }

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const bookingTotal = useMemo(() => {
    const pickupDateTime = combineDateAndTime(startDate, pickupTime)
    const dropoffDateTime = combineDateAndTime(endDate, dropoffTime)

    let hours = 24
    let days = 1
    let subtotal = vehicle.pricePerDay

    if (pickupDateTime && dropoffDateTime) {
      let durationMs = dropoffDateTime.getTime() - pickupDateTime.getTime()
      if (durationMs <= 0) {
        durationMs = 24 * 60 * 60 * 1000
      }
      hours = durationMs / (1000 * 60 * 60)
      days = Math.max(1, Math.ceil(hours / 24))
      subtotal = vehicle.pricePerDay * days
    }

    // Calculate base subtotal with quantity
    subtotal = subtotal * quantity

    // Calculate discount based on rental period
    let timeDiscountPercent = 0
    if (days >= 14) {
      timeDiscountPercent = 15 // 15% off for 14+ days
    } else if (days >= 7) {
      timeDiscountPercent = 10 // 10% off for 7+ days
    } else if (days >= 3) {
      timeDiscountPercent = 5 // 5% off for 3+ days
    }

    // Calculate multi-vehicle discount
    let vehicleDiscountPercent = 0
    if (quantity >= 4) {
      vehicleDiscountPercent = 10 // 10% off for 4+ vehicles
    } else if (quantity >= 2) {
      vehicleDiscountPercent = 5 // 5% off for 2+ vehicles
    }

    // Combine discounts (additive)
    const totalDiscountPercent = timeDiscountPercent + vehicleDiscountPercent
    const discount = (subtotal * totalDiscountPercent) / 100
    let total = subtotal - discount

    if (deliveryEnabled) {
      total += 100 * quantity
    }

    if (insuranceEnabled) {
      total += Math.round(subtotal * 0.1)
    }

    return {
      subtotal,
      discount,
      discountPercent: totalDiscountPercent,
      timeDiscountPercent,
      vehicleDiscountPercent,
      total,
      days,
      hours,
      pickupDateTime,
      dropoffDateTime,
    }
  }, [
    startDate,
    endDate,
    vehicle.pricePerDay,
    deliveryEnabled,
    insuranceEnabled,
    pickupTime,
    dropoffTime,
    quantity,
  ])

  const paymentSummary = useMemo(() => {
    if (!startDate || !endDate) return null

    const rentalPeriod = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    const deliveryFee = deliveryEnabled ? formatPrice(100 * quantity, { includeSuffix: false }) : null
    const insuranceFee = insuranceEnabled ? formatPrice(Math.round(bookingTotal.subtotal * 0.1), { includeSuffix: false }) : null

    return {
      vehicleName: vehicle.name,
      quantity,
      deliveryEnabled,
      insuranceEnabled,
      rentalPeriod,
      pickupTime,
      dropoffTime,
      pricePerDay: formatPrice(vehicle.pricePerDay, { includeSuffix: false }),
      subtotal: formatPrice(bookingTotal.subtotal, { includeSuffix: false }),
      total: formatPrice(bookingTotal.total, { includeSuffix: false }),
      deliveryFee,
      insuranceFee,
      days: bookingTotal.days,
    }
  }, [
    startDate,
    endDate,
    vehicle.name,
    quantity,
    deliveryEnabled,
    insuranceEnabled,
    pickupTime,
    dropoffTime,
    bookingTotal,
    formatPrice,
  ])

  const handlePaymentRequest = () => {
    if (!startDate || !endDate) {
      alert(t('booking.selectDates') || 'Please select dates')
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async (data: { name: string; phone: string; email: string }): Promise<boolean> => {
    if (!bookingTotal || !startDate || !endDate) {
      console.error('Missing booking totals or dates')
      return false
    }

    // Build extras list
    const extras: string[] = []
    if (deliveryEnabled) extras.push('Delivery')
    if (insuranceEnabled) extras.push('Insurance')

    // Individual extra costs
    const deliveryCost = deliveryEnabled ? 100 * quantity : 0
    const insuranceCost = insuranceEnabled ? Math.round(bookingTotal.subtotal * 0.1) : 0

    // Human-readable rental dates
    const rentalDates = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`

    // Full text summary to send to Jotform
    const summaryLines = [
      'New Booking Request',
      '',
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      '',
      `Vehicle: ${vehicle.name}`,
      `Price per day: ${formatPrice(vehicle.pricePerDay, { includeSuffix: false })}`,
      `Quantity: ${quantity}`,
      `Days: ${bookingTotal.days}`,
      '',
      `Delivery selected: ${deliveryEnabled ? 'Yes' : 'No'}`,
      deliveryEnabled ? `Delivery cost: ${formatPrice(deliveryCost, { includeSuffix: false })}` : '',
      `Insurance selected: ${insuranceEnabled ? 'Yes' : 'No'}`,
      insuranceEnabled ? `Insurance cost: ${formatPrice(insuranceCost, { includeSuffix: false })}` : '',
      '',
      `Subtotal: ${formatPrice(bookingTotal.subtotal, { includeSuffix: false })}`,
      bookingTotal.discount > 0
        ? `Discount (${bookingTotal.discountPercent}%): -${formatPrice(bookingTotal.discount, { includeSuffix: false })}`
        : '',
      `Total: ${formatPrice(bookingTotal.total, { includeSuffix: false })}`,
      '',
      `Rental period: ${rentalDates}`,
      `Pickup time: ${pickupTime}`,
      `Dropoff time: ${dropoffTime}`,
    ].filter(Boolean)

    const bookingData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      vehicle: vehicle.name,
      extras: extras.join(', '),
      totalPrice: formatPrice(bookingTotal.total, { includeSuffix: false }),
      quantity,
      pickupTime,
      dropoffTime,
      summary: summaryLines.join('\n'),
    }

    try {
      const response = await fetch('/api/jotform-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        // Send WhatsApp notification (non-blocking - don't wait for response)
        fetch('/api/send-whatsapp-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            console.error('WhatsApp notification failed:', response.status, errorData)
          } else {
            const result = await response.json()
            console.log('WhatsApp notification sent successfully:', result)
          }
        })
        .catch((error) => {
          // Silently handle WhatsApp errors - don't block form submission
          console.error('WhatsApp notification failed (non-blocking):', error)
        })

        return true
      } else {
        console.error('Submission failed:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      return false
    }
  }

  const primaryImage = vehicle.images[0]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden"
    >
      <div className="container mx-auto px-3 py-4">
        {/* Mobile: Vehicle name at top, then two columns */}
        <div className="md:hidden space-y-3">
          {/* Top: Vehicle Name */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-2 border-gray-800 rounded-lg px-3 py-2 text-center">
              {vehicle.name}
            </h2>
          </div>

          {/* Two columns: Image on left, Price/Controls on right */}
          <div className="grid grid-cols-2 gap-2">
            {/* Left Column: Vehicle Image */}
            <div className="flex flex-col">
              {primaryImage && (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src={primaryImage}
                    alt={vehicle.name}
                    fill
                    className="object-contain p-2"
                    sizes="50vw"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Right Column: Price, Delivery, Insurance, Quantity - Evenly spaced to match image height */}
            <div className="flex flex-col justify-between h-full">
              {/* Price - Top aligned */}
              <div className="bg-white border-2 border-turquoise rounded-lg px-2 py-2">
                <p className="text-sm font-bold text-turquoise text-center">
                  {formatPrice(vehicle.pricePerDay)}
                </p>
              </div>

              {/* Middle section - Delivery and Insurance - Evenly spaced */}
              <div className="flex flex-col gap-2 flex-1 justify-center">
                {/* Delivery Toggle */}
                <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-gray-800 truncate">
                      {t('vehicle.delivery.title')}
                    </h3>
                    <p className="text-[10px] font-semibold text-turquoise truncate">
                      {formatPrice(100, { includeSuffix: false })}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={deliveryEnabled}
                      onChange={(e) => setDeliveryEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-turquoise"></div>
                  </label>
                </div>
              </div>

                {/* Insurance Toggle */}
                <div className="bg-white rounded-lg shadow-md p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-800 truncate">
                        {t('vehicle.insurance.title')}
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={insuranceEnabled}
                        onChange={(e) => setInsuranceEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-turquoise"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quantity Selector - Bottom aligned */}
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800">
                    {t('vehicle.quantity') || 'Quantity'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 rounded border border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-sm font-bold text-gray-800 px-1">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 rounded border border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar - Full width below the two columns */}
          <div className="w-full">
            <div style={{ overflow: 'visible' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', width: '117.6%', height: '117.6%', marginLeft: '-8.8%', marginBottom: '-15%' }}>
                <Calendar 
                  onDateSelect={handleDateSelect}
                  pickupTime={pickupTime}
                  dropoffTime={dropoffTime}
                  onPickupTimeChange={setPickupTime}
                  onDropoffTimeChange={setDropoffTime}
                />
              </div>
            </div>
          </div>

          {/* Booking Summary - Full width below calendar */}
          <div className="w-full bg-white border-2 border-turquoise rounded-lg shadow-lg p-2">
            <h3 className="text-sm font-bold mb-2 text-reef-ink text-center">{t('vehicle.booking.summary')}</h3>
            {startDate && endDate ? (
              <div className="space-y-1.5 text-[10px]">
                  <div className="bg-turquoise/10 rounded px-2 py-1 border border-turquoise/30">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-semibold text-gray-700 uppercase">{t('vehicle.booking.rentalPeriod')}</span>
                      <span className="text-[10px] font-bold text-reef-ink">
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-0.5 bg-gray-50 rounded px-2 py-1">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">{t('vehicle.quantity') || 'Quantity'}</span>
                      <span className="font-bold text-gray-800">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">{t('vehicle.booking.days')}</span>
                      <span className="font-bold text-gray-800">{bookingTotal.days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">{t('vehicle.booking.pickupTime')}</span>
                      <span className="font-bold text-turquoise">{pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">{t('vehicle.booking.dropoffTime')}</span>
                      <span className="font-bold text-turquoise">{dropoffTime}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-1.5 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">{t('vehicle.booking.subtotal')}</span>
                      <span className="font-bold text-reef-ink">
                        {formatPrice(bookingTotal.subtotal, { includeSuffix: false })}
                      </span>
                    </div>
                    {bookingTotal.timeDiscountPercent > 0 && (
                      <div className="flex justify-between bg-green-100 rounded px-1 py-0.5 border border-green-300">
                        <span className="font-semibold text-green-800">
                          {t('vehicle.booking.discount')} ({bookingTotal.timeDiscountPercent}%)
                        </span>
                        <span className="font-bold text-green-800">
                          -{formatPrice((bookingTotal.subtotal * bookingTotal.timeDiscountPercent) / 100, { includeSuffix: false })}
                        </span>
                      </div>
                    )}
                    {bookingTotal.vehicleDiscountPercent > 0 && (
                      <div className="flex justify-between bg-blue-100 rounded px-1 py-0.5 border border-blue-300">
                        <span className="font-semibold text-blue-800">
                          {t('vehicle.multiVehicleDiscount') || 'Multi-vehicle discount'} ({bookingTotal.vehicleDiscountPercent}%)
                        </span>
                        <span className="font-bold text-blue-800">
                          -{formatPrice((bookingTotal.subtotal * bookingTotal.vehicleDiscountPercent) / 100, { includeSuffix: false })}
                        </span>
                      </div>
                    )}
                    {deliveryEnabled && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          {t('vehicle.booking.deliveryFee')} {quantity > 1 ? `(${quantity}x)` : ''}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {formatPrice(100 * quantity, { includeSuffix: false })}
                        </span>
                      </div>
                    )}
                    {insuranceEnabled && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">{t('vehicle.booking.insuranceFee')}</span>
                        <span className="font-semibold text-gray-800">
                          {formatPrice(Math.round(bookingTotal.subtotal * 0.1), { includeSuffix: false })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-turquoise pt-2 mt-2 flex justify-between items-center bg-turquoise/10 rounded px-2 py-1 border border-turquoise/30">
                    <span className="text-xs font-bold text-reef-ink">{t('vehicle.booking.total')}</span>
                    <span className="text-sm font-bold text-turquoise">
                      {formatPrice(bookingTotal.total, { includeSuffix: false })}
                    </span>
                  </div>
                  <button
                    onClick={handlePaymentRequest}
                    className="w-full bg-turquoise hover:bg-opacity-90 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all transform hover:scale-105 shadow-lg mt-2"
                  >
                    Payment Request
                  </button>
              </div>
            ) : (
              <div className="text-center py-1">
                <p className="text-reef-ink/70 text-[10px]">
                  {t('vehicle.booking.selectDates')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-3 items-start">
          {/* Left Column: Vehicle Image */}
          <div className="flex flex-col">
            {primaryImage && (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <Image
                  src={primaryImage}
                  alt={vehicle.name}
                  fill
                  className="object-contain p-3"
                  sizes="50vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Right Column: Controls, Name/Price, Calendar & Booking Summary */}
          <div className="flex flex-col h-full min-h-0">
            {/* Top Section: Quantity, Delivery, Insurance */}
            <div className="space-y-3 flex-shrink-0">
              {/* Quantity Selector */}
              <div className="bg-white rounded-lg shadow-md p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    {t('vehicle.quantity') || 'Quantity'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-bold text-gray-800 px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                {quantity >= 2 && (
                  <p className="text-xs text-turquoise mt-1.5 text-center">
                    {quantity >= 4 ? '10%' : '5%'} {t('vehicle.multiVehicleDiscount') || 'discount for multiple vehicles'}
                  </p>
                )}
              </div>

              {/* Delivery Toggle */}
              <div className="bg-white rounded-lg shadow-md p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">
                      {t('vehicle.delivery.title')}
                    </h3>
                    <p className="text-xs font-semibold text-turquoise">
                      {formatPrice(100, { includeSuffix: false })}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={deliveryEnabled}
                      onChange={(e) => setDeliveryEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-turquoise"></div>
                  </label>
                </div>
              </div>

              {/* Insurance Toggle */}
              <div className="bg-white rounded-lg shadow-md p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">
                      {t('vehicle.insurance.title')}
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={insuranceEnabled}
                      onChange={(e) => setInsuranceEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-turquoise"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Middle Section: Vehicle Name and Price */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 border-2 border-gray-800 rounded-lg px-3 py-2 text-center">
                {vehicle.name}
              </h2>
              <p className="text-lg font-bold text-turquoise border-2 border-turquoise rounded-lg px-3 py-2 text-center">
                {formatPrice(vehicle.pricePerDay)}
              </p>
            </div>

            {/* Bottom Section: Calendar and Booking Summary */}
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 mt-3">
              {/* Left Column: Calendar */}
              <div className="w-full h-full">
                <div className="w-full h-full [&>div]:!max-w-full [&>div]:!mx-0 [&>div]:!w-full">
                  <Calendar 
                    onDateSelect={handleDateSelect}
                    pickupTime={pickupTime}
                    dropoffTime={dropoffTime}
                    onPickupTimeChange={setPickupTime}
                    onDropoffTimeChange={setDropoffTime}
                  />
                </div>
              </div>

              {/* Right Column: Booking Summary */}
              <div className="space-y-3 h-full overflow-visible">
                {/* Booking Summary */}
                <div className="bg-white border-2 border-turquoise rounded-lg shadow-lg p-3">
                  <h3 className="text-base font-bold mb-3 text-reef-ink text-center">{t('vehicle.booking.summary')}</h3>
                  {startDate && endDate ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="bg-turquoise/10 rounded-lg px-3 py-2 border-2 border-turquoise/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-700 uppercase">{t('vehicle.booking.rentalPeriod')}</span>
                          <span className="text-xs font-bold text-reef-ink">
                            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">{t('vehicle.quantity') || 'Quantity'}</span>
                          <span className="font-bold text-gray-800">{quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">{t('vehicle.booking.days')}</span>
                          <span className="font-bold text-gray-800">{bookingTotal.days}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">{t('vehicle.booking.pickupTime')}</span>
                          <span className="font-bold text-turquoise">{pickupTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">{t('vehicle.booking.dropoffTime')}</span>
                          <span className="font-bold text-turquoise">{dropoffTime}</span>
                        </div>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-2.5 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">{t('vehicle.booking.subtotal')}</span>
                          <span className="font-bold text-reef-ink">
                            {formatPrice(bookingTotal.subtotal, { includeSuffix: false })}
                          </span>
                        </div>
                        {bookingTotal.timeDiscountPercent > 0 && (
                          <div className="flex justify-between bg-green-100 rounded-lg px-2 py-1 border border-green-300">
                            <span className="font-semibold text-green-800">
                              {t('vehicle.booking.discount')} ({bookingTotal.timeDiscountPercent}%)
                            </span>
                            <span className="font-bold text-green-800">
                              -{formatPrice((bookingTotal.subtotal * bookingTotal.timeDiscountPercent) / 100, { includeSuffix: false })}
                            </span>
                          </div>
                        )}
                        {bookingTotal.vehicleDiscountPercent > 0 && (
                          <div className="flex justify-between bg-blue-100 rounded-lg px-2 py-1 border border-blue-300">
                            <span className="font-semibold text-blue-800">
                              {t('vehicle.multiVehicleDiscount') || 'Multi-vehicle discount'} ({bookingTotal.vehicleDiscountPercent}%)
                            </span>
                            <span className="font-bold text-blue-800">
                              -{formatPrice((bookingTotal.subtotal * bookingTotal.vehicleDiscountPercent) / 100, { includeSuffix: false })}
                            </span>
                          </div>
                        )}
                        {deliveryEnabled && (
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">
                              {t('vehicle.booking.deliveryFee')} {quantity > 1 ? `(${quantity}x)` : ''}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {formatPrice(100 * quantity, { includeSuffix: false })}
                            </span>
                          </div>
                        )}
                        {insuranceEnabled && (
                          <div className="flex justify-between">
                            <span className="text-gray-700 font-medium">{t('vehicle.booking.insuranceFee')}</span>
                            <span className="font-semibold text-gray-800">
                              {formatPrice(Math.round(bookingTotal.subtotal * 0.1), { includeSuffix: false })}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="border-t-2 border-turquoise pt-3 mt-3 flex justify-between items-center bg-turquoise/10 rounded-lg px-3 py-2 border-2 border-turquoise/30">
                        <span className="text-sm font-bold text-reef-ink">{t('vehicle.booking.total')}</span>
                        <span className="text-lg font-bold text-turquoise">
                          {formatPrice(bookingTotal.total, { includeSuffix: false })}
                        </span>
                      </div>
                      <button
                        onClick={handlePaymentRequest}
                        className="w-full bg-turquoise hover:bg-opacity-90 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg mt-3"
                      >
                        Payment Request
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-reef-ink/70 text-xs">
                        {t('vehicle.booking.selectDates')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentRequestModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
        summary={paymentSummary}
      />
    </motion.div>
  )
}
