'use client'

import { useState, useEffect, useMemo } from 'react'
import { Vehicle } from '@/types'
import Image from 'next/image'
import Calendar from './Calendar'
import BookingModal from './BookingModal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
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
  const { formatPrice, currency, exchangeRate } = useCurrency()
  const { t, language } = useLanguage()

  // Debug: verify currency context is working
  useEffect(() => {
    console.log('VehicleDetailClient - Currency:', currency, 'Rate:', exchangeRate)
    console.log('Vehicle price:', vehicle.pricePerDay, 'Formatted:', formatPrice(vehicle.pricePerDay))
  }, [currency, exchangeRate, vehicle.pricePerDay, formatPrice])

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const bookingTotal = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        subtotal: vehicle.pricePerDay,
        discount: 0,
        discountPercent: 0,
        total: vehicle.pricePerDay,
        days: 1,
      }
    }

    const days =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) +
      1
    let subtotal = vehicle.pricePerDay * days

    // Calculate discount based on rental period
    let discountPercent = 0
    if (days >= 7) {
      discountPercent = 15 // 15% off for 7+ days
    } else if (days >= 3) {
      discountPercent = 10 // 10% off for 3+ days
    }

    const discount = (subtotal * discountPercent) / 100
    let total = subtotal - discount

    // Add delivery fee if enabled (mock: +100 MXN if >5km - simplified for now)
    if (deliveryEnabled) {
      total += 100
    }

    return {
      subtotal,
      discount,
      discountPercent,
      total,
      days,
    }
  }, [startDate, endDate, vehicle.pricePerDay, deliveryEnabled])

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      alert(t('booking.selectDates'))
      return
    }
    setShowBookingModal(true)
  }

  const primaryImage = vehicle.images[0]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <a href="/" className="text-gray-600 hover:text-turquoise">
              {t('nav.home')}
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/#rentals" className="text-gray-600 hover:text-turquoise">
              {t('nav.rentals')}
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{vehicle.name}</span>
          </nav>

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

              <div className="bg-white rounded-lg shadow-md p-4 mb-6 inline-block">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {t('vehicle.features')}
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-palm-green flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('vehicle.fullyInsured')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-palm-green flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('vehicle.roadsideAssistance')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-palm-green flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('vehicle.deliveryAvailable')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Calendar, Delivery, and Booking Summary Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {t('vehicle.checkAvailability')}
            </h2>
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 lg:gap-6">
              {/* Calendar - Left */}
              <div className="w-full max-w-[400px] flex">
                <Calendar onDateSelect={handleDateSelect} />
              </div>

              {/* Delivery and Booking Summary Container - Right */}
              <div className="flex flex-col gap-4 w-full max-w-[400px] flex-1">
                {/* Delivery Toggle - Compact */}
                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {t('vehicle.delivery.title')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('vehicle.delivery.description')}
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

                {/* Booking Summary - Always Visible, Smaller */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-turquoise to-palm-green rounded-lg shadow-lg p-4 text-white w-full flex-1 flex flex-col"
                >
                  <h3 className="text-lg font-bold mb-3">{t('vehicle.booking.summary')}</h3>
                  {startDate && endDate ? (
                    <div className="flex flex-col flex-1">
                      <div className="space-y-1.5 mb-3 text-sm flex-1">
                        <div className="flex justify-between">
                          <span>{t('vehicle.booking.rentalPeriod')}</span>
                          <span className="text-right">
                            {startDate.toLocaleDateString()} -{' '}
                            {endDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('vehicle.booking.days')}</span>
                          <span>{bookingTotal.days}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('vehicle.booking.subtotal')}</span>
                          <span>
                            {formatPrice(bookingTotal.subtotal, {
                              includeSuffix: false,
                            })}
                          </span>
                        </div>
                        {bookingTotal.discount > 0 && (
                          <div className="flex justify-between text-green-200">
                            <span>
                              {t('vehicle.booking.discount')} ({bookingTotal.discountPercent}%)
                            </span>
                            <span>
                              -
                              {formatPrice(bookingTotal.discount, {
                                includeSuffix: false,
                              })}
                            </span>
                          </div>
                        )}
                        {deliveryEnabled && (
                          <div className="flex justify-between">
                            <span>{t('vehicle.booking.deliveryFee')}</span>
                            <span>
                              {formatPrice(100, { includeSuffix: false })}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-white/30 pt-1.5 flex justify-between text-base font-bold mt-2">
                          <span>{t('vehicle.booking.total')}</span>
                          <span>
                            {formatPrice(bookingTotal.total, {
                              includeSuffix: false,
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleBookNow}
                        className="w-full bg-sunset-orange hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-lg text-base transition-all transform hover:scale-105 shadow-lg mt-auto"
                      >
                        {t('vehicle.booking.bookNow')}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-white/80 text-sm">
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

