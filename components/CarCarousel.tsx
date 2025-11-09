'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCars } from '@/data/vehicles'
import VehicleCard from './VehicleCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CarCarousel() {
  const cars = getCars()
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('.vehicle-card')
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width + 16 // width + gap
        carouselRef.current.scrollTo({
          left: index * cardWidth,
          behavior: 'smooth',
        })
        setCurrentIndex(index)
      }
    }
  }

  const next = () => {
    if (currentIndex < cars.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleScroll = () => {
      const firstCard = carousel.querySelector('.vehicle-card') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width + 16
        const index = Math.round(carousel.scrollLeft / cardWidth)
        setCurrentIndex(index)
      }
    }

    const handleResize = () => {
      // Recalculate current index on resize
      handleScroll()
    }

    carousel.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      carousel.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t('vehicles.cars')}
      </h2>
      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={prev}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous car"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth pb-4 px-2 sm:px-4 w-full"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ scrollSnapAlign: 'start' }}
              className="vehicle-card"
            >
              <VehicleCard vehicle={car} />
            </motion.div>
          ))}
        </div>
        {currentIndex < cars.length - 1 && (
          <button
            onClick={next}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Next car"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {cars.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-turquoise' : 'w-2 bg-gray-300'
            }`}
            aria-label={`Go to car ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

