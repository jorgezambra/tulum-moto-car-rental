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
      className="relative bg-white rounded-2xl shadow-[0_35px_65px_-20px_rgba(15,23,42,0.6)] ring-1 ring-slate-900/5 after:absolute after:inset-x-5 after:-bottom-7 after:h-8 after:rounded-full after:bg-slate-900/15 after:blur-xl after:content-[''] after:-z-10 overflow-visible flex-shrink-0 w-[220px] sm:w-[240px] h-[320px] sm:h-[340px] flex flex-col"
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

