# How to Import Google Maps Reviews

## Option 1: Manual Import (Quick)

1. Go to the Google Maps page: https://www.google.com/maps/place/Renta+de+Autos+Y+Motos+Tulum
2. Scroll down to the reviews section
3. Copy the following for each review:
   - Reviewer name
   - Rating (stars)
   - Review text
   - Date
4. Update `data/reviews.ts` with the real reviews

## Option 2: Using Google Places API

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Places API" 
4. Create credentials (API Key)
5. Restrict the API key to Places API only

### Step 2: Add API Key to Environment

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
```

### Step 3: Update Place ID

The Place ID from the URL is: `0x8f4fd707ba87f837:0x623d90e551e7e748`

However, Google Places API uses a different format. You'll need to:
1. Use [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) to get the correct Place ID
2. Or use the coordinates: `20.1921167,-87.4700105` with Places API

### Step 4: Use the API

The `utils/fetchGoogleReviews.ts` file has the code ready. You can create an API route or fetch on client side.

## Quick Manual Update

If you can copy-paste reviews, I can update the data file directly. Just provide:
- Name
- Rating (1-5)
- Comment text
- Date (if available)


