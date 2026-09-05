import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import type { SaleWindowRecommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: SaleWindowRecommendation;
  onActionClick?: () => void;
  compact?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onActionClick,
  compact = false,
}) => {
  const isPositive = recommendation.priceTrend === "positive";

  return (
    <Card className="border-green-300 bg-gradient-to-br from-green-50/70 via-white to-amber-50/40 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <CardContent className="p-5 sm:p-6 relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-700 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Market Recommendation</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-green-200 text-green-800 shadow-2xs">
            <span>Confidence:</span>
            <span className="font-bold text-green-700">{recommendation.confidence}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              Recommended Selling Window for {recommendation.crop}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {recommendation.crop} prices have increased{" "}
              <strong className="text-green-700">
                {recommendation.percentChange}%
              </strong>{" "}
              over the last {recommendation.days} days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-white/80 border border-green-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase">
                  Expected Trend
                </p>
                <p className="text-sm font-bold text-emerald-800 capitalize">
                  {recommendation.priceTrend} (Strong Momentum)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase">
                  Recommended Action
                </p>
                <p className="text-sm font-bold text-amber-900">
                  {recommendation.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="text-xs text-muted-foreground bg-white/60 p-3 rounded-lg border border-neutral-200/60 leading-relaxed">
              <span className="font-semibold text-foreground">Why this window? </span>
              {recommendation.reasoning}
            </div>
          )}

          {onActionClick && (
            <div className="pt-2 flex justify-end">
              <Button
                onClick={onActionClick}
                size="sm"
                className="gap-2 bg-green-700 hover:bg-green-800 text-white shadow-sm"
              >
                <span>Create Produce Lot Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
