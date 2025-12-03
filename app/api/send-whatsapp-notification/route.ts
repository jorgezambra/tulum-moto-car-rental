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

    // Helper to format phone for Green API
    const formatForGreenApi = (phone: string) => {
      // Remove all non-numeric characters first, then append suffix
      return phone.replace(/[^0-9]/g, '') + '@c.us'
    }

    // 1. Prepare Owner Message
    const ownerMessage = `🚗 *New Booking Request*

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

    // 2. Prepare Customer Message
    const customerMessage = `👋 *Reservation Request Received*

Hello ${data.name},

Thank you for choosing Tulum OnWheels! We have received your reservation request and will confirm it shortly.

*Your Request Details:*
Vehicle: ${data.vehicle}
Rental Period: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}
Total: ${data.totalPrice}

You will receive a secure payment link via email once your reservation is confirmed.

If you have any questions, feel free to reply to this message.`

    // 3. Format Phone Numbers
    const ownerPhone = formatForGreenApi(BUSINESS_OWNER_WHATSAPP)
    const customerPhone = formatForGreenApi(data.phone)
    
    const greenApiUrl = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}/sendMessage/${GREEN_API_TOKEN}`

    // 4. Send to Owner
    console.log('Sending notification to owner:', ownerPhone)
    const ownerResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: ownerPhone,
        message: ownerMessage,
      }),
    })

    // 5. Send to Customer
    console.log('Sending confirmation to customer:', customerPhone)
    const customerResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: customerPhone,
        message: customerMessage,
      }),
    })

    // Log results (we consider success if at least owner gets it, or just return true if handled)
    // We'll return details about both for debugging
    const ownerResult = await ownerResponse.json().catch(e => ({ error: 'JSON parse error', details: e }))
    const customerResult = await customerResponse.json().catch(e => ({ error: 'JSON parse error', details: e }))

    if (!ownerResponse.ok) {
      console.error('Failed to send to owner:', ownerResult)
    } else {
      console.log('Owner notification sent:', ownerResult)
    }

    if (!customerResponse.ok) {
      console.error('Failed to send to customer:', customerResult)
    } else {
      console.log('Customer notification sent:', customerResult)
    }

    // Return success if at least one worked, or just strictly success
    // Since this is a background notification, we generally return success unless everything failed catastrophically
    return NextResponse.json({ 
      success: true, 
      results: {
        owner: { status: ownerResponse.status, data: ownerResult },
        customer: { status: customerResponse.status, data: customerResult }
      }
    })
  } catch (error) {
    console.error('Error in send-whatsapp-notification:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

