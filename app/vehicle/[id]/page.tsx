import { vehicles } from '@/data/vehicles'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import VehicleDetailClient from '@/components/VehicleDetailClient'
import { Metadata } from 'next'

export async function generateStaticParams() {
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const vehicle = vehicles.find((v) => v.id === params.id)

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found - Tulum Rentals',
    }
  }

  return {
    title: `${vehicle.name} - Tulum Rentals | ${vehicle.type === 'scooter' ? 'Scooter' : 'Car'} Rental Tulum`,
    description: `Rent ${vehicle.name} in Tulum. ${vehicle.description || `Premium ${vehicle.type} rental`}. ${vehicle.pricePerDay} MXN/day. Book now!`,
    keywords: `${vehicle.name} Tulum, ${vehicle.type} rental Tulum, rent ${vehicle.type} Tulum Mexico`,
    openGraph: {
      title: `${vehicle.name} - Tulum Rentals`,
      description: vehicle.description || `Rent ${vehicle.name} in Tulum`,
      type: 'website',
    },
  }
}

export default function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = vehicles.find((v) => v.id === params.id)

  if (!vehicle) {
    notFound()
  }

  return <VehicleDetailClient vehicle={vehicle} />
}

