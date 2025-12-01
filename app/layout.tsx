import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Tulum OnWheels - Scooter & Car Rental | Best Vehicle Rental in Tulum Mexico',
  description: 'Rent scooters and cars in Tulum, Mexico. Easy booking, delivery available. Competitive prices, well-maintained fleet, 24/7 support. Book your adventure today!',
  keywords: 'scooter rental Tulum, car hire Tulum Mexico, vehicle rental Tulum, Tulum scooter rental, rent car Tulum, motorcycle rental Tulum',
  openGraph: {
    title: 'Tulum OnWheels - Scooter & Car Rental',
    description: 'Rent scooters and cars in Tulum, Mexico. Easy booking, delivery available.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

