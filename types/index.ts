export interface Vehicle {
  id: string
  name: string
  type: 'scooter' | 'car' | 'atv'
  model: string
  pricePerDay: number // in MXN
  images: string[]
  description?: string
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  image?: string // Reviewer profile photo
  vehicleImage?: string // Vehicle image thumbnail from the review
}

export interface Booking {
  vehicleId: string
  name: string
  email: string
  phone: string
  startDate: Date
  endDate: Date
  deliveryAddress?: string
  deliveryFee?: number
}

