'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { getCars, getScooters } from '@/data/vehicles'
import { useLanguage } from '@/contexts/LanguageContext'
import VehicleCard from './VehicleCard'

type CategoryKey = 'scooters' | 'atvs' | 'cars'

export default function VehicleCategoryShowcase() {
  const { t } = useLanguage()
  const scooters = getScooters()
  const cars = getCars()
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const expandedSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeCategory && expandedSectionRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        expandedSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }, 100)
    }
  }, [activeCategory])

  const categories = [
    {
      key: 'scooters' as const,
      title: t('vehicles.scooters'),
      accent: 'from-turquoise via-white to-white',
      vehicles: scooters,
      image: '/images/vehicles/ChatGPT Image Nov 22, 2025, 11_31_07 AM.png',
    },
    {
      key: 'atvs' as const,
      title: 'ATVs & Buggies',
      accent: 'from-[#ffd29c] via-white to-white',
      vehicles: [],
      image: '/images/vehicles/ChatGPT Image Nov 22, 2025, 11_42_23 AM.png',
    },
    {
      key: 'cars' as const,
      title: t('vehicles.cars'),
      accent: 'from-[#b0d6ff] via-white to-white',
      vehicles: cars,
      image: '/images/vehicles/ChatGPT Image Nov 22, 2025, 11_42_34 AM.png',
    },
  ]

  const getVehiclesForCategory = (key: CategoryKey) => {
    switch (key) {
      case 'scooters':
        return scooters
      case 'cars':
        return cars
      default:
        return []
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pb-12 overflow-visible">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() =>
              setActiveCategory(activeCategory === category.key ? null : category.key)
            }
            className={`relative w-full aspect-square max-w-[250px] mx-auto text-left rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/60 bg-gradient-to-br ${category.accent} hover:-translate-y-1 transition-transform overflow-hidden`}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 z-10 p-4 sm:p-6">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                {category.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {activeCategory && (
          <motion.div
            ref={expandedSectionRef}
            key={activeCategory}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4 overflow-visible"
          >
            {activeCategory === 'atvs' ? (
              <div className="p-6 text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {t('vehicles.categories.comingSoon')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t('vehicles.categories.contact')}
                </p>
                <a
                  href="https://wa.me/5219841234567"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-turquoise text-white font-semibold shadow hover:bg-reef-deep transition"
                >
                  WhatsApp
                </a>
              </div>
            ) : (
              <div className="flex flex-row gap-4 overflow-visible justify-center items-start">
                {getVehiclesForCategory(activeCategory).map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: index * 0.05
                    }}
                    className="flex-1 min-w-0 max-w-[220px]"
                  >
                    <VehicleCard vehicle={vehicle} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

