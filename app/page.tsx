'use client'

import HeroSlider from '@/components/HeroSlider'
import VehicleCategoryShowcase from '@/components/VehicleCategoryShowcase'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import WhatsAppBubble from '@/components/Layout/WhatsAppBubble'
import NewsletterPopup from '@/components/NewsletterPopup'
import TestimonialsSection from '@/components/TestimonialsSection'
import { useLanguage } from '@/contexts/LanguageContext'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

export default function Home() {
  const { t } = useLanguage()
  const sectionSpacing = "py-16 sm:py-24"

  return (
    <>
      <Header />
      <main className="w-full overflow-x-hidden overflow-y-visible bg-[#F5F9F9] relative">
        {/* Adventure Pattern Background */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-width='1'%3E%3Cpath d='M10 50 Q 25 35 40 50 T 70 50' /%3E%3Cpath d='M20 80 Q 35 65 50 80 T 80 80' /%3E%3Cpath d='M5 20 L 15 5 L 25 20 Z' /%3E%3Ccircle cx='80' cy='20' r='5' /%3E%3Cpath d='M60 60 Q 70 50 80 60 Q 90 70 100 60' /%3E%3C/g%3E%3C/svg%3E")` 
             }} 
        />
        
        {/* Organic Shapes Overlay - Deeper Colors */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-turquoise/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-reef-deep/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none mix-blend-multiply" />

        <HeroSlider />
        {/* Global rating badge */}
        <div className="w-full flex justify-center mt-8 mb-8 relative z-10">
          <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-gradient-to-r from-turquoise to-reef-deep text-white shadow-[0_10px_25px_rgba(13,148,136,0.35)] border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-amber-300 drop-shadow">
              {Array.from({ length: 5 }).map((_, idx) => (
                <svg
                  key={idx}
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-lg font-black tracking-tight leading-none">5.0</div>
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Avg. rating</span>
          </div>
        </div>
        {/* Rentals section */}
        <motion.section 
          id="rentals" 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-[90px] sm:pb-24 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-5 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-turquoise blur-3xl mix-blend-multiply filter" />
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-reef-deep blur-3xl mix-blend-multiply filter" />
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 inline-block border-b-4 border-turquoise px-6 py-2">
                {t('vehicles.title')}
              </h2>
            </div>
            <VehicleCategoryShowcase />
          </div>
        </motion.section>
        
        <motion.div
          className={sectionSpacing}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <AboutSection />
        </motion.div>

        <motion.div
          className={sectionSpacing}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <ContactSection />
        </motion.div>

        <motion.div
          className={sectionSpacing}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <TestimonialsSection />
        </motion.div>
      </main>
      <Footer />
      <WhatsAppBubble />
      <NewsletterPopup />
    </>
  )
}

