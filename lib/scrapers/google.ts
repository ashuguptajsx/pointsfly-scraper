import { BaseScraper } from "./base";
import { ScraperResult, SearchQuery, Flight } from "../types";
import { chromium } from "playwright-core";

// Currency symbols and patterns for worldwide support
const CURRENCY_PATTERNS = {
  USD: /\$\s*([\d,]+(?:\.\d{2})?)/,
  EUR: /€\s*([\d,]+(?:\.\d{2})?)/,
  GBP: /£\s*([\d,]+(?:\.\d{2})?)/,
  INR: /₹\s*([\d,]+)/,
  JPY: /¥\s*([\d,]+)/,
  CNY: /¥\s*([\d,]+)|CN¥\s*([\d,]+)/,
  AUD: /A\$\s*([\d,]+(?:\.\d{2})?)/,
  CAD: /C\$\s*([\d,]+(?:\.\d{2})?)|CA\$\s*([\d,]+(?:\.\d{2})?)/,
  SGD: /S\$\s*([\d,]+(?:\.\d{2})?)/,
  AED: /AED\s*([\d,]+)/,
  THB: /฿\s*([\d,]+)/,
  KRW: /₩\s*([\d,]+)/,
  MYR: /RM\s*([\d,]+)/,
  IDR: /Rp\s*([\d,]+)/,
  PHP: /₱\s*([\d,]+)/,
  VND: /₫\s*([\d,]+)/,
  NZD: /NZ\$\s*([\d,]+(?:\.\d{2})?)/,
  CHF: /CHF\s*([\d,]+(?:\.\d{2})?)/,
  SEK: /SEK\s*([\d,]+)/,
  NOK: /NOK\s*([\d,]+)/,
  DKK: /DKK\s*([\d,]+)/,
  PLN: /PLN\s*([\d,]+)/,
  ZAR: /R\s*([\d,]+)/,
  BRL: /R\$\s*([\d,]+)/,
  MXN: /MX\$\s*([\d,]+)/,
  TRY: /₺\s*([\d,]+)/,
  RUB: /₽\s*([\d,]+)/,
};

// Comprehensive airline patterns (IATA codes + names)
const AIRLINE_PATTERNS = [
  // Major international carriers
  { pattern: /Emirates|EK[\s-]*\d/i, name: "Emirates", code: "EK" },
  { pattern: /Qatar Airways|Qatar|QR[\s-]*\d/i, name: "Qatar Airways", code: "QR" },
  { pattern: /Singapore Airlines|SQ[\s-]*\d/i, name: "Singapore Airlines", code: "SQ" },
  { pattern: /British Airways|BA[\s-]*\d/i, name: "British Airways", code: "BA" },
  { pattern: /Lufthansa|LH[\s-]*\d/i, name: "Lufthansa", code: "LH" },
  { pattern: /Air France|AF[\s-]*\d/i, name: "Air France", code: "AF" },
  { pattern: /KLM|KL[\s-]*\d/i, name: "KLM", code: "KL" },
  { pattern: /Turkish Airlines|TK[\s-]*\d/i, name: "Turkish Airlines", code: "TK" },
  { pattern: /Etihad|EY[\s-]*\d/i, name: "Etihad", code: "EY" },
  { pattern: /Cathay Pacific|CX[\s-]*\d/i, name: "Cathay Pacific", code: "CX" },
  
  // US carriers
  { pattern: /American Airlines|AA[\s-]*\d/i, name: "American Airlines", code: "AA" },
  { pattern: /Delta|DL[\s-]*\d/i, name: "Delta", code: "DL" },
  { pattern: /United|UA[\s-]*\d/i, name: "United", code: "UA" },
  { pattern: /Southwest|WN[\s-]*\d/i, name: "Southwest", code: "WN" },
  { pattern: /JetBlue|B6[\s-]*\d/i, name: "JetBlue", code: "B6" },
  
  // Indian carriers
  { pattern: /IndiGo|6E[\s-]*\d/i, name: "IndiGo", code: "6E" },
  { pattern: /Air India|AI[\s-]*\d/i, name: "Air India", code: "AI" },
  { pattern: /Vistara|UK[\s-]*\d/i, name: "Vistara", code: "UK" },
  { pattern: /SpiceJet|SG[\s-]*\d/i, name: "SpiceJet", code: "SG" },
  { pattern: /Go First|GoAir|G8[\s-]*\d/i, name: "Go First", code: "G8" },
  
  // Asian carriers
  { pattern: /ANA|NH[\s-]*\d/i, name: "ANA", code: "NH" },
  { pattern: /Japan Airlines|JAL|JL[\s-]*\d/i, name: "Japan Airlines", code: "JL" },
  { pattern: /Korean Air|KE[\s-]*\d/i, name: "Korean Air", code: "KE" },
  { pattern: /Asiana|OZ[\s-]*\d/i, name: "Asiana", code: "OZ" },
  { pattern: /Thai Airways|TG[\s-]*\d/i, name: "Thai Airways", code: "TG" },
  { pattern: /Malaysia Airlines|MH[\s-]*\d/i, name: "Malaysia Airlines", code: "MH" },
  { pattern: /Garuda Indonesia|GA[\s-]*\d/i, name: "Garuda Indonesia", code: "GA" },
  { pattern: /Philippine Airlines|PR[\s-]*\d/i, name: "Philippine Airlines", code: "PR" },
  { pattern: /Vietnam Airlines|VN[\s-]*\d/i, name: "Vietnam Airlines", code: "VN" },
  { pattern: /China Eastern|MU[\s-]*\d/i, name: "China Eastern", code: "MU" },
  { pattern: /China Southern|CZ[\s-]*\d/i, name: "China Southern", code: "CZ" },
  { pattern: /Air China|CA[\s-]*\d/i, name: "Air China", code: "CA" },
  
  // European carriers
  { pattern: /Ryanair|FR[\s-]*\d/i, name: "Ryanair", code: "FR" },
  { pattern: /EasyJet|U2[\s-]*\d/i, name: "EasyJet", code: "U2" },
  { pattern: /Wizz Air|W6[\s-]*\d/i, name: "Wizz Air", code: "W6" },
  { pattern: /Norwegian|DY[\s-]*\d/i, name: "Norwegian", code: "DY" },
  { pattern: /Iberia|IB[\s-]*\d/i, name: "Iberia", code: "IB" },
  { pattern: /Alitalia|AZ[\s-]*\d/i, name: "Alitalia", code: "AZ" },
  { pattern: /Swiss|LX[\s-]*\d/i, name: "Swiss", code: "LX" },
  { pattern: /Austrian|OS[\s-]*\d/i, name: "Austrian", code: "OS" },
  { pattern: /Brussels Airlines|SN[\s-]*\d/i, name: "Brussels Airlines", code: "SN" },
  { pattern: /TAP Portugal|TP[\s-]*\d/i, name: "TAP Portugal", code: "TP" },
  { pattern: /Finnair|AY[\s-]*\d/i, name: "Finnair", code: "AY" },
  { pattern: /SAS|SK[\s-]*\d/i, name: "SAS", code: "SK" },
  { pattern: /Aeroflot|SU[\s-]*\d/i, name: "Aeroflot", code: "SU" },
  
  // Oceania carriers
  { pattern: /Qantas|QF[\s-]*\d/i, name: "Qantas", code: "QF" },
  { pattern: /Virgin Australia|VA[\s-]*\d/i, name: "Virgin Australia", code: "VA" },
  { pattern: /Air New Zealand|NZ[\s-]*\d/i, name: "Air New Zealand", code: "NZ" },
  
  // Middle East & Africa
  { pattern: /Saudi Arabian|SV[\s-]*\d/i, name: "Saudi Arabian", code: "SV" },
  { pattern: /Kuwait Airways|KU[\s-]*\d/i, name: "Kuwait Airways", code: "KU" },
  { pattern: /Oman Air|WY[\s-]*\d/i, name: "Oman Air", code: "WY" },
  { pattern: /Gulf Air|GF[\s-]*\d/i, name: "Gulf Air", code: "GF" },
  { pattern: /Ethiopian|ET[\s-]*\d/i, name: "Ethiopian", code: "ET" },
  { pattern: /Kenya Airways|KQ[\s-]*\d/i, name: "Kenya Airways", code: "KQ" },
  { pattern: /South African|SA[\s-]*\d/i, name: "South African", code: "SA" },
  { pattern: /EgyptAir|MS[\s-]*\d/i, name: "EgyptAir", code: "MS" },
  
  // Latin America
  { pattern: /LATAM|LA[\s-]*\d/i, name: "LATAM", code: "LA" },
  { pattern: /Aeromexico|AM[\s-]*\d/i, name: "Aeromexico", code: "AM" },
  { pattern: /Copa Airlines|CM[\s-]*\d/i, name: "Copa Airlines", code: "CM" },
  { pattern: /Avianca|AV[\s-]*\d/i, name: "Avianca", code: "AV" },
  { pattern: /Gol|G3[\s-]*\d/i, name: "Gol", code: "G3" },
  { pattern: /Azul|AD[\s-]*\d/i, name: "Azul", code: "AD" },
];

export class GoogleFlightsScraper extends BaseScraper {
  name = "GoogleFlightsScraper";

  // Detect currency from text
  private detectCurrency(text: string): { currency: string; price: number } | null {
    for (const [currency, pattern] of Object.entries(CURRENCY_PATTERNS)) {
      const match = text.match(pattern);
      if (match) {
        const priceStr = (match[1] || match[2] || "0").replace(/,/g, '');
        const price = parseFloat(priceStr);
        if (price > 0) {
          return { currency, price };
        }
      }
    }
    return null;
  }

  // Detect airline from text
  private detectAirline(text: string): { airline: string; code: string } | null {
    for (const { pattern, name, code } of AIRLINE_PATTERNS) {
      if (pattern.test(text)) {
        return { airline: name, code };
      }
    }
    return null;
  }

  // Extract flight number from text
  private extractFlightNumber(text: string, airlineCode: string): string {
    const pattern = new RegExp(`${airlineCode}[\\s-]*(\\d{2,4})`, 'i');
    const match = text.match(pattern);
    return match ? `${airlineCode}-${match[1]}` : "Multiple";
  }

  // Calculate points price (10% of cash price, normalized)
  private calculatePointsPrice(price: number, currency: string, airline: string): number | undefined {
    // Only calculate points for airlines with loyalty programs
    const loyaltyAirlines = [
      'air india', 'emirates', 'qatar', 'singapore airlines', 
      'british airways', 'lufthansa', 'air france', 'klm',
      'american airlines', 'delta', 'united', 'cathay pacific',
      'ana', 'japan airlines', 'korean air', 'thai airways',
      'qantas', 'etihad', 'turkish airlines'
    ];
    
    if (!loyaltyAirlines.some(la => airline.toLowerCase().includes(la))) {
      return undefined;
    }

    // Rough conversion rates to normalize points (using USD as base)
    const conversionRates: Record<string, number> = {
      USD: 1, EUR: 1.1, GBP: 1.27, INR: 0.012, JPY: 0.0067, CNY: 0.14,
      AUD: 0.65, CAD: 0.74, SGD: 0.74, AED: 0.27, THB: 0.028, KRW: 0.00075,
      MYR: 0.22, IDR: 0.000064, PHP: 0.018, VND: 0.000040, NZD: 0.60,
      CHF: 1.12, SEK: 0.096, NOK: 0.094, DKK: 0.15, PLN: 0.25, ZAR: 0.055,
      BRL: 0.20, MXN: 0.050, TRY: 0.029, RUB: 0.010
    };

    const rate = conversionRates[currency] || 0.012; // Default to INR rate
    const normalizedPrice = price * rate;
    return Math.round(normalizedPrice * 100); // Points = 10% of USD equivalent * 100
  }

  async scrape(query: SearchQuery): Promise<ScraperResult> {
    // Detect if we're running in a serverless environment (Vercel)
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    let browser;
    if (isServerless) {
      // Dynamic import for serverless chromium
      const chromiumPkg = await import('@sparticuz/chromium');
      browser = await chromium.launch({ 
        headless: true,
        executablePath: await chromiumPkg.default.executablePath(),
        args: [...chromiumPkg.default.args, '--disable-blink-features=AutomationControlled']
      });
    } else {
      // Local development
      browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
      });
    }
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
    });
    
    const page = await context.newPage();
    const flights: Flight[] = [];

    try {
      console.log(`[GoogleFlights] Starting scrape for ${query.from} → ${query.to} on ${query.date}`);
      
      const searchUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${query.to}%20from%20${query.from}%20on%20${query.date}&hl=en`;
      console.log(`[GoogleFlights] URL: ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Handle cookie consent
      try {
        const consentButton = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button:has-text("Reject all")').first();
        if (await consentButton.isVisible({ timeout: 2000 })) {
          console.log("[GoogleFlights] Handling consent...");
          await consentButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // No consent dialog
      }

      // Wait for results - reduced from 5s to 3s
      console.log("[GoogleFlights] Waiting for flight data to load...");
      await page.waitForTimeout(3000);

      // Get all text elements that might contain flight info
      // We'll look for elements containing currency OR airline codes
      const allElements = await page.locator('li, div[role="listitem"], div[class*="flight"], div[class*="result"]').all();
      console.log(`[GoogleFlights] Found ${allElements.length} potential flight containers`);

      const seenFlights = new Set<string>();
      const seenAirlines = new Set<string>();
      
      const maxFlights = 15;
      const hardLimit = 50; // Increased to scan more elements

      // Process elements
      for (let i = 0; i < allElements.length && flights.length < hardLimit; i++) {
        if (flights.length >= maxFlights) {
          console.log(`[GoogleFlights] Reached target: ${flights.length} flights`);
          break;
        }
        
        try {
          const element = allElements[i];
          let text = await element.innerText();
          
          // Skip if text is too short or too long
          if (text.length < 20 || text.length > 2000) continue;
          
          // Detect airline
          const airlineInfo = this.detectAirline(text);
          if (!airlineInfo) continue;
          
          // Detect currency and price
          const priceInfo = this.detectCurrency(text);
          if (!priceInfo) continue;
          
          const { airline, code } = airlineInfo;
          const { currency, price } = priceInfo;
          
          // Extract times
          const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/);
          const departureTime = timeMatch ? timeMatch[1] : "TBD";
          const arrivalTime = timeMatch ? timeMatch[2] : "TBD";
          
          // Extract duration
          const durationMatch = text.match(/(\d+\s*h(?:r)?(?:\s*\d+\s*m(?:in)?)?)/i);
          const duration = durationMatch ? durationMatch[0].trim() : "TBD";
          
          // Extract flight number
          const flightNumber = this.extractFlightNumber(text, code);
          
          // Validate price range (reasonable flight prices)
          if (price < 10 || price > 1000000) continue;
          
          const flightSignature = `${airline}-${price}-${departureTime}`;
          
          if (!seenFlights.has(flightSignature)) {
            seenFlights.add(flightSignature);
            seenAirlines.add(airline);
            
            const id = this.generateId(airline.replace(/\s/g, '') + "-" + price + "-" + Date.now(), query.date);
            
            const pointsPrice = this.calculatePointsPrice(price, currency, airline);

            flights.push({
              id,
              airline,
              flightNumber,
              departureTime,
              arrivalTime,
              duration,
              origin: query.from,
              destination: query.to,
              price,
              pointsPrice,
              currency,
              isMock: false,
            });
            
            console.log(`[GoogleFlights] ✓ ${airline} ${flightNumber} | ${departureTime} → ${arrivalTime} | ${currency} ${price.toLocaleString()}`);
          }
        } catch (err) {
          // Skip problematic elements
        }
      }

      await browser.close();

      // Sort by price
      flights.sort((a, b) => {
        // Normalize prices for comparison (convert to USD equivalent)
        const rates: Record<string, number> = {
          USD: 1, EUR: 1.1, GBP: 1.27, INR: 0.012, JPY: 0.0067, CNY: 0.14,
          AUD: 0.65, CAD: 0.74, SGD: 0.74, AED: 0.27, THB: 0.028, KRW: 0.00075,
        };
        const priceA = a.price * (rates[a.currency] || 1);
        const priceB = b.price * (rates[b.currency] || 1);
        return priceA - priceB;
      });

      // Trim to max flights
      const finalFlights = flights.slice(0, maxFlights);
      
      console.log(`[GoogleFlights] ==========================================`);
      console.log(`[GoogleFlights] EXTRACTION COMPLETE`);
      console.log(`[GoogleFlights] Total flights: ${finalFlights.length}`);
      console.log(`[GoogleFlights] Airlines: ${Array.from(seenAirlines).join(', ') || 'None'}`);
      console.log(`[GoogleFlights] ==========================================`);
      
      return { flights: finalFlights };

    } catch (error) {
      await browser.close();
      console.error("[GoogleFlights] ERROR:", error);
      return { flights: [], error: String(error) };
    }
  }
}
