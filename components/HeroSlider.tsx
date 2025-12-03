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
    <div className="relative w-full max-w-full overflow-hidden md:h-[500px] lg:h-[600px] xl:h-[700px]">
      {/* Mobile: Image determines height, extends fully */}
      <div className="relative w-full md:absolute md:inset-0 md:h-full">
        {/* Mobile background - full width, natural height */}
        <img
          src="/images/bg/newbg.png"
          alt="Tulum rental background"
          className="w-full h-auto md:hidden block"
          style={{ display: 'block' }}
        />
        {/* Desktop background - fixed height container */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <HeroImage
            src="/images/bg/scooter_atv_jeep.png"
            alt="Scooter, ATV, and Jeep on Tulum beach"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center text-center px-4 z-10 w-full pt-[194px] sm:pt-[210px] md:pt-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white px-4"
          style={{ marginBottom: '12px' }}
        >
          {t('hero.title')}
        </motion.h1>
        
        {/* Subtitle text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-2xl px-4"
          style={{ marginBottom: '24px' }}
        >
          {t('hero.subtitle')}
        </motion.p>
        
        {/* Browse rentals button */}
        <motion.a
          href="#rentals"
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById('rentals')
            element?.scrollIntoView({ behavior: 'smooth' })
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-block bg-gradient-to-r from-turquoise to-reef-deep text-white font-extrabold py-3 px-8 sm:py-4 sm:px-10 rounded-full text-base sm:text-lg md:text-xl shadow-[0_10px_20px_rgba(19,181,176,0.4)] hover:shadow-[0_15px_30px_rgba(19,181,176,0.6)] transform hover:-translate-y-1 transition-all duration-300 border-2 border-white/20 hover:border-white/40 backdrop-blur-sm"
        >
          Browse Rentals
        </motion.a>
      </div>

      {/* Rating badge - at bottom of hero section, centered on screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-[152px] sm:bottom-[168px] md:bottom-3 left-0 right-0 z-10 flex justify-center items-center"
      >
        <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-gradient-to-r from-turquoise to-reef-deep text-white shadow-[0_10px_25px_rgba(13,148,136,0.35)] border border-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-amber-300 drop-shadow">
            {Array.from({ length: 5 }).map((_, idx) => (
              <svg
                key={idx}
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight leading-none">5.0</div>
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Avg. rating</span>
        </div>
      </motion.div>

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
                <p className="text-xl font-bold">
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

