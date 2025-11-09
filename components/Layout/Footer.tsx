'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12 sm:mt-16 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-bold text-turquoise mb-4">
              Tulum OnWheels
            </h3>
            <p className="text-gray-400">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-turquoise transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#rentals"
                  className="hover:text-turquoise transition-colors"
                >
                  {t('nav.rentals')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-turquoise transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-turquoise transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-gray-400">
              {t('footer.hours')}
              <br />
              {t('footer.location')}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Tulum OnWheels. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

