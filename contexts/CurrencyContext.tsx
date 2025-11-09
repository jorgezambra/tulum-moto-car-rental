'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'

type Currency = 'MXN' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  convertPrice: (priceMXN: number) => number
  formatPrice: (priceMXN: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('MXN')
  // Exchange rate: how many USD = 1 MXN (approximately 0.054 as of 2025)
  const [exchangeRate, setExchangeRate] = useState(0.054) // Default fallback: 1 MXN = 0.054 USD (1 USD ≈ 18.5 MXN)

  useEffect(() => {
    // Fetch exchange rate from API
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/MXN',
          { cache: 'no-store' }
        )
        if (response.ok) {
          const data = await response.json()
          if (data.rates && data.rates.USD) {
            // The API returns rates where base is MXN, so rates.USD = how many USD = 1 MXN
            const rate = data.rates.USD
            setExchangeRate(rate)
            console.log('Exchange rate fetched:', rate, 'USD per 1 MXN')
          } else {
            console.warn('Invalid exchange rate data, using fallback')
          }
        } else {
          console.warn('Exchange rate API error, using fallback rate')
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
        // Use fallback rate (1 MXN = 0.054 USD)
        console.log('Using fallback exchange rate: 0.054')
      }
    }

    fetchExchangeRate()
  }, [])

  const convertPrice = useCallback((priceMXN: number): number => {
    if (currency === 'USD') {
      // Convert MXN to USD: multiply by exchange rate (USD per 1 MXN)
      // Example: 400 MXN * 0.054 = 21.6 USD
      return priceMXN * exchangeRate
    }
    return priceMXN
  }, [currency, exchangeRate])

  const formatPrice = useCallback((priceMXN: number): string => {
    const price = convertPrice(priceMXN)
    return currency === 'USD'
      ? `$${price.toFixed(2)} USD/day`
      : `${Math.round(price)} MXN/day`
  }, [currency, convertPrice])

  const value = useMemo(() => ({
    currency,
    setCurrency,
    exchangeRate,
    convertPrice,
    formatPrice,
  }), [currency, exchangeRate, convertPrice, formatPrice])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

