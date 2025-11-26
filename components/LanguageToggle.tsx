'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-0.5 bg-black rounded-lg p-0.5">
      <button
        onClick={() => setLanguage('en')}
        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
          language === 'en'
            ? 'bg-gray-800 text-white shadow-sm'
            : 'text-white/70 hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
          language === 'es'
            ? 'bg-gray-800 text-white shadow-sm'
            : 'text-white/70 hover:text-white'
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}

