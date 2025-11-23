export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string; // ISO string or time string like "10:30 AM"
  arrivalTime: string; // ISO string or time string like "12:30 PM"
  duration: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  pointsPrice?: number; // Changed from points to pointsPrice
  isMock?: boolean;
}

export interface SearchQuery {
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
}

export interface ScraperResult {
  flights: Flight[];
  error?: string;
}

export interface Scraper {
  scrape(query: SearchQuery): Promise<ScraperResult>;
}
