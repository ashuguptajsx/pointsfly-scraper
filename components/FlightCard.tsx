import { Flight } from "@/lib/types";
import { Plane, Clock, IndianRupee, Award, ArrowRight } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  const formatTime = (timeStr: string) => {
    // If it's already formatted (e.g., "10:30 AM"), return as-is
    if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr === 'N/A') {
      return timeStr;
    }
    
    // Otherwise, try to parse as ISO date
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) {
        return timeStr; // Return original if invalid
      }
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeStr; // Return original on error
    }
  };

  return (
    <div className="group relative bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:bg-neutral-900/60 hover:border-white/10 transition-all duration-300">
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        
        {/* Airline Info */}
        <div className="flex items-center gap-4 lg:w-48 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
            <Plane className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-lg truncate tracking-tight">{flight.airline}</h3>
            <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Timeline */}
        <div className="flex-1 flex items-center gap-4 lg:gap-8">
          {/* Departure */}
          <div className="text-right flex-1">
            <p className="text-2xl font-bold text-white tracking-tight">{formatTime(flight.departureTime)}</p>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1">{flight.origin}</p>
          </div>

          {/* Path Visualization */}
          <div className="flex flex-col items-center w-32 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-2">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">{flight.duration}</span>
            </div>
            <div className="relative w-full flex items-center">
              <div className="h-[2px] bg-neutral-800 w-full rounded-full overflow-hidden">
                <div className="h-full bg-neutral-600 w-1/2 group-hover:w-full transition-all duration-700 ease-out" />
              </div>
              <Plane className="w-3 h-3 text-neutral-400 absolute left-1/2 -translate-x-1/2 rotate-90 bg-neutral-900 p-0.5 box-content" />
            </div>
            <p className="text-[10px] text-neutral-600 mt-2 font-medium">NON-STOP</p>
          </div>

          {/* Arrival */}
          <div className="text-left flex-1">
            <p className="text-2xl font-bold text-white tracking-tight">{formatTime(flight.arrivalTime)}</p>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mt-1">{flight.destination}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-1 lg:w-48 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <IndianRupee className="w-4 h-4 text-neutral-400" />
              <span className="text-3xl font-bold text-white tracking-tight">
                {flight.price.toLocaleString('en-IN')}
              </span>
            </div>
            
            {flight.pointsPrice && (
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <Award className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-500 tracking-wide">
                  {flight.pointsPrice.toLocaleString()} PTS
                </span>
              </div>
            )}
          </div>

          <button className="w-full lg:w-auto mt-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 px-4 rounded-lg border border-white/5 transition-colors flex items-center justify-center gap-2 group/btn">
            Select Flight <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
