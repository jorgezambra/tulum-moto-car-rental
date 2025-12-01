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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-4 transition-all duration-300">
        <div className="flex items-center w-full gap-3 relative justify-between">
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
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
                className="w-6 h-6"
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
            className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-md hover:scale-105 transition-transform whitespace-nowrap"
          >
            <span className="text-turquoise">Tulum</span> OnWheels
          </Link>

          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 ml-auto">
              {[
                { href: '/', label: 'nav.home' },
                { href: '/#rentals', label: 'nav.rentals' },
                { href: '/#reviews', label: 'nav.reviews' },
                { href: '/about', label: 'nav.about' },
                { href: '/contact', label: 'nav.contact' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-bold text-white hover:text-turquoise transition-colors group"
                >
                  {t(link.label)}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-turquoise transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto lg:ml-8 flex-shrink-0">
            <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <LanguageToggle />
              <div className="w-px h-4 bg-white/20 mx-1" />
              <CurrencyToggle />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10 mt-4 rounded-2xl"
            >
              <div className="flex flex-col p-4 gap-2">
                {[
                  { href: '/', label: 'nav.home' },
                  { href: '/#rentals', label: 'nav.rentals' },
                  { href: '/#reviews', label: 'nav.reviews' },
                  { href: '/about', label: 'nav.about' },
                  { href: '/contact', label: 'nav.contact' }
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block px-4 py-3 text-lg font-bold text-white hover:text-turquoise hover:bg-white/5 rounded-xl transition-all border-b border-white/5 last:border-0"
                    >
                      {t(link.label)}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

