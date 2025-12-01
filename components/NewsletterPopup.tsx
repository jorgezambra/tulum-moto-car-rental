'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NewsletterPopup() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Show popup after 3 seconds, only if not already shown today
    const hasShownToday = localStorage.getItem('newsletterPopupShown')
    const today = new Date().toDateString()

    if (hasShownToday !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock subscription
    console.log('Newsletter subscription:', email)
    localStorage.setItem('newsletterPopupShown', new Date().toDateString())
    setSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setSubmitted(false)
      setEmail('')
    }, 2000)
  }

  const handleClose = () => {
    localStorage.setItem('newsletterPopupShown', new Date().toDateString())
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-turquoise/20"
          >
            {/* Decorative element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-turquoise to-reef-deep rounded-t-2xl" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
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
            </button>

            {submitted ? (
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t('newsletter.thanks')}
                </h2>
                <p className="text-gray-600">
                  {t('newsletter.checkEmail')}
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🎁</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {t('newsletter.title')}
                  </h2>
                  <p className="text-gray-600">
                    {t('newsletter.description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('contact.email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full bg-turquoise hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t('newsletter.claim')}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full text-gray-600 hover:text-gray-800 text-sm"
                  >
                    {t('newsletter.noThanks')}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


