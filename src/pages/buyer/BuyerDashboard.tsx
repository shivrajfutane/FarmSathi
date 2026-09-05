import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { lotsService } from "@/services/lots";
import { offersService } from "@/services/offers";
import { ordersService } from "@/services/orders";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProduceLot, Offer, Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Store,
  Tag,
  Truck,
  IndianRupee,
  ChevronRight,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        const [lotsData, offersData, ordersData] = await Promise.all([
          lotsService.getLots(),
          offersService.getOffers(),
          ordersService.getOrders(),
        ]);
        setLots(lotsData);
        setOffers(offersData);
        setOrders(ordersData);
      } catch (err) {
        console.error("Buyer dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerData();
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Buyer Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-green-800 via-forest-900 to-forest-950 text-white p-6 sm:p-7 rounded-2xl shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-700/80 text-green-100 border border-green-500/30">
              Institutional Procurement Portal
            </span>
            <VerifiedBadge type="buyer" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.fullName || "Arjun Mehta"} (ABC Foods)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Procurement Hub: Mumbai, Maharashtra • GSTIN Verified</span>
          </p>
        </div>

        <Button
          onClick={() => navigate("/buyer/marketplace")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 shadow-md self-start md:self-auto"
        >
          <Store className="w-4 h-4" />
          <span>Browse Farmer Lots</span>
        </Button>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-green-900 uppercase">Available Lots</span>
            <div className="text-2xl sm:text-3xl font-black text-green-900 mt-1">{lots.length} Lots</div>
            <span className="text-[11px] text-green-700 font-medium">Direct from verified farmers</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Bids Sent</span>
            <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{offers.length} Bids</div>
            <span className="text-[11px] text-muted-foreground">Pending farmer response</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">In-Transit Shipments</span>
            <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{orders.length} Consignments</div>
            <span className="text-[11px] text-green-600 font-medium">GPS tracked live</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Escrow Locked</span>
            <div className="text-2xl sm:text-3xl font-black text-green-700 mt-1">₹11,750</div>
            <span className="text-[11px] text-muted-foreground">Settles on arrival</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Marketplace Lots & Active Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fresh Produce Lots Available */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Store className="w-5 h-5 text-green-700" />
              <span>Recommended Farm Lots for Procurement</span>
            </h3>
            <Link
              to="/buyer/marketplace"
              className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lots.map((lot) => (
              <Card key={lot.id} className="shadow-xs border-green-200 hover:border-green-400 transition-all overflow-hidden p-0 flex flex-col justify-between">
                <div>
                  {lot.images && lot.images.length > 0 && (
                    <div className="w-full h-32 relative bg-muted overflow-hidden">
                      <img
                        src={lot.images[0]}
                        alt={lot.crop}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white/95 text-green-900 border border-green-200/50 shadow-2xs">
                        Grade {lot.grade}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground">{lot.crop} ({lot.variety})</h4>
                        {!lot.images?.[0] && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Grade {lot.grade}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-green-700">
                          {formatCurrency(lot.expectedPrice)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">/ quintal</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Quantity: <strong className="text-foreground">{lot.quantity} {lot.unit} available</strong></p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-green-700" />
                        <span>{lot.locationDistrict}, {lot.locationState}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    onClick={() => navigate(`/buyer/marketplace?lot=${lot.id}`)}
                    size="sm"
                    className="w-full text-xs h-8 bg-green-700 hover:bg-green-800 text-white font-bold"
                  >
                    Make Purchase Offer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Ongoing Orders Tracking */}
        <div className="space-y-4">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-700" />
                <span>Live Consignments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3.5 rounded-xl border bg-slate-50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Order #{ord.id.toUpperCase()}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <p className="text-muted-foreground">500 kg Tomato ➔ Mumbai Depot</p>
                  <div className="flex justify-between text-[11px] pt-1 border-t">
                    <span className="text-muted-foreground">Carrier: Swift Agri Logistics</span>
                    <span className="font-semibold text-green-800">ETA: Tomorrow 2 PM</span>
                  </div>
                  <Button
                    onClick={() => navigate("/buyer/orders")}
                    size="sm"
                    className="w-full text-xs h-7 bg-green-800 hover:bg-green-900 text-white font-semibold"
                  >
                    Track Live GPS & Verify
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
