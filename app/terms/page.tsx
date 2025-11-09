'use client'

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsPage() {
  const { t } = useLanguage()
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
              {t('terms.title')}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.age')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.ageDesc')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.insurance')}
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{t('terms.insuranceDesc1')}</p>
                  <p>{t('terms.insuranceDesc2')}</p>
                  <p>{t('terms.insuranceDesc3')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.rental')}
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{t('terms.rentalDesc1')}</p>
                  <p>{t('terms.rentalDesc2')}</p>
                  <p>{t('terms.rentalDesc3')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.restrictions')}
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t('terms.restrictions1')}</li>
                  <li>{t('terms.restrictions2')}</li>
                  <li>{t('terms.restrictions3')}</li>
                  <li>{t('terms.restrictions4')}</li>
                  <li>{t('terms.restrictions5')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.fuel')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.fuelDesc')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.damage')}
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{t('terms.damageDesc1')}</p>
                  <p>{t('terms.damageDesc2')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.liability')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.liabilityDesc')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('terms.changes')}
                </h2>
                <p className="text-gray-600">
                  {t('terms.changesDesc')}
                </p>
              </section>

              <div className="bg-gray-100 rounded-lg p-6 mt-8">
                <p className="text-gray-600">
                  {t('terms.agree')}{' '}
                  <a href="/contact" className="text-turquoise hover:underline">
                    {t('terms.contactLink')}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

