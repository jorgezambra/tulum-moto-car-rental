'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  label: string
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState(10)
  const [minutes, setMinutes] = useState(0)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number)
      setHours(isNaN(h) ? 10 : h)
      setMinutes(isNaN(m) ? 0 : m)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours)
    setMinutes(newMinutes)
    const timeString = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
    onChange(timeString)
  }

  const displayValue = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

  return (
    <div className="relative" ref={pickerRef}>
      <label className="text-sm font-semibold text-gray-700 flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-1">
        <span className="whitespace-nowrap">{label}</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-28 sm:w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition-colors text-left flex items-center justify-between bg-white hover:border-gray-300"
        >
          <span className="font-medium">{displayValue}</span>
          <svg
            className="w-5 h-5 text-turquoise"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </label>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 bottom-full mb-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full min-w-[200px]"
            >
              <div className="flex gap-4 items-center justify-center">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Hours
                  </label>
                  <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-hide">
                    {Array.from({ length: 24 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleTimeChange(i, minutes)}
                        className={`w-12 h-10 rounded-lg text-sm font-medium transition-colors ${
                          hours === i
                            ? 'bg-turquoise text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {String(i).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-2xl font-bold text-turquoise py-8">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Minutes
                  </label>
                  <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-hide">
                    {[0, 15, 30, 45].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleTimeChange(hours, m)}
                        className={`w-12 h-10 rounded-lg text-sm font-medium transition-colors ${
                          minutes === m
                            ? 'bg-turquoise text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

