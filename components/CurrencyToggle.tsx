'use client'

import { useCurrency } from '@/contexts/CurrencyContext'
import { useEffect } from 'react'

export default function CurrencyToggle() {
  const { currency, setCurrency, exchangeRate } = useCurrency()

  // Debug: log currency changes
  useEffect(() => {
    console.log('Currency changed to:', currency, 'Exchange rate:', exchangeRate)
  }, [currency, exchangeRate])

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
      <button
        onClick={() => {
          console.log('Setting currency to MXN')
          setCurrency('MXN')
        }}
        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          currency === 'MXN'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to Mexican Pesos"
      >
        MXN
      </button>
      <button
        onClick={() => {
          console.log('Setting currency to USD')
          setCurrency('USD')
        }}
        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          currency === 'USD'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to US Dollars"
      >
        USD
      </button>
    </div>
  )
}

