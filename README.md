# ✈️ PointsFly Flight Scraper

A real-time flight fare comparison tool that scrapes live flight data from Google Flights, supporting multiple airlines worldwide with automatic points price estimation.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.56-green?logo=playwright)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

🔗 **[View Live Application](https://your-deployment-url.vercel.app)** *(Replace with your actual Vercel URL)*

---

## 📋 Table of Contents

- [Features](#-features)
- [How to Run Locally](#-how-to-run-locally)
- [Airlines Scraped](#-airlines-scraped)
- [Points Conversion Logic](#-points-conversion-logic)
- [Blockers & Solutions](#-blockers--solutions)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)


---

## ✨ Features

- ✅ **Real-Time Flight Scraping** - Scrapes live data from Google Flights using headless browser automation
- ✅ **Multi-Airline Support** - Supports 100+ airlines worldwide (Indian, International, Budget, Premium)
- ✅ **Complete Flight Details** - Airline name, flight number, departure/arrival times, duration, price
- ✅ **Points Price Estimation** - Automatic calculation for airlines with loyalty programsm
- ✅ **Smart Sorting** - Results sorted by price (normalized across currencies)
- ✅ **Graceful Fallback** - Mock data if scraping fails
- ✅ **Modern UI** - Dark theme, glassmorphism, responsive design


---

## 🏃 How to Run Locally

### Prerequisites

- **Node.js** 18+ and npm
- **Git**

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/ashuguptajsx/pointsfly-scraper.git
cd pointsfly-scraper

# 2. Install dependencies
npm install

# 3. Install Playwright Chromium browser
npx playwright install chromium

# 4. Run the development server
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Test the Scraper

1. Enter search details:
   - **From**: DEL (Delhi)
   - **To**: BOM (Mumbai)
   - **Date**: Any future date (e.g., 2025-12-01)

2. Click **Search Flights**

3. Watch the terminal for scraping logs:
   ```
   [GoogleFlights] Starting scrape for DEL → BOM on 2025-12-01
   [GoogleFlights] ✓ IndiGo 6E-2134 | 6:00 AM → 8:15 AM | INR 4,250
   [GoogleFlights] ✓ Air India AI-865 | 9:30 AM → 11:45 AM | INR 5,800
   [GoogleFlights] ✓ Emirates EK-501 | 2:15 PM → 4:30 PM | INR 12,500
   ```

4. View results in the UI (sorted by price)

---

## 🛫 Airlines Scraped

The scraper uses **Google Flights** as an aggregator, which provides access to 100+ airlines worldwide. The scraper intelligently detects and extracts data for:

### Indian Airlines (Domestic)
- **IndiGo** (6E) - India's largest low-cost carrier
- **Air India** (AI) - National carrier with loyalty program
- **Vistara** (UK) - Premium full-service carrier
- **SpiceJet** (SG) - Low-cost carrier
- **Go First** (G8) - Budget airline


---

## 💎 Points Conversion Logic

### Estimation Formula

For airlines with loyalty programs, points prices are estimated using:

```
Points Price = (Cash Price × Currency Rate × 100)
```

Where:
- **Cash Price** = Price in local currency
- **Currency Rate** = Conversion rate to USD (base currency)
- **100** = Multiplier to convert to points (10% of USD value × 100)



### Assumptions & Limitations

⚠️ **Important Notes**:

1. **Simplified Estimate**: This is a rough approximation. Actual redemption values vary by:
   - Route distance
   - Cabin class
   - Availability
   - Seasonal demand
   - Airline-specific award charts

2. **Real-World Variance**: Actual points required can be 50-200% different from estimates

3. **No API Integration**: This tool does NOT connect to actual airline loyalty APIs

4. **Educational Purpose**: Use for comparison only, not booking decisions

---

## 🚧 Blockers & Solutions

### 1. Direct Airline Website Scraping

**Blocker**:
- Heavy anti-bot protection (Cloudflare, reCAPTCHA)
- Rate limiting and IP blocking
- Dynamic JavaScript rendering
- Session-based authentication

**Solution**:
✅ **Switched to Google Flights as aggregator**
- Single source for multiple airlines
- More stable DOM structure
- Better anti-detection tolerance
- Faster scraping (one page vs. multiple sites)

---

### 2. CSS Selector Fragility

**Blocker**:
- Minified class names change frequently (e.g., `.gws-flights-results__result-item-0-1-2`)
- Build-time obfuscation
- A/B testing variations

**Solution**:
✅ **Text-based pattern matching**
```typescript
// Instead of: page.locator('.flight-price-xyz')
// We use: text.match(/₹\s*([\d,]+)/)

const airlineInfo = this.detectAirline(text); // Regex patterns
const priceInfo = this.detectCurrency(text);  // Currency symbols
```

This approach is **resilient to DOM changes** and works across Google Flights UI updates.

---

### 3. Headless Browser Detection

**Blocker**:
- Google detects headless browsers via:
  - `navigator.webdriver` flag
  - Missing browser plugins
  - Automation-specific headers

**Solution**:
✅ **Stealth configuration**
```typescript
const browser = await chromium.launch({
  headless: true,
  args: ['--disable-blink-features=AutomationControlled']
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US'
});
```

---

### 5. Slow Scraping Performance

**Blocker**:
- Initial implementation took 8-10 seconds per search
- Timeout issues on Vercel (10s function limit)

**Solution**:
✅ **Optimizations applied**:
- Reduced wait time: 5s → 3s
- Parallel element processing
- Early termination when target flight count reached
- Removed unnecessary screenshots/debugging

**Result**: Average scrape time reduced to **3-5 seconds**

---

### 6. Duplicate Flight Results

**Blocker**:
- Same flight appearing multiple times with slight variations
- Different DOM elements containing same flight data

**Solution**:
✅ **Deduplication logic**
```typescript
const flightSignature = `${airline}-${price}-${departureTime}`;
if (!seenFlights.has(flightSignature)) {
  seenFlights.add(flightSignature);
  flights.push(flight);
}
```

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Backend/Scraping
- **Playwright 1.56** - Headless browser automation
- **Playwright-core** - Lightweight Playwright for production
- **@sparticuz/chromium** - Serverless-optimized Chromium
- **Cheerio** - HTML parsing (backup)
- **date-fns** - Date manipulation

---

## 📁 Project Structure

```
pointsfly-scraper/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API endpoint for flight search
│   ├── favicon.ico               # App icon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI page
├── components/
│   ├── FlightCard.tsx            # Individual flight result card
│   └── SearchForm.tsx            # Search input form
├── lib/
│   ├── scrapers/
│   │   ├── base.ts               # Abstract scraper class
│   │   ├── google.ts             # Google Flights scraper (MAIN)
│   │   └── mock.ts               # Fallback mock data
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── .gitignore                    # Git ignore rules
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # This file
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

### Key Files Explained

#### `lib/scrapers/google.ts` (Main Scraper)
- 350 lines of scraping logic
- Supports 100+ airlines via pattern matching
- Handles 30+ currencies
- Calculates points prices
- Serverless-compatible

#### `app/api/search/route.ts` (API Endpoint)
- POST endpoint: `/api/search`
- Accepts: `{ from, to, date }`
- Returns: `{ flights: Flight[] }`

#### `components/FlightCard.tsx` (UI Component)
- Displays flight details
- Shows points badge for eligible airlines
- Responsive design

---

## 🔍 How It Works

### 1. User Searches for Flights

User enters:
- **Origin**: DEL (Delhi)
- **Destination**: BOM (Mumbai)
- **Date**: 2025-12-01

### 2. Frontend Sends Request

```typescript
const response = await fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({ from: 'DEL', to: 'BOM', date: '2025-12-01' })
});
```

### 3. Backend Initiates Scraping

```typescript
// app/api/search/route.ts
const scraper = new GoogleFlightsScraper();
const result = await scraper.scrape(query);
```

### 4. Playwright Opens Google Flights

```typescript
const searchUrl = `https://www.google.com/travel/flights?q=Flights%20to%20BOM%20from%20DEL%20on%202025-12-01`;
await page.goto(searchUrl);
```

### 5. Scraper Extracts Flight Data

```typescript
// Find all potential flight containers
const allElements = await page.locator('li, div[role="listitem"]').all();

for (const element of allElements) {
  const text = await element.innerText();
  
  // Detect airline (e.g., "IndiGo 6E-2134")
  const airlineInfo = this.detectAirline(text);
  
  // Detect price (e.g., "₹4,250")
  const priceInfo = this.detectCurrency(text);
  
  // Extract times (e.g., "6:00 AM – 8:15 AM")
  const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/);
  
  // Extract duration (e.g., "2h 15m")
  const durationMatch = text.match(/(\d+\s*h(?:r)?(?:\s*\d+\s*m(?:in)?)?)/i);
  
  flights.push({
    airline: airlineInfo.airline,
    flightNumber: this.extractFlightNumber(text, airlineInfo.code),
    departureTime: timeMatch[1],
    arrivalTime: timeMatch[2],
    duration: durationMatch[0],
    price: priceInfo.price,
    currency: priceInfo.currency,
    pointsPrice: this.calculatePointsPrice(priceInfo.price, priceInfo.currency, airlineInfo.airline)
  });
}
```

### 6. Results Sorted & Returned

```typescript
// Sort by normalized price (USD equivalent)
flights.sort((a, b) => {
  const priceA = a.price * conversionRates[a.currency];
  const priceB = b.price * conversionRates[b.currency];
  return priceA - priceB;
});

return { flights: flights.slice(0, 15) };
```

### 7. Frontend Displays Results

```tsx
{flights.map(flight => (
  <FlightCard key={flight.id} flight={flight} />
))}
```


### Build Locally

```bash
npm run build
npm run start
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Search DEL → BOM (domestic route)
- [ ] Search DEL → DXB (international route)
- [ ] Verify at least 3 flights returned
- [ ] Check price sorting (lowest first)
- [ ] Verify points shown for Air India/Emirates
- [ ] Test with future dates
- [ ] Check responsive design (mobile/desktop)
- [ ] Verify no browser popup (headless mode)

### Console Logs

Watch terminal for scraping progress:
```
[GoogleFlights] Starting scrape for DEL → BOM on 2025-12-01
[GoogleFlights] URL: https://www.google.com/travel/flights?q=...
[GoogleFlights] Waiting for flight data to load...
[GoogleFlights] Found 47 potential flight containers
[GoogleFlights] ✓ IndiGo 6E-2134 | 6:00 AM → 8:15 AM | INR 4,250
[GoogleFlights] ✓ Air India AI-865 | 9:30 AM → 11:45 AM | INR 5,800
[GoogleFlights] ✓ SpiceJet SG-8194 | 11:00 AM → 1:15 PM | INR 4,500
[GoogleFlights] ==========================================
[GoogleFlights] EXTRACTION COMPLETE
[GoogleFlights] Total flights: 12
[GoogleFlights] Airlines: IndiGo, Air India, SpiceJet, Vistara
[GoogleFlights] ==========================================
```

---

## 🎨 UI Highlights

- **Dark Theme** - Modern dark mode with glassmorphism effects
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Smooth Animations** - Framer Motion for card hover effects
- **Points Badge** - Green badge for flights with points pricing
- **Loading States** - Skeleton loaders during search
- **Error Handling** - Graceful fallback to mock data

