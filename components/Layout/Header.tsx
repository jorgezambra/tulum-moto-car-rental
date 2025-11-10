'use client'

import { useState } from 'react'
import Link from 'next/link'
import CurrencyToggle from '@/components/CurrencyToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full px-2 sm:px-3 lg:px-4 py-3 sm:py-4">
        <div className="flex items-center w-full gap-2 lg:gap-3 relative">
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-turquoise whitespace-nowrap flex-1 text-center lg:flex-none lg:text-left"
          >
            Tulum OnWheels
          </Link>
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 ml-auto">
              <Link
                href="/"
                className="text-sm xl:text-base text-gray-700 hover:text-turquoise transition-colors whitespace-nowrap"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/#rentals"
                className="text-sm xl:text-base text-gray-700 hover:text-turquoise transition-colors whitespace-nowrap"
              >
                {t('nav.rentals')}
              </Link>
              <Link
                href="/about"
                className="text-sm xl:text-base text-gray-700 hover:text-turquoise transition-colors whitespace-nowrap"
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/contact"
                className="text-sm xl:text-base text-gray-700 hover:text-turquoise transition-colors whitespace-nowrap"
              >
                {t('nav.contact')}
              </Link>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2 ml-2 lg:ml-3">
            <LanguageToggle />
            <CurrencyToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed left-3 top-[68px] z-[70]"
            >
              <div className="inline-flex flex-col gap-2 border border-gray-200 rounded-lg bg-white shadow-xl px-4 py-3 w-max min-w-[200px]">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-base text-gray-700 hover:text-turquoise transition-colors py-1 whitespace-nowrap"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  href="/#rentals"
                  onClick={closeMenu}
                  className="text-base text-gray-700 hover:text-turquoise transition-colors py-1 whitespace-nowrap"
                >
                  {t('nav.rentals')}
                </Link>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="text-base text-gray-700 hover:text-turquoise transition-colors py-1 whitespace-nowrap"
                >
                  {t('nav.about')}
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="text-base text-gray-700 hover:text-turquoise transition-colors py-1 whitespace-nowrap"
                >
                  {t('nav.contact')}
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

