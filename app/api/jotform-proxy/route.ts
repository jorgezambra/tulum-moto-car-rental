import { NextRequest, NextResponse } from 'next/server'

// Jotform field IDs - mapped to the specific form 253348400909054
// These correspond to the element IDs you shared:
// Name            -> #first_16 / #last_16       => field ID 16
// WhatsApp Number -> #input_4_full              => field ID 4
// Email           -> #input_6                   => field ID 6
// Start Date      -> #month_7 / #day_7 / ...    => field ID 7
// End Date        -> #month_8 / #day_8 / ...    => field ID 8
// Extras          -> #input_15                  => field ID 15
// Vehicle         -> #input_9                   => field ID 9
// Total Price     -> #input_10                  => field ID 10
// Quantity        -> #input_11                  => field ID 11
// Pickup Time     -> #input_12_timeInput / ampm => field ID 12
// Drop Off Time   -> #input_13_timeInput / ampm => field ID 13
// Summary         -> #input_14                  => field ID 14
const FIELD_NAME_ID = '16'
const FIELD_PHONE_ID = '4'
const FIELD_EMAIL_ID = '6'
const FIELD_START_DATE_ID = '7'
const FIELD_END_DATE_ID = '8'
const FIELD_VEHICLE_ID = '9'
const FIELD_EXTRAS_ID = '15'
const FIELD_TOTAL_PRICE_ID = '10'
const FIELD_QUANTITY_ID = '11'
const FIELD_PICKUP_TIME_ID = '12'
const FIELD_DROPOFF_TIME_ID = '13'
const FIELD_SUMMARY_ID = '14'

interface BookingData {
  name: string
  phone: string
  email: string
  startDate: string
  endDate: string
  vehicle: string
  extras: string
  totalPrice: string
  quantity?: number
  pickupTime?: string
  dropoffTime?: string
  summary?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json()

    const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY
    const JOTFORM_FORM_ID = process.env.JOTFORM_FORM_ID

    if (!JOTFORM_API_KEY || !JOTFORM_FORM_ID) {
      console.error('Missing Jotform credentials')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Helper: split full name into first/last for Jotform's Name field
    const fullName = data.name || ''
    const [firstName, ...restName] = fullName.trim().split(' ')
    const lastName = restName.join(' ')

    // Helper: parse "HH:MM" (24h) into hour / minute for Jotform Time fields (24-hour format)
    const parseTime = (time?: string) => {
      if (!time) return null
      const [hStr, mStr] = time.split(':')
      const hNum = Number(hStr)
      if (Number.isNaN(hNum)) return null
      const hour = String(hNum).padStart(2, '0') // 24-hour format (0-23)
      const minute = (mStr ?? '00').padStart(2, '0')
      return { hour, minute }
    }

    const pickupParsed = parseTime(data.pickupTime)
    const dropoffParsed = parseTime(data.dropoffTime)

    // Helper: parse ISO date string into month/day/year for Jotform Date fields
    const parseDate = (iso?: string) => {
      if (!iso) return null
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return null
      return {
        month: String(d.getMonth() + 1),
        day: String(d.getDate()),
        year: String(d.getFullYear()),
      }
    }

    const startParsed = parseDate(data.startDate)
    const endParsed = parseDate(data.endDate)

    // Build the submission data with Jotform field format
    const submissionData = new URLSearchParams()

    // Name (Full Name element expects subfields)
    submissionData.append(`submission[${FIELD_NAME_ID}][first]`, firstName || '')
    submissionData.append(`submission[${FIELD_NAME_ID}][last]`, lastName || '')

    // WhatsApp / phone (Full Phone field expects [full] subfield), email
    if (data.phone) {
      submissionData.append(`submission[${FIELD_PHONE_ID}][full]`, data.phone)
    }
    submissionData.append(`submission[${FIELD_EMAIL_ID}]`, data.email || '')

    // Start / End Date as separate subfields (date only)
    if (startParsed) {
      submissionData.append(`submission[${FIELD_START_DATE_ID}][month]`, startParsed.month)
      submissionData.append(`submission[${FIELD_START_DATE_ID}][day]`, startParsed.day)
      submissionData.append(`submission[${FIELD_START_DATE_ID}][year]`, startParsed.year)
    }
    if (endParsed) {
      submissionData.append(`submission[${FIELD_END_DATE_ID}][month]`, endParsed.month)
      submissionData.append(`submission[${FIELD_END_DATE_ID}][day]`, endParsed.day)
      submissionData.append(`submission[${FIELD_END_DATE_ID}][year]`, endParsed.year)
    }
    submissionData.append(`submission[${FIELD_VEHICLE_ID}]`, data.vehicle || '')
    submissionData.append(`submission[${FIELD_EXTRAS_ID}]`, data.extras || '')
    submissionData.append(`submission[${FIELD_TOTAL_PRICE_ID}]`, data.totalPrice || '')
    
    if (data.quantity !== undefined) {
      submissionData.append(`submission[${FIELD_QUANTITY_ID}]`, String(data.quantity))
    }
    if (pickupParsed) {
      // Based on HTML inspection: name="q12_pickupTime[timeInput]" with data-mask="HH:MM" (no spaces)
      // The actual input uses timeInput, hourSelect, and minuteSelect subfields
      const pickupTimeValue = `${pickupParsed.hour}:${pickupParsed.minute}` // e.g. "10:00", "15:30" (no spaces, matches data-mask)
      
      // Primary: send to timeInput subfield (matches name="q12_pickupTime[timeInput]")
      // Format: HH:MM (no spaces) to match data-mask="HH:MM"
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}][timeInput]`, pickupTimeValue)
      
      // Also send hourSelect and minuteSelect (matches hidden fields in HTML)
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}][hourSelect]`, pickupParsed.hour)
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}][minuteSelect]`, pickupParsed.minute)
      
      // Also send to main field and other formats for compatibility
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}]`, pickupTimeValue)
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}][hour]`, pickupParsed.hour)
      submissionData.append(`submission[${FIELD_PICKUP_TIME_ID}][minute]`, pickupParsed.minute)
    }
    if (dropoffParsed) {
      const dropoffTimeValue = `${dropoffParsed.hour}:${dropoffParsed.minute}`
      
      // Primary: send to timeInput subfield (matches name="q13_dropOffTime[timeInput]")
      // Format: HH:MM (no spaces) to match data-mask="HH:MM"
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}][timeInput]`, dropoffTimeValue)
      
      // Also send hourSelect and minuteSelect (matches hidden fields in HTML)
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}][hourSelect]`, dropoffParsed.hour)
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}][minuteSelect]`, dropoffParsed.minute)
      
      // Also send to main field and other formats for compatibility
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}]`, dropoffTimeValue)
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}][hour]`, dropoffParsed.hour)
      submissionData.append(`submission[${FIELD_DROPOFF_TIME_ID}][minute]`, dropoffParsed.minute)
    }
    if (data.summary) {
      submissionData.append(`submission[${FIELD_SUMMARY_ID}]`, data.summary)
    }

    const jotformUrl = `https://api.jotform.com/form/${JOTFORM_FORM_ID}/submissions?apiKey=${JOTFORM_API_KEY}`

    // Log submission success (excluding sensitive data)
    console.log('Submitting to Jotform...')

    const response = await fetch(jotformUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: submissionData.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jotform API error:', response.status, errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to submit to Jotform' },
        { status: 500 }
      )
    }

    const result = await response.json()
    console.log('Jotform submission successful:', result)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in jotform-proxy:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

