'use client'

import { useState, useMemo } from 'react'
import { Vehicle } from '@/types'
import Image from 'next/image'
import Calendar from './Calendar'
import BookingModal from './BookingModal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { getVehicleDescription } from '@/data/vehicles'

interface VehicleDetailClientProps {
  vehicle: Vehicle
}

export default function VehicleDetailClient({
  vehicle,
}: VehicleDetailClientProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [insuranceEnabled, setInsuranceEnabled] = useState(false)
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [showDiscounts, setShowDiscounts] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { formatPrice, currency, exchangeRate } = useCurrency()
  const { t, language } = useLanguage()
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

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert(t('booking.selectDates') || 'Please select dates')
      return
    }
    
    // Add items based on quantity
    for (let i = 0; i < quantity; i++) {
      const cartItem = {
        vehicle,
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
        deliveryEnabled,
        insuranceEnabled,
        ...bookingTotal,
      }
      
      addToCart(cartItem)
    }
    
    // Show success message
    const message = quantity === 1 
      ? (t('cart.added') || 'Vehicle added to cart!')
      : `${quantity} ${t('cart.itemsAdded') || 'vehicles added to cart!'}`
    alert(message)
  }

  const primaryImage = vehicle.images[0]

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 sm:pt-32">
        <div className="container mx-auto px-4 pb-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div>
              {primaryImage && (
                <div className="relative h-96 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src={primaryImage}
                    alt={vehicle.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 600px"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {vehicle.name}
              </h1>
              <p className="text-3xl font-bold text-turquoise mb-6">
                {formatPrice(vehicle.pricePerDay)}
              </p>
              {(() => {
                const description = getVehicleDescription(vehicle.id, language)
                return description && (
                  <p className="text-gray-600 mb-6">{description}</p>
                )
              })()}

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6 sm:items-start">
                {/* Features Card */}
                <div className="bg-white rounded-lg shadow p-4 w-full sm:w-auto sm:flex-none sm:max-w-[360px] self-start">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {t('vehicle.features')}
                  </h2>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-turquoise flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      {t('vehicle.insurance')}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-turquoise flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {t('vehicle.helmets')}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-turquoise flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t('vehicle.roadsideAssistance')}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-turquoise flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      {t('vehicle.deliveryAvailable')}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-turquoise flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {t('vehicle.fullyFueled')}
                    </li>
                  </ul>
                </div>

                {/* Discounts Card */}
                <div className="bg-white border border-turquoise/20 rounded-xl shadow-sm w-full sm:w-auto self-start px-4 py-3">
                  <h3 className="text-lg font-bold text-reef-ink mb-2">
                    {t('vehicle.discounts.title') || 'Discounts'}
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>3+ days</span>
                      <span className="font-semibold text-turquoise">5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7+ days</span>
                      <span className="font-semibold text-turquoise">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>14+ days</span>
                      <span className="font-semibold text-turquoise">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar, Delivery, and Booking Summary Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {t('vehicle.checkAvailability')}
            </h2>
            <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-4 xl:gap-6">
              {/* Column 1: Calendar with Pickup/Dropoff Time */}
              <div className="w-full max-w-[400px] space-y-4">
                {/* Quantity Selector */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('vehicle.quantity') || 'Quantity'}
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-2xl font-bold text-gray-800 px-6">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-turquoise hover:bg-turquoise/10 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  {quantity >= 2 && (
                    <p className="text-xs text-turquoise mt-2 text-center">
                      {quantity >= 4 ? '10%' : '5%'} {t('vehicle.multiVehicleDiscount') || 'discount for multiple vehicles'}
                    </p>
                  )}
                </div>
                <Calendar 
                  onDateSelect={handleDateSelect}
                  pickupTime={pickupTime}
                  dropoffTime={dropoffTime}
                  onPickupTimeChange={setPickupTime}
                  onDropoffTimeChange={setDropoffTime}
                />
              </div>

              {/* Column 2: Delivery, Insurance, and Need to Know */}
              <div className="flex flex-col gap-4 w-full max-w-[400px]">
                {/* Delivery Toggle */}
                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {t('vehicle.delivery.title')}
                      </h3>
                      <p className="text-sm font-semibold text-turquoise">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-turquoise"></div>
                    </label>
                  </div>
                </div>

                {/* Insurance Toggle */}
                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-turquoise/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-turquoise"></div>
                    </label>
                  </div>
                </div>

                {/* Need to Know */}
                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
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

              {/* Column 3: Booking Summary */}
              <div className="w-full max-w-[400px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-turquoise/10 via-white to-white border border-turquoise/15 rounded-lg shadow p-4 text-reef-ink w-full flex flex-col"
                >
                  <h3 className="text-lg font-bold mb-4 text-reef-ink">{t('vehicle.booking.summary')}</h3>
                  {startDate && endDate ? (
                    <div className="flex flex-col flex-1">
                      <div className="space-y-2.5 mb-4 text-sm flex-1">
                        {/* Rental Period - Highlighted */}
                        <div className="bg-turquoise/5 rounded-lg px-3 py-2 border border-turquoise/20">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('vehicle.booking.rentalPeriod')}</span>
                            <span className="text-sm font-bold text-reef-ink text-right">
                              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Details Row */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{t('vehicle.quantity') || 'Quantity'}</span>
                            <span className="text-sm font-semibold text-gray-800">{quantity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{t('vehicle.booking.days')}</span>
                            <span className="text-sm font-semibold text-gray-800">{bookingTotal.days}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{t('vehicle.booking.pickupTime')}</span>
                            <span className="text-sm font-semibold text-turquoise">{pickupTime}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{t('vehicle.booking.dropoffTime')}</span>
                            <span className="text-sm font-semibold text-turquoise">{dropoffTime}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{t('vehicle.booking.hours')}</span>
                            <span className="text-sm font-semibold text-gray-800">{formatHours(bookingTotal.hours)}</span>
                          </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="border-t border-gray-200 pt-2 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-700">{t('vehicle.booking.subtotal')}</span>
                            <span className="text-sm font-bold text-reef-ink">
                              {formatPrice(bookingTotal.subtotal, {
                                includeSuffix: false,
                              })}
                            </span>
                          </div>
                          {bookingTotal.timeDiscountPercent > 0 && (
                            <div className="flex justify-between items-center bg-green-50 rounded px-2 py-1">
                              <span className="text-xs font-medium text-green-700">
                                {t('vehicle.booking.discount')} ({bookingTotal.timeDiscountPercent}%)
                              </span>
                              <span className="text-sm font-bold text-green-700">
                                -{formatPrice((bookingTotal.subtotal * bookingTotal.timeDiscountPercent) / 100, {
                                  includeSuffix: false,
                                })}
                              </span>
                            </div>
                          )}
                          {bookingTotal.vehicleDiscountPercent > 0 && (
                            <div className="flex justify-between items-center bg-blue-50 rounded px-2 py-1">
                              <span className="text-xs font-medium text-blue-700">
                                {t('vehicle.multiVehicleDiscount') || 'Multi-vehicle discount'} ({bookingTotal.vehicleDiscountPercent}%)
                              </span>
                              <span className="text-sm font-bold text-blue-700">
                                -{formatPrice((bookingTotal.subtotal * bookingTotal.vehicleDiscountPercent) / 100, {
                                  includeSuffix: false,
                                })}
                              </span>
                            </div>
                          )}
                          {deliveryEnabled && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {t('vehicle.booking.deliveryFee')} {quantity > 1 ? `(${quantity}x)` : ''}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">
                                {formatPrice(100 * quantity, { includeSuffix: false })}
                              </span>
                            </div>
                          )}
                          {insuranceEnabled && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">{t('vehicle.booking.insuranceFee')}</span>
                              <span className="text-sm font-semibold text-gray-700">
                                {formatPrice(Math.round(bookingTotal.subtotal * 0.1), { includeSuffix: false })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Total - Prominent */}
                        <div className="border-t-2 border-turquoise pt-3 mt-3 flex justify-between items-center bg-turquoise/5 rounded-lg px-3 py-2">
                          <span className="text-base font-bold text-reef-ink">{t('vehicle.booking.total')}</span>
                          <span className="text-lg font-bold text-turquoise">
                            {formatPrice(bookingTotal.total, {
                              includeSuffix: false,
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-turquoise hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-lg text-base transition-all transform hover:scale-105 shadow-lg mt-auto"
                      >
                        {t('vehicle.booking.addToCart') || 'Add to Cart'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-reef-ink/70 text-sm">
                        {t('vehicle.booking.selectDates')}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showBookingModal && (
        <BookingModal
          vehicle={vehicle}
          startDate={startDate!}
          endDate={endDate!}
          deliveryEnabled={deliveryEnabled}
          insuranceEnabled={insuranceEnabled}
          pickupTime={pickupTime}
          dropoffTime={dropoffTime}
          total={bookingTotal.total}
          subtotal={bookingTotal.subtotal}
          discount={bookingTotal.discount}
          discountPercent={bookingTotal.discountPercent}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  )
}

