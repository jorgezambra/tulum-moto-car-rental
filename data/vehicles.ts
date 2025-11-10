import { Vehicle } from '@/types'

// Helper function to get vehicle description based on language
export const getVehicleDescription = (vehicleId: string, language: 'en' | 'es'): string => {
  const descriptions: Record<string, { en: string; es: string }> = {
    'scooter-1': {
      en: 'Classic retro-styled scooter with elegant black finish and brown leather seat. Perfect for stylish rides around Tulum.',
      es: 'Scooter retro clásico con elegante acabado negro y asiento de cuero marrón. Perfecto para paseos elegantes por Tulum.',
    },
    'scooter-2': {
      en: 'Vibrant mint green Vespa with classic design. Features a comfortable tan leather seat and chrome accents. Ideal for exploring Tulum in style.',
      es: 'Vespa verde menta vibrante con diseño clásico. Cuenta con un cómodo asiento de cuero beige y detalles cromados. Ideal para explorar Tulum con estilo.',
    },
    'scooter-3': {
      en: 'Modern underbone motorcycle with sporty white finish and red accents. Reliable 125cc engine perfect for daily commuting.',
      es: 'Motocicleta underbone moderna con acabado blanco deportivo y acentos rojos. Motor 125cc confiable perfecto para desplazamientos diarios.',
    },
    'scooter-4': {
      en: 'Modern commuter scooter with tall windscreen and dual headlights. Metallic blue finish with comfortable two-tier seating.',
      es: 'Scooter urbano moderno con parabrisas alto y faros dobles. Acabado azul metálico con cómodo asiento de dos niveles.',
    },
    'scooter-5': {
      en: 'Elegant light pink scooter with classic retro design. Brown leather seat and chrome details. Perfect for leisurely rides through Tulum.',
      es: 'Scooter elegante rosa claro con diseño retro clásico. Asiento de cuero marrón y detalles cromados. Perfecto para paseos tranquilos por Tulum.',
    },
    'car-1': {
      en: 'Compact silver sedan that is easy to park and great for quick city trips.',
      es: 'Sedán plateado compacto, fácil de estacionar y perfecto para recorridos rápidos por la ciudad.',
    },
    'car-2': {
      en: 'Rugged Jeep Wrangler with 4x4 capability for exploring beaches and jungle roads.',
      es: 'Jeep Wrangler todoterreno con tracción 4x4 para explorar playas y caminos selváticos.',
    },
    'car-3': {
      en: 'Spacious Kia Sorento SUV with plenty of cargo space for family adventures.',
      es: 'Amplia SUV Kia Sorento con mucho espacio de carga para aventuras en familia.',
    },
    'car-4': {
      en: 'Three-row crossover with van-like comfort, perfect for groups and transfers.',
      es: 'Crossover de tres filas con comodidad tipo van, ideal para grupos y traslados.',
    },
    'car-5': {
      en: 'Premium sedan with elevated comfort and smooth highway cruising.',
      es: 'Sedán premium con comodidad superior y manejo suave en carretera.',
    },
  }

  return descriptions[vehicleId]?.[language] || descriptions[vehicleId]?.en || ''
}

export const vehicles: Vehicle[] = [
  // Scooters
  {
    id: 'scooter-1',
    name: 'Vespa Classic 150',
    type: 'scooter',
    model: 'Vesla 150',
    pricePerDay: 400,
    images: [
      '/images/vehicles/moto/vesla-150-black.png',
      '/images/vehicles/moto/vesla-150-black.png',
      '/images/vehicles/moto/vesla-150-black.png',
    ],
    description: 'Classic retro-styled scooter with elegant black finish and brown leather seat. Perfect for stylish rides around Tulum.',
  },
  {
    id: 'scooter-2',
    name: 'Vespa Primavera Mint',
    type: 'scooter',
    model: 'Vespa Primavera',
    pricePerDay: 350,
    images: [
      '/images/vehicles/moto/vespa-mint-green.png',
      '/images/vehicles/moto/vespa-mint-green.png',
      '/images/vehicles/moto/vespa-mint-green.png',
    ],
    description: 'Vibrant mint green Vespa with classic design. Features a comfortable tan leather seat and chrome accents. Ideal for exploring Tulum in style.',
  },
  {
    id: 'scooter-3',
    name: 'Honda Wave 125i',
    type: 'scooter',
    model: 'Honda Wave 125i',
    pricePerDay: 250,
    images: [
      '/images/vehicles/moto/honda-wave-125i-white.png',
      '/images/vehicles/moto/honda-wave-125i-white.png',
      '/images/vehicles/moto/honda-wave-125i-white.png',
    ],
    description: 'Modern underbone motorcycle with sporty white finish and red accents. Reliable 125cc engine perfect for daily commuting.',
  },
  {
    id: 'scooter-4',
    name: 'Suzuki Burgman 125EX',
    type: 'scooter',
    model: 'Suzuki Burgman Street 125EX',
    pricePerDay: 300,
    images: [
      '/images/vehicles/moto/suzuki-burgman-blue.png',
      '/images/vehicles/moto/suzuki-burgman-blue.png',
      '/images/vehicles/moto/suzuki-burgman-blue.png',
    ],
    description: 'Modern commuter scooter with tall windscreen and dual headlights. Metallic blue finish with comfortable two-tier seating.',
  },
  {
    id: 'scooter-5',
    name: 'Vespa Classic Pink',
    type: 'scooter',
    model: 'Vespa Classic',
    pricePerDay: 375,
    images: [
      '/images/vehicles/moto/vespa-pink.png',
      '/images/vehicles/moto/vespa-pink.png',
      '/images/vehicles/moto/vespa-pink.png',
    ],
    description: 'Elegant light pink scooter with classic retro design. Brown leather seat and chrome details. Perfect for leisurely rides through Tulum.',
  },
  // Cars
  {
    id: 'car-1',
    name: 'Silver Compact Sedan',
    type: 'car',
    model: 'Nissan Sentra',
    pricePerDay: 600,
    images: [
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
    ],
    description: 'Comfortable compact sedan perfect for city cruising and quick getaways around Tulum.',
  },
  {
    id: 'car-2',
    name: 'Jeep Wrangler 4x4',
    type: 'car',
    model: 'Jeep Wrangler Unlimited',
    pricePerDay: 700,
    images: [
      '/images/vehicles/cars/Gemini_Generated_Image_m4094pm4094pm409.png',
      '/images/vehicles/cars/Gemini_Generated_Image_m4094pm4094pm409.png',
      '/images/vehicles/cars/Gemini_Generated_Image_m4094pm4094pm409.png',
      '/images/vehicles/cars/Gemini_Generated_Image_m4094pm4094pm409.png',
    ],
    description: 'Rugged 4x4 perfect for off-road adventures, beach runs, and exploring cenotes.',
  },
  {
    id: 'car-3',
    name: 'Kia Sorento SUV',
    type: 'car',
    model: 'Kia Sorento',
    pricePerDay: 800,
    images: [
      '/images/vehicles/cars/Gemini_Generated_Image_nmh646nmh646nmh6.png',
      '/images/vehicles/cars/Gemini_Generated_Image_nmh646nmh646nmh6.png',
      '/images/vehicles/cars/Gemini_Generated_Image_nmh646nmh646nmh6.png',
      '/images/vehicles/cars/Gemini_Generated_Image_nmh646nmh646nmh6.png',
    ],
    description: 'Spacious midsize SUV with room for the family and luggage for longer trips.',
  },
  {
    id: 'car-4',
    name: 'Family Adventure Van',
    type: 'car',
    model: 'Dodge Journey',
    pricePerDay: 900,
    images: [
      '/images/vehicles/cars/Gemini_Generated_Image_ywql5kywql5kywql.png',
      '/images/vehicles/cars/Gemini_Generated_Image_ywql5kywql5kywql.png',
      '/images/vehicles/cars/Gemini_Generated_Image_ywql5kywql5kywql.png',
      '/images/vehicles/cars/Gemini_Generated_Image_ywql5kywql5kywql.png',
    ],
    description: 'Three-row crossover with van-like space, ideal for groups and airport transfers.',
  },
  {
    id: 'car-5',
    name: 'Premium Sedan',
    type: 'car',
    model: 'Executive Sedan',
    pricePerDay: 1000,
    images: [
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
      '/images/vehicles/cars/Gemini_Generated_Image_g5ycjfg5ycjfg5yc.png',
    ],
    description: 'Luxury sedan with premium comfort features for elevated stays in Tulum.',
  },
]

export const getScooters = (): Vehicle[] => {
  return vehicles.filter(v => v.type === 'scooter')
}

export const getCars = (): Vehicle[] => {
  return vehicles.filter(v => v.type === 'car')
}

