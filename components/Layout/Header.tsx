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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="w-full px-4 sm:px-6 lg:px-12 pt-6 lg:pt-10 pb-4">
        <div className="flex items-center w-full gap-3 relative">
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-full bg-white/90 text-turquoise border border-white/70 backdrop-blur transition"
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
            className="text-4xl sm:text-[3rem] font-black text-white whitespace-nowrap flex-1 text-center lg:flex-none lg:text-left tracking-wide"
          >
            Tulum OnWheels
          </Link>
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 ml-auto">
              <Link
                href="/"
                className="text-sm xl:text-base font-semibold text-black whitespace-nowrap px-4 py-1.5 rounded-full bg-turquoise transition hover:bg-reef-deep"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/#rentals"
                className="text-sm xl:text-base font-semibold text-black whitespace-nowrap px-4 py-1.5 rounded-full bg-turquoise transition hover:bg-reef-deep"
              >
                {t('nav.rentals')}
              </Link>
              <Link
                href="/#reviews"
                className="text-sm xl:text-base font-semibold text-black whitespace-nowrap px-4 py-1.5 rounded-full bg-turquoise transition hover:bg-reef-deep"
              >
                {t('nav.reviews')}
              </Link>
              <Link
                href="/about"
                className="text-sm xl:text-base font-semibold text-black whitespace-nowrap px-4 py-1.5 rounded-full bg-turquoise transition hover:bg-reef-deep"
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/contact"
                className="text-sm xl:text-base font-semibold text-black whitespace-nowrap px-4 py-1.5 rounded-full bg-turquoise transition hover:bg-reef-deep"
              >
                {t('nav.contact')}
              </Link>
          </nav>
          <div className="flex items-center gap-2 ml-2 lg:ml-4">
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
              className="lg:hidden fixed left-4 sm:left-6 top-[76px] z-[70]"
            >
              <div className="inline-flex flex-col gap-2 border border-gray-200 rounded-lg bg-white shadow-xl px-4 py-3 w-max min-w-[200px]">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-base text-turquoise hover:text-reef-deep transition-colors py-1 whitespace-nowrap font-semibold"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  href="/#rentals"
                  onClick={closeMenu}
                  className="text-base text-turquoise hover:text-reef-deep transition-colors py-1 whitespace-nowrap font-semibold"
                >
                  {t('nav.rentals')}
                </Link>
                <Link
                  href="/#reviews"
                  onClick={closeMenu}
                  className="text-base text-turquoise hover:text-reef-deep transition-colors py-1 whitespace-nowrap font-semibold"
                >
                  {t('nav.reviews')}
                </Link>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="text-base text-turquoise hover:text-reef-deep transition-colors py-1 whitespace-nowrap font-semibold"
                >
                  {t('nav.about')}
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="text-base text-turquoise hover:text-reef-deep transition-colors py-1 whitespace-nowrap font-semibold"
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

