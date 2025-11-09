/**
 * Fetch reviews from Google Places API
 * Requires: Google Places API key in environment variable NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
 */

const PLACE_ID = 'ChIJy1234567890' // Place ID from the Google Maps URL
const PLACE_NAME = 'Renta de Autos Y Motos Tulum'

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description?: string
}

export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    console.warn('Google Places API key not found. Using fallback reviews.')
    return []
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }

    const data = await response.json()

    if (data.result && data.result.reviews) {
      return data.result.reviews.map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time,
        profile_photo_url: review.profile_photo_url,
        relative_time_description: review.relative_time_description,
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return []
  }
}

/**
 * Convert Google Review format to our Review format
 */
export function convertGoogleReviewToReview(
  googleReview: GoogleReview,
  index: number
) {
  return {
    id: `google-review-${index}`,
    name: googleReview.author_name,
    rating: googleReview.rating,
    comment: googleReview.text,
    date: googleReview.relative_time_description || 'Recent',
    image: googleReview.profile_photo_url,
  }
}


