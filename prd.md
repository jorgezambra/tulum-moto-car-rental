# Product Requirements Document for Tulum Scooter and Vehicle Rental Website

## Overview
- **Product Name**: Tulum Rentals (placeholder—replace with real business name from Google Maps)
- **Description**: A fun, interactive website for renting basic scooters and cars in Tulum, Mexico. Aimed at tourists seeking adventure with easy booking, payment, and delivery options. Vibes: Beachy, vibrant, Tulum-inspired (turquoise, orange, green accents, palm motifs).
- **Target Audience**: Tourists (20-40 years old, adventure seekers, families), mostly mobile users, international (support MXN/USD toggle).
- **Main Goal**: Allow users to browse rentals, check availability, book/pay online, or contact via WhatsApp. Drive bookings while showcasing location and reviews for trust.

## Key Features
- **Home Page**: Hero slider with 2 images (scooter on beach, car on road). Text: "Zip Through Tulum – Rent Scooters & Cars Easily!" CTA: "Browse Rentals".
- **Rentals Section**: Two carousels – one for 5 scooters, one for 5 cars. Each card: Photo, model (e.g., "Basic Scooter 125cc"), price (e.g., 500 MXN/day), "View Details" button.
- **Detail Page/Modal**: For each vehicle – Gallery (4 photos), calendar for availability (fake data for now, green/open, red/booked), date picker, delivery toggle (adds fee based on map distance), "Book Now" button.
- **Booking Flow**: Guest checkout (no accounts). Options: Pay with Mercado Pago (mock integration for now, use their Checkout Bricks API – add real API key later), or "Message on WhatsApp" (pre-filled chat: "Hi, I'd like to rent [vehicle] from [date]").
- **Payment**: Integrate Mercado Pago for local payments (cards, OXXO cash, wallets). Mock for prototype; handle pesos. Toggle MXN/USD with live exchange rate from exchangeratesapi.io (or hard-code 1 USD = 20 MXN).
- **Other Pages/Features**:
  - About: Business story, delivery info, operating hours (placeholder: 8AM-6PM).
  - Contact: Google Maps embed (use placeholder coord: 20.2114, -87.4654 or real from link), form, phone, sticky WhatsApp bubble.
  - Testimonials: 5 fake reviews (e.g., "Great service! 5 stars") – replace with real from Maps.
  - Newsletter popup: "10% off first rental – enter email".
  - Blog (optional): SEO posts like "Top Tulum Spots by Scooter".
- **Currency Toggle**: Site-wide switch (MXN/USD), updates prices dynamically.
- **SEO**: Keywords like "scooter rental Tulum", "car hire Tulum Mexico". Use Next.js for fast loading/SEO.
- **Legal**: Terms page with disclaimers (e.g., min age 21, insurance).

## Design & UX
- **Tone**: Fun, interactive, adventurous. Animations: Parallax backgrounds, zoom on hover, smooth scrolls.
- **Colors**: Turquoise (#40E0D0), sunset orange (#FF4500), palm green (#228B22).
- **Fonts**: Upbeat sans-serif (e.g., Poppins).
- **Mobile-First**: Responsive, easy thumb navigation.
- **Animations**: Subtle – vehicles "drive in" on scroll.

## Tech Stack
- Framework: Next.js (for SEO, speed).
- Styling: Tailwind CSS.
- Animations: Framer Motion.
- Other: React for interactivity, Google Maps API for embed/location, Mercado Pago SDK, WhatsApp API for chat links, exchangeratesapi.io for rates.
- No backend yet (use fake data); add later for real inventory sync.

## Success Metrics
- Easy booking in <1 min.
- High mobile conversion.
- SEO ranking for Tulum rentals.

## Assumptions
- Placeholder data for vehicles, photos (use Unsplash stock: beach scooters/cars), reviews.
- No real payment/inventory yet – prototype only.