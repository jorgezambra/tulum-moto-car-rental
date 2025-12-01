'use client'

import { Vehicle } from '@/types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface VehicleCardProps {
  vehicle: Vehicle
  onViewDetails?: (vehicle: Vehicle) => void
}

export default function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  
  const formatted = formatPrice(vehicle.pricePerDay)
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white rounded-2xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] border-2 border-black overflow-hidden flex flex-col"
      style={{ aspectRatio: '1 / 1.6' }}
    >
      {/* Image section - takes remaining space */}
      <div className="relative w-full bg-white border-b border-gray-200 flex items-center justify-center overflow-hidden flex-1 min-h-0">
        <Image
          src={vehicle.images[0]}
          alt={vehicle.name}
          fill
          className="object-contain object-center p-2"
          sizes="(max-width: 640px) 200px, 220px"
        />
      </div>
      {/* Text section - sizes to content */}
      <div className="px-2 pt-2 pb-0 flex flex-col gap-1 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-800 text-center truncate">
          {vehicle.name}
        </h3>
        <p className="text-sm font-bold text-turquoise text-center truncate">
          {formatted}
        </p>
        <button
          onClick={() => onViewDetails?.(vehicle)}
          className="block w-full text-center bg-black text-white py-1 px-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-[10px] mt-1 mb-1"
        >
          {t('vehicle.viewDetails')}
        </button>
      </div>
    </motion.div>
  )
}

