# PointsFly Mini Flight Fare Scraper

A Next.js-based flight fare comparison tool that scrapes real-time flight data from Google Flights, supporting IndiGo, Air India, and Emirates with automatic points price estimation.

## 🚀 Features

- ✅ **Real-Time Flight Scraping** via Google Flights (headless Playwright)
- ✅ **Multi-Airline Support**: IndiGo, Air India, Emirates
- ✅ **All Required Fields**: Airline, Flight #, Times, Duration, Price, Points
- ✅ **Points Estimation**: Automatic calculation for Air India & Emirates (10% of cash price)
- ✅ **Sorted by Price**: Lowest fares first
- ✅ **Graceful Fallback**: Mock data if scraping fails
- ✅ **Modern UI**: Dark theme, responsive, Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Scraping**: Playwright (headless browser automation)
- **Language**: TypeScript

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pointsfly-scraper

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🔍 How It Works

### Scraping Strategy

1. **Primary Source**: Google Flights
   - Uses Playwright to navigate Google Flights in headless mode
   - Searches for flights based on user input (origin, destination, date)
   - Extracts data using text-based matching (robust against DOM changes)
   
2. **Anti-Detection Measures**:
   - Realistic user agent
   - Disabled automation flags
   - Network idle waiting

3. **Fallback Mechanism**:
   - If no flights found → Returns mock data
   - Ensures UI always functions

### Airlines Scraped

Through Google Flights aggregation:
- **IndiGo** (6E) - Indian
- **Air India** (AI) - Indian  
- **Emirates** (EK) - Foreign

### Points Conversion Logic

**Assumption**: `Points Price = 10% of Cash Price`

Applied to:
- Air India flights
- Emirates flights

Example:
- ₹5,800 cash → 580 points
- ₹12,500 cash → 1,250 points

*Note: This is a simplified estimate. Actual redemption values vary.*

## 🎯 Assignment Requirements

| Requirement | Status |
|------------|--------|
| 2 Indian Airlines | ✅ IndiGo, Air India |
| 1 Foreign Airline | ✅ Emirates |
| Airline Name | ✅ Displayed |
| Flight Number | ✅ Displayed |
| Departure/Arrival Times | ✅ Displayed |
| Duration | ✅ Displayed |
| Cash Price (INR) | ✅ Displayed |
| Points Price | ✅ Estimated for AI & EK |
| Sorted by Price | ✅ Lowest first |
| Points Highlighting | ✅ Green badge |
| Fallback Mechanism | ✅ Mock data |

## 🚧 Blockers Encountered

1. **Direct Airline Websites**:
   - **Problem**: Heavy anti-bot protection (CAPTCHAs, rate limiting)
   - **Solution**: Switched to Google Flights as aggregator

2. **Selector Fragility**:
   - **Problem**: Minified class names change frequently
   - **Solution**: Text-based matching (search for "IndiGo", "₹")

3. **Headless Detection**:
   - **Problem**: Google blocking headless browsers
   - **Solution**: Stealth settings (user agent, automation flag removal)

## 📁 Project Structure

```
pointsfly-scraper/
├── app/
│   ├── api/search/route.ts    # API endpoint
│   └── page.tsx                # Main UI
├── components/
│   ├── SearchForm.tsx          # Search input form
│   └── FlightCard.tsx          # Flight result card
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   └── scrapers/
│       ├── base.ts             # Abstract scraper class
│       ├── google.ts           # Google Flights scraper (REAL)
│       └── mock.ts             # Fallback data
└── README.md
```

## 🧪 Testing

### Manual Testing
1. Search: DEL → BOM
2. Date: Any future date
3. Verify:
   - No browser popup (headless)
   - Flight results displayed
   - Sorted by price
   - Points shown for Air India/Emirates

### Console Logs
Watch terminal for scraping progress:
```
[GoogleFlights] Starting headless scrape...
[GoogleFlights] Found 15 potential flight containers
[GoogleFlights] Extracted: IndiGo - ₹4,250
```

## 🎨 UI Highlights

- Dark theme with glassmorphism
- Responsive design (mobile/desktop)
- Points badge for reward flights
- Smooth hover animations

## 📝 Future Improvements

- [ ] Add more airlines
- [ ] Implement actual points API integration
- [ ] Add date range search
- [ ] Deploy to Vercel (requires Playwright buildpack)
- [ ] Add flight details modal

## 📄 License

MIT

---

**Built for PointsFly Mini Assignment** | [Live Demo](#) | [GitHub Repo](#)
