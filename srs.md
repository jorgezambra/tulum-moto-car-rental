# System Requirements Specification for Tulum Rentals Website

## Functional Requirements
- User can browse home, rentals, detail, contact pages.
- Vehicle carousels: Swipe/scroll, 5 scooters (e.g., Basic Scooter 1-5, 400-600 MXN/day), 5 cars (e.g., Basic Sedan 1-5, 800-1200 MXN/day).
- Calendar: Date range selection, fake availability (e.g., block random days).
- Booking: Form for name, dates, delivery address (use Google Maps pin for fee calc – e.g., +100 MXN if >5km).
- Payment: Mercado Pago button (mock success message), or WhatsApp redirect.
- Currency: Toggle updates all prices (fetch rate API or hard-code).
- Maps: Embed business location, calculate delivery distance.
- Animations: Framer Motion for entries, hovers.
- Forms: Contact form (mock send), newsletter (mock subscribe).

## Non-Functional Requirements
- Performance: Load <2s, smooth on mobile.
- Security: Basic (no real data yet); add HTTPS later.
- Accessibility: Alt text on images, keyboard nav.
- Browser Support: Chrome, Safari, Firefox (latest).
- Hosting: Vercel ready.

## Data Sources
- Vehicles: Hard-coded array.
- Photos: Stock URLs from Unsplash (e.g., unsplash.com/photos/scooter-tulum).
- Reviews: Hard-coded.
- Exchange Rate: API call on load.

## Testing
- Test flows: Browse > Detail > Book > Pay/WhatsApp.
- Mobile responsiveness.
- Animations without lag.