import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceCardProps {
  crop: string;
  price: number;
  changePercent: number;
  unit?: string;
  mandiName?: string;
  minPrice?: number;
  maxPrice?: number;
  onClick?: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  crop,
  price,
  changePercent,
  unit = "quintal",
  mandiName,
  minPrice,
  maxPrice,
  onClick,
}) => {
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-green-300 ${
        onClick ? "active:scale-[0.99]" : ""
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isUp ? "bg-emerald-500" : isDown ? "bg-red-500" : "bg-neutral-300"
        }`}
      />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-base text-foreground">{crop}</h4>
            {mandiName && (
              <p className="text-xs text-muted-foreground">{mandiName}</p>
            )}
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUp
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : isDown
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {isUp && <TrendingUp className="w-3.5 h-3.5" />}
            {isDown && <TrendingDown className="w-3.5 h-3.5" />}
            {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
            <span>
              {isUp ? "+" : ""}
              {changePercent}% this week
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {formatCurrency(price)}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / {unit}
            </span>
          </div>
        </div>

        {(minPrice !== undefined || maxPrice !== undefined) && (
          <div className="mt-2 pt-2 border-t border-dashed flex justify-between text-xs text-muted-foreground">
            {minPrice !== undefined && (
              <span>Min: <b className="text-foreground font-medium">{formatCurrency(minPrice)}</b></span>
            )}
            {maxPrice !== undefined && (
              <span>Max: <b className="text-foreground font-medium">{formatCurrency(maxPrice)}</b></span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
