import React, { useState, useEffect } from "react";
import { offersService } from "@/services/offers";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SmartMatchScore } from "@/components/shared/SmartMatchScore";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Offer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tag,
  CheckCircle,
  XCircle,
  RotateCcw,
  Truck,
  IndianRupee,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OfferManagement: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await offersService.getOffers();
      setOffers(data);
    } catch (err) {
      console.error("Failed to load offers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleAction = async (offerId: string, action: "accept" | "reject" | "counter", counterAmount?: number) => {
    try {
      const updated = await offersService.respondToOffer(offerId, action, counterAmount);
      setOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
      setCounterModalOffer(null);

      if (action === "accept") {
        setActionSuccessMessage("Offer accepted! Order generated & logistics scheduled.");
        setTimeout(() => navigate("/farmer/orders"), 1200);
      } else if (action === "counter") {
        setActionSuccessMessage(`Counter offer of ${formatCurrency(counterAmount || 0)}/q sent to buyer.`);
      } else {
        setActionSuccessMessage("Offer declined.");
      }
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Tag className="w-7 h-7 text-green-700" />
          <span>Buyer Offers & Negotiations</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review purchase bids from verified agribusinesses, counter negotiate, or accept to trigger pickup
        </p>
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="shadow-xs border-green-200 overflow-hidden">
            <div className="p-5 sm:p-6 space-y-4">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-foreground">
                      {offer.buyer?.companyName || "ABC Foods Pvt Ltd"}
                    </h3>
                    <VerifiedBadge type="buyer" size="sm" />
                    <StatusBadge status={offer.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bid for: <strong className="text-foreground">{offer.lot?.crop || "Tomato"} ({offer.lot?.variety || "Hybrid"})</strong> • Lot ID: #{offer.lotId}
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-xl font-black text-green-700">
                    {formatCurrency(offer.offeredPrice)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ quintal</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Total Value: <strong className="text-foreground">{formatCurrency((offer.offeredPrice * offer.quantity) / 100)}</strong> ({offer.quantity} kg)
                  </span>
                </div>
              </div>

              {/* Match Score */}
              {offer.matchDetails && (
                <SmartMatchScore score={offer.matchScore || 92} breakdown={offer.matchDetails as any} />
              )}

              {/* Terms Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Truck className="w-3.5 h-3.5 text-green-700" />
                    <span>Delivery Terms</span>
                  </div>
                  <p className="text-slate-600">{offer.deliveryTerms}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment & Escrow Terms</span>
                  </div>
                  <p className="text-slate-600">{offer.paymentTerms}</p>
                </div>
              </div>

              {/* Offer Actions */}
              {offer.status === "pending" && (
                <div className="pt-2 flex items-center justify-between gap-3 flex-wrap border-t">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Valid until {formatDate(offer.validUntil)}
                  </span>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(offer.id, "reject")}
                      className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCounterModalOffer(offer);
                        setCounterPrice((offer.offeredPrice + 100).toString());
                      }}
                      className="text-xs border-green-300 text-green-800 hover:bg-green-50 flex-1 sm:flex-initial"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Counter Offer
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleAction(offer.id, "accept")}
                      className="text-xs bg-green-700 hover:bg-green-800 text-white font-bold w-full sm:w-auto"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Accept & Arrange Transport
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base">Submit Counter Price</CardTitle>
              <CardDescription className="text-xs">
                Propose a new target price to {counterModalOffer.buyer?.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer's Initial Offer:</span>
                  <span className="font-bold">{formatCurrency(counterModalOffer.offeredPrice)} / quintal</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Your Proposed Price (₹ / quintal) *</label>
                <Input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder="2450"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCounterModalOffer(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleAction(counterModalOffer.id, "counter", Number(counterPrice))}
                className="text-xs bg-green-700 hover:bg-green-800 text-white font-bold"
              >
                Send Counter Offer
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
