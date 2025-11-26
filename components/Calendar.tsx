'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import TimePicker from './TimePicker'

interface CalendarProps {
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void
  pickupTime?: string
  dropoffTime?: string
  onPickupTimeChange?: (time: string) => void
  onDropoffTimeChange?: (time: string) => void
}

export default function Calendar({ 
  onDateSelect,
  pickupTime = '10:00',
  dropoffTime = '10:00',
  onPickupTimeChange,
  onDropoffTimeChange
}: CalendarProps) {
  const today = new Date()
  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Generate fake availability - only block a few specific days
  const isAvailable = (date: Date): boolean => {
    // Only block a few specific days (much less than before)
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000
    )
    // Block only about 5% of dates (every 20th day)
    return dayOfYear % 20 !== 0
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
    <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 w-full max-w-[400px] mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
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

      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
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
                h-8 rounded-lg text-xs font-medium transition-colors
                ${!available || isPast
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : selected || inRange
                  ? 'bg-turquoise text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }
              `}
              whileHover={available && !isPast ? { scale: 1.05 } : {}}
            >
              {date.getDate()}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-3 flex gap-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span className="text-xs text-gray-600">{t('vehicle.calendar.booked')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-turquoise rounded"></div>
          <span className="text-xs text-gray-600">{t('vehicle.calendar.selected')}</span>
        </div>
      </div>

      {/* Time Selection */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TimePicker
            value={pickupTime}
            onChange={(time) => onPickupTimeChange?.(time)}
            label={t('vehicle.times.pickup')}
          />
          <TimePicker
            value={dropoffTime}
            onChange={(time) => onDropoffTimeChange?.(time)}
            label={t('vehicle.times.dropoff')}
          />
        </div>
      </div>
    </div>
  )
}


