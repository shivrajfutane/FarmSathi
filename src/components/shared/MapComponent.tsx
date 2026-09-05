import React, { useEffect, useState } from "react";
import { MapPin, Navigation, Compass, Layers, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: "pickup" | "delivery" | "mandi" | "buyer" | "transit";
  price?: number;
}

interface MapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showRoute?: boolean;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  interactive?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  markers = [
    { id: "1", lat: 18.1491, lng: 74.5744, title: "Farmer Farm Gate", subtitle: "Baramati, Pune", type: "pickup" },
    { id: "2", lat: 19.0996, lng: 72.8503, title: "ABC Foods Warehouse", subtitle: "Mumbai Delivery Point", type: "delivery" },
    { id: "3", lat: 18.5204, lng: 73.8567, title: "Pune APMC Mandi", subtitle: "Benchmark Market", type: "mandi", price: 2250 },
    { id: "4", lat: 19.9975, lng: 73.7898, title: "Nashik Hub", subtitle: "Major Hub", type: "mandi", price: 2300 },
  ],
  center = [18.7, 73.8],
  height = "380px",
  showRoute = true,
  onLocationSelect,
  interactive = true,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(markers[0] || null);

  const getMarkerIconBg = (type: MapMarker["type"]) => {
    switch (type) {
      case "pickup":
        return "bg-emerald-600 text-white border-2 border-white shadow-md";
      case "delivery":
        return "bg-green-800 text-white border-2 border-white shadow-md";
      case "mandi":
        return "bg-amber-600 text-white border-2 border-white shadow-md";
      case "buyer":
        return "bg-forest-900 text-white border-2 border-white shadow-md";
      default:
        return "bg-neutral-800 text-white";
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border bg-neutral-900 shadow-sm" style={{ height }}>
      {/* Map visual background with realistic grid, topography texture, and route line */}
      <div className="absolute inset-0 bg-[#0f172a] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {/* SVG Route overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {showRoute && (
            <>
              <path
                d="M 160 260 Q 280 200, 480 180 T 680 120"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-[dash_20s_linear_infinite]"
              />
              <circle cx="160" cy="260" r="16" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
              <circle cx="680" cy="120" r="16" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
            </>
          )}
        </svg>

        {/* Map Header / Controls */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Logistics & Mandi Geospatial Grid</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-400" />
            <span>Location Privacy Protected</span>
          </div>
        </div>

        {/* Render Markers across coordinate layout */}
        <div className="relative w-full h-full">
          {/* Farm Gate (Baramati) */}
          <div
            className="absolute left-[20%] bottom-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
            onClick={() => setSelectedMarker(markers[0])}
          >
            <div className={`p-2 rounded-full ${getMarkerIconBg("pickup")}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div className="mt-1 bg-slate-900/95 text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium border border-slate-700">
              🌾 Farm Gate (Baramati)
            </div>
          </div>

          {/* Pune APMC */}
          <div
            className="absolute left-[38%] bottom-[40%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
            onClick={() => setSelectedMarker(markers[2])}
          >
            <div className={`p-2 rounded-full ${getMarkerIconBg("mandi")}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div className="mt-1 bg-slate-900/95 text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium border border-slate-700">
              🏛️ Pune APMC (₹2,250)
            </div>
          </div>

          {/* Mumbai Warehouse / Delivery Point */}
          <div
            className="absolute left-[70%] top-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
            onClick={() => setSelectedMarker(markers[1])}
          >
            <div className={`p-2 rounded-full ${getMarkerIconBg("delivery")}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div className="mt-1 bg-slate-900/95 text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium border border-slate-700">
              🏭 ABC Foods Hub (Mumbai)
            </div>
          </div>

          {/* Nashik Mandi */}
          <div
            className="absolute left-[82%] top-[55%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
            onClick={() => setSelectedMarker(markers[3])}
          >
            <div className={`p-2 rounded-full ${getMarkerIconBg("mandi")}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div className="mt-1 bg-slate-900/95 text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium border border-slate-700">
              🏛️ Nashik Mandi (₹2,300)
            </div>
          </div>
        </div>

        {/* Selected Marker Detail Card on Map */}
        {selectedMarker && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-slate-100 shadow-xl animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedMarker.title}
                </h5>
                {selectedMarker.subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedMarker.subtitle}</p>
                )}
              </div>
              <Badge variant="outline" className="text-[10px] uppercase border-slate-600 text-slate-300">
                {selectedMarker.type}
              </Badge>
            </div>

            {selectedMarker.price && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Modal Rate:</span>
                <span className="font-bold text-emerald-400">₹{selectedMarker.price}/quintal</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
