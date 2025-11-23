"use client";

import { useState } from "react";
import { SearchQuery } from "@/lib/types";
import { Search, Loader2, ArrowRight, Calendar, MapPin } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      onSearch({ from, to, date });
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/0 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      
      <form 
        onSubmit={handleSubmit} 
        className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-4 items-end relative z-10">
          
          {/* From Input */}
          <div className="space-y-2 group/input">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3 h-3 text-neutral-500" /> From
            </label>
            <div className="relative">
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:bg-black/60 focus:border-white/20 outline-none transition-all text-2xl font-bold text-white placeholder:text-neutral-700"
                placeholder="DEL"
                maxLength={3}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600 bg-white/5 px-2 py-1 rounded">
                AIRPORT
              </div>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="hidden md:flex items-center justify-center pb-6 px-2">
            <div className="p-2 rounded-full bg-white/5 border border-white/5 text-neutral-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* To Input */}
          <div className="space-y-2 group/input">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3 h-3 text-neutral-500" /> To
            </label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:bg-black/60 focus:border-white/20 outline-none transition-all text-2xl font-bold text-white placeholder:text-neutral-700"
                placeholder="BOM"
                maxLength={3}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600 bg-white/5 px-2 py-1 rounded">
                AIRPORT
              </div>
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2 group/input">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3 h-3 text-neutral-500" /> Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:bg-black/60 focus:border-white/20 outline-none transition-all text-lg font-medium text-white min-h-[66px]"
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="pb-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 min-h-[66px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
