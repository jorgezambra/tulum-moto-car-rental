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
      className="relative bg-white rounded-2xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] ring-1 ring-slate-900/5 overflow-hidden aspect-square flex flex-col"
    >
      <div className="relative flex-1 w-full bg-white border-b border-gray-200 p-4 sm:p-2 flex items-center justify-center rounded-t-2xl overflow-hidden">
        <Image
          src={vehicle.images[0]}
          alt={vehicle.name}
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 200px, 220px"
        />
      </div>
      <div className="px-3 pt-2 pb-3 flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 text-center mb-1">
          {vehicle.name}
        </h3>
        <p className="text-lg font-bold text-turquoise text-center mb-2">
          {formatted}
        </p>
        <Link
          href={`/vehicle/${vehicle.id}`}
          className="block w-full text-center bg-black text-white py-1.5 px-3 rounded-xl hover:bg-gray-800 transition-colors font-medium text-xs"
        >
          {t('vehicle.viewDetails')}
        </Link>
      </div>
    </motion.div>
  )
}

