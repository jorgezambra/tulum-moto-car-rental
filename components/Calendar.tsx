'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface CalendarProps {
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const today = new Date()
  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Generate fake availability - block random days
  const isAvailable = (date: Date): boolean => {
    // Block some random days (about 20% of dates)
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000
    )
    return dayOfYear % 5 !== 0 // Available if not divisible by 5
  }

  const isDateInPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate < today
  }

  const handleDateClick = (date: Date) => {
    if (isDateInPast(date) || !isAvailable(date)) return

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date)
      setSelectedEnd(null)
      onDateSelect?.(date, null)
    } else if (selectedStart && !selectedEnd) {
      if (date < selectedStart) {
        setSelectedStart(date)
        setSelectedEnd(null)
        onDateSelect?.(date, null)
      } else {
        setSelectedEnd(date)
        onDateSelect?.(selectedStart, date)
      }
    }
  }

  const isDateSelected = (date: Date): boolean => {
    if (!selectedStart) return false
    if (!selectedEnd) {
      return (
        date.toDateString() === selectedStart.toDateString()
      )
    }
    return (
      date >= selectedStart && date <= selectedEnd
    )
  }

  const isInRange = (date: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false
    return date > selectedStart && date < selectedEnd
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const { t } = useLanguage()
  
  const monthNames = [
    t('calendar.january'),
    t('calendar.february'),
    t('calendar.march'),
    t('calendar.april'),
    t('calendar.may'),
    t('calendar.june'),
    t('calendar.july'),
    t('calendar.august'),
    t('calendar.september'),
    t('calendar.october'),
    t('calendar.november'),
    t('calendar.december'),
  ]
  
  const dayNames = [
    t('calendar.sun'),
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
  ]

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear, currentMonth, i))
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 w-full max-w-[400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} />
          }

          const available = isAvailable(date)
          const isPast = isDateInPast(date)
          const selected = isDateSelected(date)
          const inRange = isInRange(date)

          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={!available || isPast}
              className={`
                h-10 rounded-lg text-sm font-medium transition-colors
                ${!available || isPast
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : selected || inRange
                  ? 'bg-turquoise text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }
              `}
              whileHover={available && !isPast ? { scale: 1.1 } : {}}
            >
              {date.getDate()}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span className="text-sm text-gray-600">{t('vehicle.calendar.available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span className="text-sm text-gray-600">{t('vehicle.calendar.booked')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-turquoise rounded"></div>
          <span className="text-sm text-gray-600">{t('vehicle.calendar.selected')}</span>
        </div>
      </div>
    </div>
  )
}


