import { Flight, Scraper, ScraperResult, SearchQuery } from "../types";

export abstract class BaseScraper implements Scraper {
  abstract name: string;

  abstract scrape(query: SearchQuery): Promise<ScraperResult>;

  protected generateId(flightNumber: string, date: string): string {
    return `${this.name}-${flightNumber}-${date}`;
  }
}
