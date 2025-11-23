"use client";

import { useState, useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";
import { FlightCard } from "@/components/FlightCard";
import { Flight, SearchQuery } from "@/lib/types";
import { Plane, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [heroText, setHeroText] = useState("");
  const fullText = "Find the best flight fares & rewards";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setHeroText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query: SearchQuery) => {
    setIsLoading(true);
    setError("");
    setFlights([]);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        from: query.from,
        to: query.to,
        date: query.date,
      });

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      if (res.ok) {
        setFlights(data.flights);
      } else {
        setError(data.error || "Failed to fetch flights");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 relative overflow-hidden selection:bg-neutral-700 selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] -z-10" />
      
      {/* Header */}
      <div className="border-b border-white/5 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-neutral-900 p-2 rounded-xl border border-white/10">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">PointsFly</h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Sparkles className="w-3 h-3 text-neutral-400" />
              <span>AI-Powered Scraper</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-12 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight min-h-[3rem]">
            {heroText}
            <span className="animate-pulse">|</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Real-time scraping across multiple airlines to find you the best deals and point estimates.
          </p>
        </div>

        {/* Search Form */}
        <div className="relative z-10">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-16 text-center backdrop-blur-sm">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-t-2 border-white/20 rounded-full animate-spin [animation-direction:reverse]"></div>
              </div>
              <p className="text-white font-medium text-lg">Searching for flights...</p>
              <p className="text-sm text-neutral-500 mt-2">Analyzing fares from multiple airlines</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 backdrop-blur-sm">
              <div className="bg-red-500/20 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-200 font-medium">Unable to fetch flights</p>
                <p className="text-red-400/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {searched && !isLoading && flights.length === 0 && !error && (
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-16 text-center backdrop-blur-sm">
              <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                <Plane className="w-10 h-10 text-neutral-500" />
              </div>
              <p className="text-white font-medium text-lg mb-2">No flights found</p>
              <p className="text-neutral-500">Try adjusting your dates or route</p>
            </div>
          )}

          {/* Results Header */}
          {flights.length > 0 && (
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="bg-white/10 text-white px-2 py-0.5 rounded text-sm border border-white/10">
                  {flights.length}
                </span>
                Flights Found
              </h2>
              <div className="text-sm text-neutral-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Sorted by price
              </div>
            </div>
          )}

          {/* Flight Cards */}
          <div className="grid gap-4">
            {flights.map((flight, idx) => (
              <div 
                key={flight.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <FlightCard flight={flight} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isLoading && (
        <div className="max-w-6xl mx-auto px-4 py-12 text-center relative z-10">
          <p className="text-sm text-neutral-600">
            Built with <span className="text-neutral-400">Next.js</span> & <span className="text-neutral-400">Playwright</span>
          </p>
        </div>
      )}
    </main>
  );
}
