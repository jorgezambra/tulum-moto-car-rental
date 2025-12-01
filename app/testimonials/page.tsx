'use client'

import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { reviews } from '@/data/reviews'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ImageModal from '@/components/ImageModal'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TestimonialsPage() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
            {t('testimonials.title')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  {review.image ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-turquoise flex items-center justify-center text-white text-xl font-bold">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{review.name}</h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${
                            i < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                
                {/* Vehicle Image Thumbnail */}
                {review.vehicleImage && (
                  <div className="mb-4">
                    <button
                      onClick={() => setSelectedImage(review.vehicleImage!)}
                      className="relative w-full h-48 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={review.vehicleImage}
                        alt={`Vehicle from ${review.name}'s review`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </button>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {t('testimonials.clickToView')}
                    </p>
                  </div>
                )}
                
                <p className="text-sm text-gray-400">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            alt="Vehicle image from review"
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </main>
      <Footer />
    </>
  )
}

