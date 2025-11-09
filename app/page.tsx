'use client'

import HeroSlider from '@/components/HeroSlider'
import ScooterCarousel from '@/components/ScooterCarousel'
import CarCarousel from '@/components/CarCarousel'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import WhatsAppBubble from '@/components/Layout/WhatsAppBubble'
import NewsletterPopup from '@/components/NewsletterPopup'
import TestimonialsSection from '@/components/TestimonialsSection'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <main className="w-full overflow-x-hidden">
        <HeroSlider />
        <section id="rentals" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 px-4">
              {t('vehicles.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {t('vehicles.description')}
            </p>
          </div>
          <div className="space-y-12 sm:space-y-16">
            <ScooterCarousel />
            <CarCarousel />
          </div>
        </section>
        <TestimonialsSection />
      </main>
      <Footer />
      <WhatsAppBubble />
      <NewsletterPopup />
    </>
  )
}

