import React from "react";
import { Check, Info, Sparkles, MapPin, Tag, Award, PackageCheck, AlertCircle } from "lucide-react";

interface SmartMatchScoreProps {
  score: number;
  breakdown?: {
    crop: boolean;
    quantity: boolean;
    quality: boolean;
    location: string;
    price: string;
  };
  compact?: boolean;
}

export const SmartMatchScore: React.FC<SmartMatchScoreProps> = ({
  score,
  breakdown,
  compact = false,
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (s >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-neutral-700 bg-neutral-50 border-neutral-300";
  };

  const defaultBreakdown = breakdown || {
    crop: true,
    quantity: true,
    quality: true,
    location: "Good (35 km)",
    price: "Excellent (Above Min Price)",
  };

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${getScoreColor(
          score
        )}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>{score}% Match</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-green-100 text-green-800">
            <Sparkles className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Smart Match Score</h4>
            <p className="text-[11px] text-muted-foreground">Transparent multi-factor calculation</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full border text-sm font-black ${getScoreColor(
            score
          )}`}
        >
          {score}%
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Crop Variety</span>
            <span className="font-semibold text-emerald-700">
              {defaultBreakdown.crop ? "100% Match" : "Partial"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Quantity Need</span>
            <span className="font-semibold text-emerald-700">
              {defaultBreakdown.quantity ? "Full Lot Match" : "Partial Match"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border">
          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Quality Grade</span>
            <span className="font-semibold text-emerald-700">
              {defaultBreakdown.quality ? "Certified Match" : "Under Spec"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border col-span-1">
          <MapPin className="w-3.5 h-3.5 text-green-700 shrink-0" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Location/Proximity</span>
            <span className="font-semibold text-green-800">{defaultBreakdown.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border col-span-1 sm:col-span-2">
          <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Offered Price</span>
            <span className="font-semibold text-amber-900">{defaultBreakdown.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
