'use client'

import { useState, useEffect, useRef } from 'react'
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
  onSubmit: (data: { name: string; phone: string; email: string }) => Promise<boolean>
  summary?: BookingSummary | null
}

const CountrySelect = ({ 
  value, 
  onChange, 
  countries 
}: { 
  value: string
  onChange: (code: string) => void
  countries: { code: string; name: string; flag: string }[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  )

  const selectedCountry = countries.find(c => c.code === value)

  return (
    <div className="relative min-w-[140px] w-[140px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-turquoise focus:outline-none text-sm flex items-center justify-between gap-2"
      >
        <span className="truncate text-gray-700 font-medium">
          {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : value}
        </span>
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 flex flex-col">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-turquoise"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredCountries.map((country) => (
              <button
                key={`${country.code}-${country.name}`}
                type="button"
                onClick={() => {
                  onChange(country.code)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-turquoise/10 flex items-center gap-2 ${
                  value === country.code ? 'bg-turquoise/5 text-turquoise font-medium' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="font-medium w-12">{country.code}</span>
                <span className="truncate">{country.name}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PaymentRequestModal({
  isOpen,
  onClose,
  onSubmit,
  summary,
}: PaymentRequestModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState('+52')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Comprehensive country codes list with flags (emoji flags)
  const countryCodes = [
    { code: '+1', name: 'US/CA', flag: '🇺🇸' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+420', name: 'Czech', flag: '🇨🇿' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
    { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', name: 'Panama', flag: '🇵🇦' },
    { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
    { code: '+504', name: 'Honduras', flag: '🇭🇳' },
    { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
    { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+1-242', name: 'Bahamas', flag: '🇧🇸' },
    { code: '+1-246', name: 'Barbados', flag: '🇧🇧' },
    { code: '+1-649', name: 'Turks & Caicos', flag: '🇹🇨' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  ].sort((a, b) => a.name.localeCompare(b.name))

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      setSubmitStatus('error')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Build full WhatsApp number: country code + local number
      const normalizedPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\d]/g, '')
      if (!normalizedPhone) {
        setSubmitStatus('error')
        setIsSubmitting(false)
        return
      }
      
      const fullPhone = `${countryCode}${normalizedPhone}`
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
      })
      
      const submitPromise = onSubmit({ name: name.trim(), phone: fullPhone, email: email.trim() })
      const success = await Promise.race([submitPromise, timeoutPromise])
      
      if (success) {
        setSubmitStatus('success')
        // Reset form after success
        setName('')
        setCountryCode('+52')
        setPhoneNumber('')
        setEmail('')
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setSubmitStatus('idle')
          onClose()
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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
                      WhatsApp Number
                    </label>
                    <div className="flex gap-2 w-full">
                      <CountrySelect
                        value={countryCode}
                        onChange={setCountryCode}
                        countries={countryCodes}
                      />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '')
                          setPhoneNumber(value)
                        }}
                        required
                        className="flex-1 w-0 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-colors min-w-[120px]"
                        placeholder="Phone number"
                        pattern="[0-9]{6,15}"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your WhatsApp number with country code
                    </p>
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Your reservation request should be confirmed shortly. You will receive a secure payment link via email where you can confirm your reservation.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-bold py-3 px-6 rounded-lg text-base transition-all shadow-lg ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : submitStatus === 'success'
                        ? 'bg-green-500'
                        : submitStatus === 'error'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-turquoise hover:bg-opacity-90 transform hover:scale-105'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : submitStatus === 'success' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Request Submitted!
                      </span>
                    ) : submitStatus === 'error' ? (
                      'Error - Try Again'
                    ) : (
                      'Submit Reservation Request'
                    )}
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

