import React, { useState, useEffect } from "react";
import { marketService } from "@/services/market";
import { PriceCard } from "@/components/shared/PriceCard";
import { RecommendationCard } from "@/components/shared/RecommendationCard";
import { CROPS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Market, MarketPrice, PriceTrend, PriceComparison, SaleWindowRecommendation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  BarChart2,
  Building,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MarketPrices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedDays, setSelectedDays] = useState("14");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [trendData, setTrendData] = useState<PriceTrend[]>([]);
  const [nearbyComparisons, setNearbyComparisons] = useState<PriceComparison[]>([]);
  const [recommendation, setRecommendation] = useState<SaleWindowRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mkts, prcs, trend, comp, rec] = await Promise.all([
          marketService.getMarkets(),
          marketService.getMarketPrices(selectedCrop),
          marketService.getPriceTrend(selectedCrop, Number(selectedDays)),
          marketService.getNearbyComparisons(selectedCrop),
          marketService.getSaleWindowRecommendation(selectedCrop),
        ]);
        setMarkets(mkts);
        setPrices(prcs);
        setTrendData(trend);
        setNearbyComparisons(comp);
        setRecommendation(rec);
      } catch (err) {
        console.error("Market data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCrop, selectedDays]);

  const currentPrice = prices[0]?.modalPrice || 2250;
  const minPrice = prices[0]?.minPrice || 2050;
  const maxPrice = prices[0]?.maxPrice || 2450;
  const avgPrice = Math.round((minPrice + maxPrice) / 2);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Top Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-green-700" />
            <span>Market Price Intelligence</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time APMC Mandi modal prices, historical trends & predictive selling opportunities
          </p>
        </div>

        {/* Crop Selector & Date Range */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-card border rounded-lg px-3 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              {CROPS.slice(0, 10).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-card border rounded-lg px-3 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50/40">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-green-900 uppercase">Modal Rate (Today)</span>
            <div className="text-2xl sm:text-3xl font-black text-green-800 mt-1">
              {formatCurrency(currentPrice)}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">+8.2% vs last week</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Minimum Price</span>
            <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {formatCurrency(minPrice)}
            </div>
            <span className="text-[11px] text-muted-foreground">Floor rate observed</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Maximum Price</span>
            <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {formatCurrency(maxPrice)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Peak Grade A lot rate</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Average Benchmark</span>
            <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {formatCurrency(avgPrice)}
            </div>
            <span className="text-[11px] text-muted-foreground">Regional APMC average</span>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Banner */}
      {recommendation && (
        <RecommendationCard
          recommendation={recommendation}
          onActionClick={() => navigate(`/farmer/lots/create?crop=${selectedCrop}`)}
        />
      )}

      {/* Main Grid: Historical Chart & Nearby Market Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Historical Price Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-green-700" />
                  <span>{selectedCrop} Price Trend ({selectedDays} Days)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily APMC modal arrival rates in ₹ per quintal
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => val.split("-").slice(1).join("/")}
                    stroke="#94a3b8"
                    fontSize={11}
                  />
                  <YAxis
                    domain={["dataMin - 100", "dataMax + 100"]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} / quintal`, "Modal Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#15803d"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Nearby Market Comparison */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-green-700" />
                <span>Nearby Market Comparison</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Prices across neighboring APMC mandis
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {nearbyComparisons.map((comp) => {
                const diff = comp.price - currentPrice;
                return (
                  <div
                    key={comp.market.id}
                    className="p-3 rounded-xl border flex items-center justify-between gap-2 bg-card hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {comp.market.name}
                      </h5>
                      <span className="text-[11px] text-muted-foreground ml-5">
                        {comp.distance === 0 ? "Local Base Mandi" : `${comp.distance} km away`}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-foreground">
                        {formatCurrency(comp.price)}
                      </div>
                      {diff !== 0 && (
                        <span
                          className={`text-[10px] font-bold ${
                            diff > 0 ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Potential Better Opportunity Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Potential Better Selling Opportunity</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              <strong>Mumbai APMC</strong> is paying <strong>₹2,450/q (+₹200/q premium)</strong>.
              Even after estimated transport costs of ₹45/q, direct linkage nets you an additional{" "}
              <strong className="text-amber-950">₹155 per quintal</strong>.
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/farmer/buyers?crop=" + selectedCrop)}
              className="w-full text-xs h-8 bg-amber-700 hover:bg-amber-800 text-white font-bold gap-1"
            >
              <span>Connect to Mumbai Buyers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
