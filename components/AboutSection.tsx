'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutSection() {
  const { t } = useLanguage()
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Decorative background for About section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-reef-deep/10 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="w-full relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-4 inline-block border-b-4 border-turquoise px-6 py-2">
            {t('about.title')}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">

        {/* Business Story */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8 transform hover:scale-[1.01] transition-transform duration-300">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            {t('about.story')}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t('about.storyDesc')}
          </p>
        </div>

        {/* Delivery Information & Operating Hours - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Information - Left Column */}
          <div className="bg-gradient-to-br from-turquoise/10 to-reef-deep/10 rounded-lg shadow-md p-4 sm:p-6 border border-turquoise/20">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('about.delivery')}
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-turquoise mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{t('about.delivery1')}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-turquoise mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{t('about.delivery2')}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-turquoise mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{t('about.delivery3')}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-turquoise mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{t('about.delivery4')}</span>
              </div>
            </div>
          </div>

          {/* Operating Hours - Right Column */}
          <div className="bg-gradient-to-r from-turquoise to-reef-deep rounded-lg shadow-lg p-4 sm:p-6 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">{t('about.hours')}</h3>
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="font-semibold">{t('about.monSat')}</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t('about.sunday')}</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-90">
              {t('about.emergency')}
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 sm:mt-20 mb-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-4 inline-block border-b-4 border-turquoise px-6 py-2">
              {t('about.whyChoose')}
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 w-full group">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.fleet')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.fleetDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-turquoise/5 to-white rounded-lg shadow-md p-4 border border-turquoise/10 hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.prices')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.pricesDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-turquoise/5 to-white rounded-lg shadow-md p-4 border border-turquoise/10 hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.flexible')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.flexibleDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-turquoise/5 to-white rounded-lg shadow-md p-4 border border-turquoise/10 hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.support')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.supportDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-turquoise/5 to-white rounded-lg shadow-md p-4 border border-turquoise/10 hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.safety')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.safetyDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-turquoise/5 to-white rounded-lg shadow-md p-4 border border-turquoise/10 hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {t('about.fast')}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('about.fastDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

