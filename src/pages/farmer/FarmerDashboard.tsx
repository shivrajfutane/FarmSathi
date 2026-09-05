import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { marketService } from "@/services/market";
import { lotsService } from "@/services/lots";
import { offersService } from "@/services/offers";
import { paymentsService } from "@/services/payments";
import { PriceCard } from "@/components/shared/PriceCard";
import { RecommendationCard } from "@/components/shared/RecommendationCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { SmartMatchScore } from "@/components/shared/SmartMatchScore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type {
  MarketPrice,
  ProduceLot,
  Offer,
  Payment,
  SaleWindowRecommendation,
} from "@/types";
import {
  Sprout,
  TrendingUp,
  PackagePlus,
  Users,
  Tag,
  Truck,
  IndianRupee,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [recommendation, setRecommendation] = useState<SaleWindowRecommendation | null>(null);
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [pricesData, recData, lotsData, offersData, paymentsData] = await Promise.all([
          marketService.getMarketPrices(),
          marketService.getSaleWindowRecommendation("Tomato"),
          lotsService.getLots(),
          offersService.getOffers(),
          paymentsService.getPayments(),
        ]);

        setPrices(pricesData);
        setRecommendation(recData);
        setLots(lotsData);
        setOffers(offersData);
        setPayments(paymentsData);
      } catch (err) {
        console.error("Dashboard data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleRespondOffer = async (offerId: string, action: "accept" | "reject") => {
    try {
      const updated = await offersService.respondToOffer(offerId, action);
      setOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
      if (action === "accept") {
        navigate("/farmer/orders");
      }
    } catch (err) {
      console.error("Offer action failed", err);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* ── Top Header Section: "Good morning, Farmer" ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-green-800 via-forest-900 to-forest-950 text-white p-6 sm:p-7 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-white border border-emerald-500/30">
              Kisan Portal 2026
            </span>
            <VerifiedBadge type="farmer" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Good morning, {user?.fullName || "Farmer"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/95 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span className="text-white">Baramati, Pune District • APMC Benchmark Mandi Live</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 flex-wrap">
          <Button
            onClick={() => navigate("/farmer/lots/create")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 shadow-md"
            size="sm"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Create Produce Lot</span>
          </Button>

          <Button
            onClick={() => navigate("/farmer/buyers")}
            variant="outline"
            size="sm"
            className="border-emerald-400/40 text-white bg-white/10 hover:bg-white/20 gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Find Buyers</span>
          </Button>
        </div>
      </div>

      {/* ── Market Prices Summary Cards ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-700" />
            <h2 className="text-lg font-bold text-foreground">Current Market Prices</h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">(Pune APMC Benchmark)</span>
          </div>
          <Link
            to="/farmer/market"
            className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
          >
            <span>View All Mandi Intelligence</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceCard
            crop="Tomato"
            price={2250}
            changePercent={8.2}
            minPrice={2050}
            maxPrice={2450}
            mandiName="Pune APMC"
            onClick={() => navigate("/farmer/market")}
          />
          <PriceCard
            crop="Onion"
            price={1950}
            changePercent={-2.4}
            minPrice={1750}
            maxPrice={2150}
            mandiName="Pune APMC"
            onClick={() => navigate("/farmer/market")}
          />
          <PriceCard
            crop="Wheat"
            price={2450}
            changePercent={3.1}
            minPrice={2350}
            maxPrice={2550}
            mandiName="Pune APMC"
            onClick={() => navigate("/farmer/market")}
          />
          <PriceCard
            crop="Potato"
            price={1350}
            changePercent={1.8}
            minPrice={1200}
            maxPrice={1450}
            mandiName="Pune APMC"
            onClick={() => navigate("/farmer/market")}
          />
        </div>
      </section>

      {/* ── AI Sale Window Recommendation ── */}
      {recommendation && (
        <RecommendationCard
          recommendation={recommendation}
          onActionClick={() => navigate("/farmer/lots/create")}
        />
      )}

      {/* ── Main Dashboard 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Buyer Offers & Active Lots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer Offers Received */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-700" />
                  <span>Incoming Buyer Offers</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Direct purchase bids submitted by verified buyers
                </CardDescription>
              </div>
              <Link
                to="/farmer/offers"
                className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
              >
                <span>All Offers ({offers.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {offers.slice(0, 2).map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 rounded-xl border bg-card/70 hover:bg-muted/30 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">
                          {offer.buyer?.companyName || "ABC Foods Pvt Ltd"}
                        </h4>
                        <VerifiedBadge type="buyer" size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Offered for: <strong>{offer.lot?.crop || "Tomato"}</strong> ({offer.quantity} kg)
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-lg font-extrabold text-green-700">
                        {formatCurrency(offer.offeredPrice)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/ quintal</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block">
                        Total: <strong>{formatCurrency((offer.offeredPrice * offer.quantity) / 100)}</strong>
                      </span>
                    </div>
                  </div>

                  {offer.matchDetails && (
                    <SmartMatchScore score={offer.matchScore || 92} compact />
                  )}

                  <div className="pt-2 border-t flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      Valid until {formatDate(offer.validUntil)}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondOffer(offer.id, "reject")}
                        className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRespondOffer(offer.id, "accept")}
                        className="text-xs h-8 bg-green-700 hover:bg-green-800 text-white font-bold"
                      >
                        Accept Offer & Ship
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Produce Lots */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-green-700" />
                  <span>My Active Produce Lots</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Lots published to institutional buyers
                </CardDescription>
              </div>
              <Link
                to="/farmer/lots"
                className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
              >
                <span>View All ({lots.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-3">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    {lot.images && lot.images.length > 0 && (
                      <img
                        src={lot.images[0]}
                        alt={lot.crop}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-green-200"
                        loading="lazy"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{lot.crop} ({lot.variety})</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Grade {lot.grade}
                        </span>
                        <StatusBadge status={lot.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available: <strong>{lot.quantity} {lot.unit}</strong> • Expected: <strong>{formatCurrency(lot.expectedPrice)}/q</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => navigate(`/farmer/buyers?crop=${lot.crop}&qty=${lot.quantity}`)}
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1 border-green-300 text-green-800 hover:bg-green-50"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Find Matches</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Orders in Transit & Payment Status */}
        <div className="space-y-6">
          {/* Order & Shipment Status */}
          <Card className="shadow-xs border-green-200 bg-green-50/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-950">
                <Truck className="w-4 h-4 text-green-700" />
                <span>Live Logistics & Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-green-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Order #ORD-8821</span>
                  <StatusBadge status="in_transit" />
                </div>
                <p className="text-xs text-muted-foreground">
                  500 kg Tomato ➔ ABC Foods Hub (Mumbai)
                </p>
                <div className="text-xs p-2 rounded-lg bg-slate-50 border space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transporter:</span>
                    <span className="font-semibold text-foreground">Swift Agri Logistics</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-semibold text-foreground">MH12 AB 1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Delivery:</span>
                    <span className="font-semibold text-green-800">Tomorrow 2:00 PM</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/farmer/orders")}
                  size="sm"
                  className="w-full text-xs h-8 bg-green-700 hover:bg-green-800 text-white"
                >
                  Track Live Route Map
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Payouts Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-700" />
                <span>Payment & Settlement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Net Payout Amount:</span>
                    <span className="text-base font-extrabold text-green-700">
                      {formatCurrency(p.netAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={p.status} />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Direct Bank Transfer upon buyer delivery confirmation.
                  </p>
                </div>
              ))}

              <Link
                to="/farmer/payments"
                className="text-xs font-bold text-green-700 hover:underline block text-center pt-1"
              >
                View Complete Ledger & Invoices
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
