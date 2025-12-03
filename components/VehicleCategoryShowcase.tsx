'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCars, getScooters, getATVs } from '@/data/vehicles'
import { useLanguage } from '@/contexts/LanguageContext'
import VehicleCard from './VehicleCard'
import VehicleDetailsExpanded from './VehicleDetailsExpanded'
import { Vehicle } from '@/types'

type CategoryKey = 'scooters' | 'atvs' | 'cars'

export default function VehicleCategoryShowcase() {
  const { t } = useLanguage()
  const scooters = getScooters()
  const cars = getCars()
  const atvs = getATVs()
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
      image: '/images/vehicles/scooter nobg.png',
    },
    {
      key: 'atvs' as const,
      title: 'ATVs & Buggies',
      accent: 'from-[#ffd29c] via-white to-white',
      vehicles: atvs,
      image: '/images/vehicles/atvnobg.png',
    },
    {
      key: 'cars' as const,
      title: t('vehicles.cars'),
      accent: 'from-[#b0d6ff] via-white to-white',
      vehicles: cars,
      image: '/images/vehicles/jeep nobg.png',
    },
  ]

  const getVehiclesForCategory = (key: CategoryKey) => {
    switch (key) {
      case 'scooters':
        return scooters
      case 'cars':
        return cars
      case 'atvs':
        return atvs
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
      <div className="flex-shrink-0 w-[110px] sm:w-[130px] md:w-[320px]">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isActive) {
              // Closing category - also close any expanded vehicle
              setActiveCategory(null)
              setExpandedVehicle(null)
            } else {
              // Opening category - clear any previously expanded vehicle
              setActiveCategory(category.key)
              setExpandedVehicle(null)
            }
          }}
          className="relative w-full aspect-square hover:scale-105 transition-transform duration-300 cursor-pointer bg-transparent border-none outline-none p-0 flex items-center justify-center"
          style={{ background: 'transparent' }}
        >
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-contain"
            style={{ background: 'transparent' }}
          />
        </button>
        {/* Category title below the card */}
        <div className="mt-2 text-center">
          <h3 className="text-sm sm:text-xl md:text-3xl lg:text-4xl font-bold text-black">
            {category.title}
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Horizontal Scrollable Layout: All cards in one row */}
      <div className="relative w-full">
        {/* Mobile: All three cards visible, centered, no padding */}
        <div className="md:hidden flex justify-center items-start py-4">
          <div className="flex gap-0 items-start">
            {categories.map((category) => (
              <div key={category.key}>
                {renderCategoryCard(category, activeCategory === category.key)}
              </div>
            ))}
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
                    className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth pl-[88px] pr-12 py-4"
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

