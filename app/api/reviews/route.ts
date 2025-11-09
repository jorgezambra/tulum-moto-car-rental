import { NextResponse } from 'next/server'

/**
 * API route to fetch Google Places reviews
 * Requires: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY in environment
 */

// Place ID extracted from the Google Maps URL
// Format: place_id from the URL (you may need to find the actual Place ID)
const PLACE_ID = 'ChIJ...' // Replace with actual Place ID from Google Maps

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Using coordinates from the URL: 20.1921167,-87.4700105
    // First, find place_id using coordinates
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Renta%20de%20Autos%20Y%20Motos%20Tulum&inputtype=textquery&locationbias=circle:2000@20.1921167,-87.4700105&fields=place_id&key=${apiKey}`

    const searchResponse = await fetch(textSearchUrl)
    const searchData = await searchResponse.json()

    if (!searchData.candidates || searchData.candidates.length === 0) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }

    const placeId = searchData.candidates[0].place_id

    // Now get place details with reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`

    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (detailsData.result && detailsData.result.reviews) {
      return NextResponse.json({
        reviews: detailsData.result.reviews,
        placeName: detailsData.result.name,
        rating: detailsData.result.rating,
        totalRatings: detailsData.result.user_ratings_total,
      })
    }

    return NextResponse.json({ error: 'No reviews found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}


