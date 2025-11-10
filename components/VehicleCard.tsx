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
      className="relative bg-white rounded-2xl shadow-[0_20px_40px_-18px_rgba(15,23,42,0.45)] after:absolute after:inset-x-6 after:-bottom-6 after:h-6 after:rounded-full after:bg-gradient-to-t after:from-slate-900/10 after:to-transparent after:content-[''] overflow-visible flex-shrink-0 w-[220px] sm:w-[240px] h-[320px] sm:h-[340px] flex flex-col"
    >
      <div className="relative h-32 sm:h-36 w-full bg-white border-b border-gray-200 p-3 flex items-center justify-center rounded-t-2xl overflow-hidden">
        <Image
          src={vehicle.images[0]}
          alt={vehicle.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 220px, 240px"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {vehicle.name}
        </h3>
        <div className="mt-auto space-y-3">
          <p className="text-xl font-bold text-turquoise text-center">
            {formatted}
          </p>
          <Link
            href={`/vehicle/${vehicle.id}`}
            className="block w-full text-center bg-sunset-orange text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm"
          >
            {t('vehicle.viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

