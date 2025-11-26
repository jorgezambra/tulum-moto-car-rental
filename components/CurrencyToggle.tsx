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
    <div className="flex items-center gap-0.5 bg-black rounded-lg p-0.5">
      <button
        onClick={() => {
          console.log('Setting currency to MXN')
          setCurrency('MXN')
        }}
        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
          currency === 'MXN'
            ? 'bg-gray-800 text-white shadow-sm'
            : 'text-white/70 hover:text-white'
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
        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
          currency === 'USD'
            ? 'bg-gray-800 text-white shadow-sm'
            : 'text-white/70 hover:text-white'
        }`}
        aria-label="Switch to US Dollars"
      >
        USD
      </button>
    </div>
  )
}

