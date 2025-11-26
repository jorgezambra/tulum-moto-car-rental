'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// Use regular img for large hero image to avoid webpack memory issues
const HeroImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
  />
)

export default function HeroSlider() {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => setShowDiscountPopup(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full max-w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <HeroImage
          src="/images/bg/scooter_atv_jeep.png"
          alt="Scooter, ATV, and Jeep on Tulum beach"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 px-4"
        >
          {t('hero.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-2xl px-4"
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="#rentals"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('rentals')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-turquoise hover:bg-opacity-90 text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t('hero.cta')}
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDiscountPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 right-4 sm:right-8 z-50 w-[320px] max-w-full bg-white rounded-3xl shadow-2xl border border-turquoise/30"
          >
            <button
              onClick={() => setShowDiscountPopup(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close discount popup"
            >
              ×
            </button>
            <div className="p-5 flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <Image
                  src="/images/vehicles/moto/vesla-150-black.png"
                  alt="Scooter promotion"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 text-gray-800">
                <p className="text-sm uppercase tracking-wide font-semibold text-turquoise">
                  {t('hero.discount.title')}
                </p>
                <p className="text-xl font-bold">
                  {t('hero.discount.line1')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('hero.discount.line2')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

