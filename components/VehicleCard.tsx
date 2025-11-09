'use client'

import { Vehicle } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  
  const formatted = formatPrice(vehicle.pricePerDay)
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 w-[280px] sm:w-72"
    >
      <div className="relative h-36 sm:h-44 w-full bg-gray-200 p-2 sm:p-3">
        <Image
          src={vehicle.images[0]}
          alt={vehicle.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 280px, 288px"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {vehicle.name}
        </h3>
        <p className="text-2xl font-bold text-turquoise mb-4">
          {formatted}
        </p>
        <Link
          href={`/vehicle/${vehicle.id}`}
          className="block w-full text-center bg-sunset-orange text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          {t('vehicle.viewDetails')}
        </Link>
      </div>
    </motion.div>
  )
}

