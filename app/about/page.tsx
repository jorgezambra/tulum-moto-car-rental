'use client'

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
              {t('about.title')}
            </h1>

            {/* Business Story */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {t('about.story')}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                <p>
                  Welcome to Tulum OnWheels, your premier destination for
                  exploring the beautiful beaches and vibrant culture of Tulum,
                  Mexico. We started with a simple mission: to make adventure
                  accessible to everyone visiting this paradise.
                </p>
                <p>
                  Founded by passionate travelers who fell in love with Tulum's
                  stunning coastline and rich Mayan heritage, we understand what
                  visitors need to make the most of their stay. Whether you're
                  cruising along the beach on one of our reliable scooters or
                  taking a road trip in one of our comfortable cars, we're here
                  to help you discover the magic of the Yucatan Peninsula.
                </p>
                <p>
                  Our fleet is carefully maintained and regularly serviced to
                  ensure your safety and comfort. We pride ourselves on
                  exceptional customer service, competitive prices, and making
                  the rental process as smooth as possible.
                </p>
              </div>
            </section>

            {/* Delivery Information */}
            <section className="mb-12 bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {t('about.delivery')}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Can't make it to our location? No problem! We offer convenient
                  delivery service directly to your hotel, Airbnb, or any
                  address in the Tulum area.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Delivery fees are calculated based on distance from our main
                    location
                  </li>
                  <li>
                    Typical delivery fee: 100-200 MXN depending on location
                  </li>
                  <li>Delivery available 7 days a week during operating hours</li>
                  <li>
                    Contact us in advance to arrange pickup and return
                    scheduling
                  </li>
                </ul>
              </div>
            </section>

            {/* Operating Hours */}
            <section className="mb-12 bg-gradient-to-r from-turquoise to-reef-deep rounded-lg shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">{t('about.hours')}</h2>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">{t('about.monSat')}</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">{t('about.sunday')}</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <p className="mt-4 text-sm opacity-90">
                  {t('about.emergency')}
                </p>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {t('about.whyChoose')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4 w-10 h-10">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="6" cy="18" r="2" fill="currentColor" />
                      <circle cx="18" cy="18" r="2" fill="currentColor" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 12h10M6 12V10a2 2 0 012-2h8a2 2 0 012 2v8" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h-2v-2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t('about.fleet')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.fleetDesc')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4 w-10 h-10">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t('about.prices')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.pricesDesc')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4 w-10 h-10">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t('about.flexible')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.flexibleDesc')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4 w-10 h-10">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t('about.support')}
                  </h3>
                  <p className="text-gray-600">
                    {t('about.supportDesc')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

