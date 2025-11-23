/**
 * Utility functions for scraping flight data
 */

/**
 * Parse a time string like "8:00 AM" or "20:30" into a standardized format
 */
export function parseTime(timeStr: string, date: string): string {
  try {
    // Remove extra whitespace
    timeStr = timeStr.trim();
    
    // Handle formats like "8:00 AM" or "8:00 PM"
    const amPmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (amPmMatch) {
      let hours = parseInt(amPmMatch[1]);
      const minutes = amPmMatch[2];
      const period = amPmMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${date}T${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
    
    // Handle 24-hour format like "20:30"
    const twentyFourMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (twentyFourMatch) {
      const hours = twentyFourMatch[1].padStart(2, '0');
      const minutes = twentyFourMatch[2];
      return `${date}T${hours}:${minutes}:00`;
    }
    
    // Fallback
    return `${date}T00:00:00`;
  } catch (e) {
    return `${date}T00:00:00`;
  }
}

/**
 * Parse duration string like "2h 30m" or "2 hr 30 min"
 */
export function parseDuration(durationStr: string): string {
  try {
    durationStr = durationStr.trim();
    
    // Match patterns like "2h 30m", "2 hr 30 min", "2h 30min"
    const hoursMatch = durationStr.match(/(\d+)\s*(?:h|hr|hour)/i);
    const minutesMatch = durationStr.match(/(\d+)\s*(?:m|min|minute)/i);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    if (hours === 0 && minutes === 0) {
      return "Unknown";
    }
    
    let result = "";
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += ` ${minutes}m`;
    
    return result.trim();
  } catch (e) {
    return "Unknown";
  }
}

/**
 * Parse price from various formats
 * Examples: "₹4,500", "4500", "$450", "4,500 INR"
 */
export function parsePrice(priceStr: string): number {
  try {
    // Remove all non-digit characters except decimal point
    const cleaned = priceStr.replace(/[^\d.]/g, '');
    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : Math.floor(price);
  } catch (e) {
    return 0;
  }
}

/**
 * Estimate reward points based on price
 * Typical conversion: 10% of price for most airlines
 */
export function estimatePoints(price: number, airline: string): number {
  // Different airlines have different point conversion rates
  const conversionRates: { [key: string]: number } = {
    'Emirates': 0.15, // 15% - premium airline
    'Qatar': 0.15,
    'Singapore Airlines': 0.15,
    'Air India': 0.10,
    'Vistara': 0.10,
    'IndiGo': 0.05, // Lower conversion for budget airlines
    'SpiceJet': 0.05,
  };
  
  // Default to 10% if airline not in map
  let rate = 0.10;
  
  for (const [airlineName, conversionRate] of Object.entries(conversionRates)) {
    if (airline.toLowerCase().includes(airlineName.toLowerCase())) {
      rate = conversionRate;
      break;
    }
  }
  
  return Math.floor(price * rate);
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError || new Error('Retry failed');
}

/**
 * Generate random user agent
 */
export function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  ];
  
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Generate random viewport size
 */
export function getRandomViewport(): { width: number; height: number } {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
  ];
  
  return viewports[Math.floor(Math.random() * viewports.length)];
}

/**
 * Add random delay to simulate human behavior
 */
export async function randomDelay(minMs: number = 500, maxMs: number = 1500): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Extract airline name from text
 */
export function extractAirline(text: string): string | null {
  const airlines = [
    'IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'AirAsia India',
    'Emirates', 'Qatar', 'Singapore Airlines', 'Etihad', 'Lufthansa',
    'British Airways', 'Thai Airways', 'Cathay Pacific'
  ];
  
  for (const airline of airlines) {
    if (text.includes(airline)) {
      return airline;
    }
  }
  
  return null;
}
