import { NextRequest, NextResponse } from "next/server";
import { SearchQuery, Flight } from "@/lib/types";
import { MockScraper } from "@/lib/scrapers/mock";
import { GoogleFlightsScraper } from "@/lib/scrapers/google";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (!from || !to || !date) {
    return NextResponse.json(
      { error: "Missing required parameters: from, to, date" },
      { status: 400 }
    );
  }

  const query: SearchQuery = { from, to, date };
  
  // Initialize scrapers
  // We use Google Flights as the primary aggregator to get real results for multiple airlines
  const googleScraper = new GoogleFlightsScraper();
  
  console.log("Starting live scrape via Google Flights...");
  const result = await googleScraper.scrape(query);
  
  let allFlights: Flight[] = result.flights;
  let errors: string[] = result.error ? [result.error] : [];

  console.log(`[API] Live scraping returned ${allFlights.length} flights`);

  // FALLBACK: Only use mock if we get ZERO flights (complete failure)
  if (allFlights.length === 0) {
    console.log("[API] ⚠️  Zero flights found. Using Mock Data as fallback.");
    const mockScraper = new MockScraper();
    const mockResult = await mockScraper.scrape(query);
    allFlights = mockResult.flights;
  } else {
    console.log(`[API] ✓ Returning ${allFlights.length} REAL flights`);
  }

  // Sort by price (lowest first)
  allFlights.sort((a, b) => a.price - b.price);

  return NextResponse.json({ flights: allFlights, errors });
}
