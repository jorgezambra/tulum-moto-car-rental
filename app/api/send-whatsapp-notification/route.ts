import { NextRequest, NextResponse } from 'next/server'

// Same BookingData interface as JotForm endpoint
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

    const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID
    const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN
    const BUSINESS_OWNER_WHATSAPP = process.env.BUSINESS_OWNER_WHATSAPP

    if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN || !BUSINESS_OWNER_WHATSAPP) {
      console.error('Missing Green API credentials')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Format the WhatsApp message
    const formatDate = (isoString: string) => {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }

    const message = `🚗 *New Booking Request*

*Customer Details:*
Name: ${data.name}
WhatsApp: ${data.phone}
Email: ${data.email}

*Booking Details:*
Vehicle: ${data.vehicle}
Quantity: ${data.quantity || 1}
Rental Period: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}
Pickup Time: ${data.pickupTime || 'Not specified'}
Dropoff Time: ${data.dropoffTime || 'Not specified'}

*Extras:*
${data.extras || 'None'}

*Pricing:*
Total: ${data.totalPrice}

*Full Summary:*
${data.summary || 'No summary provided'}`

    // Format phone number (remove + if present, ensure it ends with @c.us)
    const phoneNumber = BUSINESS_OWNER_WHATSAPP.replace(/^\+/, '').replace(/@c\.us$/, '') + '@c.us'

    // Green API endpoint
    const greenApiUrl = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}/sendMessage/${GREEN_API_TOKEN}`

    console.log('Sending WhatsApp notification to:', phoneNumber)

    const response = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: phoneNumber,
        message: message,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Green API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        phoneNumber: phoneNumber,
        url: greenApiUrl.replace(GREEN_API_TOKEN, '***'),
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send WhatsApp notification',
          details: errorText 
        },
        { status: 500 }
      )
    }

    const result = await response.json()
    console.log('WhatsApp notification sent successfully:', {
      result,
      phoneNumber: phoneNumber,
      messageLength: message.length,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in send-whatsapp-notification:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

