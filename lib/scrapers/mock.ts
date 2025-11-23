import { BaseScraper } from "./base";
import { ScraperResult, SearchQuery, Flight } from "@/lib/types";

export class MockScraper extends BaseScraper {
  name = "MockScraper";

  async scrape(query: SearchQuery): Promise<ScraperResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const flights: Flight[] = [
      {
        id: this.generateId("6E-2175", query.date),
        airline: "IndiGo",
        flightNumber: "6E-2175",
        departureTime: "06:00 AM",
        arrivalTime: "08:15 AM",
        duration: "2h 15m",
        origin: query.from,
        destination: query.to,
        price: 4250,
        currency: "INR",
        isMock: true,
      },
      {
        id: this.generateId("AI-631", query.date),
        airline: "Air India",
        flightNumber: "AI-631",
        departureTime: "09:30 AM",
        arrivalTime: "11:45 AM",
        duration: "2h 15m",
        origin: query.from,
        destination: query.to,
        price: 5800,
        currency: "INR",
        pointsPrice: 580, // 10% of cash price
        isMock: true,
      },
      {
        id: this.generateId("EK-501", query.date),
        airline: "Emirates",
        flightNumber: "EK-501",
        departureTime: "14:20 PM",
        arrivalTime: "16:50 PM",
        duration: "2h 30m",
        origin: query.from,
        destination: query.to,
        price: 12500,
        currency: "INR",
        pointsPrice: 1250, // 10% of cash price
        isMock: true,
      },
    ];

    return { flights };
  }
}
