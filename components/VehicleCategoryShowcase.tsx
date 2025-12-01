'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { getCars, getScooters } from '@/data/vehicles'
import { useLanguage } from '@/contexts/LanguageContext'
import VehicleCard from './VehicleCard'
import VehicleDetailsExpanded from './VehicleDetailsExpanded'
import { Vehicle } from '@/types'

type CategoryKey = 'scooters' | 'atvs' | 'cars'

export default function VehicleCategoryShowcase() {
  const { t } = useLanguage()
  const scooters = getScooters()
  const cars = getCars()
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [expandedVehicle, setExpandedVehicle] = useState<Vehicle | null>(null)
  const [scrollStates, setScrollStates] = useState<{ [key: string]: { left: boolean; right: boolean } }>({})
  const [categoryScrollState, setCategoryScrollState] = useState<{ left: boolean; right: boolean }>({ left: false, right: false })
  const vehicleDetailsRef = useRef<HTMLDivElement>(null)
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const vehiclesSectionRef = useRef<HTMLDivElement>(null)
  const categoriesScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (expandedVehicle && vehicleDetailsRef.current) {
      // Wait for animation to complete, then scroll to center the expanded view
      setTimeout(() => {
        vehicleDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }, 400)
    }
  }, [expandedVehicle])

  const handleViewDetails = (vehicle: Vehicle) => {
    if (expandedVehicle?.id === vehicle.id) {
      setExpandedVehicle(null)
    } else {
      setExpandedVehicle(vehicle)
    }
  }

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

  const updateScrollState = (categoryKey: string) => {
    const carousel = carouselRefs.current[categoryKey]
    if (!carousel) return

    const canScrollLeft = carousel.scrollLeft > 10
    const canScrollRight = carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 10

    setScrollStates(prev => {
      const currentState = prev[categoryKey]
      // Only update if the state actually changed
      if (currentState?.left === canScrollLeft && currentState?.right === canScrollRight) {
        return prev
      }
      return {
        ...prev,
        [categoryKey]: { left: canScrollLeft, right: canScrollRight }
      }
    })
  }

  const scrollCarousel = (categoryKey: string, direction: 'left' | 'right') => {
    const carousel = carouselRefs.current[categoryKey]
    if (!carousel) return

    const cardWidth = carousel.querySelector('.vehicle-card')?.getBoundingClientRect().width || 0
    const gap = 16 // gap-4 = 16px
    const scrollAmount = (cardWidth + gap) * 2 // Scroll by 2 cards

    carousel.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })

    // Update scroll state after a short delay
    setTimeout(() => updateScrollState(categoryKey), 100)
  }

  const updateCategoryScrollState = () => {
    const container = categoriesScrollRef.current
    if (!container) return

    const scrollLeft = Math.max(0, container.scrollLeft)
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth)
    const threshold = 4

    const canScrollLeft = scrollLeft > threshold
    const canScrollRight = maxScrollLeft - scrollLeft > threshold

    setCategoryScrollState(prev => {
      if (prev.left === canScrollLeft && prev.right === canScrollRight) {
        return prev
      }
      return { left: canScrollLeft, right: canScrollRight }
    })
  }

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = categoriesScrollRef.current
    if (!container) return

    container.scrollBy({
      left: direction === 'left' ? -220 : 220,
      behavior: 'smooth'
    })

    setTimeout(updateCategoryScrollState, 200)
  }

  useEffect(() => {
    // Clear expanded vehicle when category changes
    if (activeCategory) {
      setExpandedVehicle(null)
    }
    
    // Update scroll states when active category changes
    if (activeCategory) {
      setTimeout(() => {
        updateScrollState(activeCategory)
      }, 100)
      
      // Auto-scroll to center the vehicles section in mobile view
      if (vehiclesSectionRef.current && window.innerWidth < 768) {
        setTimeout(() => {
          vehiclesSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }, 350) // Wait for animation to complete
      }
    }
  }, [activeCategory])

  useEffect(() => {
    // Update scroll states on window resize
    const handleResize = () => {
      Object.keys(carouselRefs.current).forEach(key => {
        if (carouselRefs.current[key]) {
          updateScrollState(key)
        }
      })

      updateCategoryScrollState()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const container = categoriesScrollRef.current
    if (!container) return

    const handleUpdates = () => updateCategoryScrollState()
    handleUpdates()

    container.addEventListener('scroll', handleUpdates, { passive: true })
    const observer = new ResizeObserver(handleUpdates)
    observer.observe(container)

    return () => {
      container.removeEventListener('scroll', handleUpdates)
      observer.disconnect()
    }
  }, [])

  const canScrollLeft = (categoryKey: string) => {
    return scrollStates[categoryKey]?.left ?? false
  }

  const canScrollRight = (categoryKey: string) => {
    return scrollStates[categoryKey]?.right ?? false
  }

  const renderCategoryCard = (category: typeof categories[0], isActive: boolean) => {
    return (
      <div className="flex-shrink-0 w-[165px] sm:w-[200px] md:w-[320px]">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setActiveCategory(isActive ? null : category.key)
          }}
          className={`relative w-full aspect-square text-left rounded-xl md:rounded-2xl border-2 border-black bg-gradient-to-br ${category.accent} hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover brightness-110 saturate-110"
              sizes="(max-width: 768px) 165px, (max-width: 640px) 200px, 320px"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-4 md:pt-6 sm:pt-8 px-2">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center">
              {category.title}
            </h3>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Horizontal Scrollable Layout: All cards in one row */}
      <div className="relative w-full">
        {/* Mobile: Scrollable */}
        <div className="md:hidden relative">
          {/* Left arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              scrollCategories('left')
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white text-reef-ink border border-turquoise rounded-full p-1 shadow-md transition-opacity ${categoryScrollState.left ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll categories left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Right arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              scrollCategories('right')
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white text-reef-ink border border-turquoise rounded-full p-1 shadow-md transition-opacity ${categoryScrollState.right ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll categories right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={categoriesScrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth pl-12 pr-12"
            style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
            onScroll={() => {
              requestAnimationFrame(() => updateCategoryScrollState())
            }}
          >
            <div className="flex gap-4 items-start py-4" style={{ width: 'max-content' }}>
              {categories.map((category) => (
                <div key={category.key} style={{ scrollSnapAlign: 'start' }}>
                  {renderCategoryCard(category, activeCategory === category.key)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Desktop: Centered */}
        <div className="hidden md:flex justify-center items-start py-4">
          <div className="flex gap-8">
            {categories.map((category) => (
              <div key={category.key}>
                {renderCategoryCard(category, activeCategory === category.key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile & Desktop: Vehicles appear in a single section below all category cards */}
      <AnimatePresence initial={false}>
        {activeCategory && (
          <motion.div
            ref={vehiclesSectionRef}
            key={activeCategory}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4 overflow-visible w-full"
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
              <div className="relative w-full">
                {/* Mobile: Scrollable carousel with arrows */}
                <div className="md:hidden relative">
                  {/* Left Arrow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      scrollCarousel(activeCategory, 'left')
                    }}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-turquoise text-white rounded-full p-2 shadow-lg hover:bg-reef-deep transition-colors ${
                      canScrollLeft(activeCategory) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    aria-label="Previous vehicles"
                  >
                    <svg
                      className="w-5 h-5"
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

                  {/* Right Arrow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      scrollCarousel(activeCategory, 'right')
                    }}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-turquoise text-white rounded-full p-2 shadow-lg hover:bg-reef-deep transition-colors ${
                      canScrollRight(activeCategory) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    aria-label="Next vehicles"
                  >
                    <svg
                      className="w-5 h-5"
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

                  {/* Mobile Carousel */}
                  <div
                    ref={(el) => {
                      carouselRefs.current[activeCategory] = el
                      if (el) {
                        updateScrollState(activeCategory)
                      }
                    }}
                    className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-12 py-4"
                    style={{ scrollSnapType: 'x mandatory' }}
                    onScroll={(e) => {
                      requestAnimationFrame(() => {
                        updateScrollState(activeCategory)
                      })
                    }}
                  >
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
                        className="vehicle-card flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] max-w-[calc(50%-8px)]"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <VehicleCard
                          vehicle={vehicle}
                          onViewDetails={handleViewDetails}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden md:block space-y-8">
                  <div className="flex flex-row gap-4 overflow-visible justify-center items-start flex-wrap">
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
                        className="w-[220px] flex-shrink-0"
                      >
                        <VehicleCard
                          vehicle={vehicle}
                          onViewDetails={handleViewDetails}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded vehicle details (shown for both mobile and desktop) - Only when a vehicle is selected */}
      <AnimatePresence mode="wait">
        {expandedVehicle ? (
          <motion.div
            key={expandedVehicle.id}
            ref={vehicleDetailsRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-4"
          >
            <VehicleDetailsExpanded
              vehicle={expandedVehicle}
              onClose={() => setExpandedVehicle(null)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

