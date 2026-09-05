import React, { useState, useEffect } from "react";
import { offersService } from "@/services/offers";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Offer } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Clock, Truck, IndianRupee, RotateCcw, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BuyerOffers: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
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
    fetchOffers();
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Tag className="w-7 h-7 text-green-700" />
          <span>My Submitted Purchase Offers</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Track real-time offer negotiations, farmer acceptance, and counter bids
        </p>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="shadow-xs border-green-200">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-foreground">
                      {offer.lot?.crop || "Tomato"} ({offer.lot?.variety || "Hybrid"})
                    </h4>
                    <StatusBadge status={offer.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Farmer: <strong>Ravi Kumar</strong> • Baramati, Pune
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-xl font-black text-green-700">
                    {formatCurrency(offer.offeredPrice)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ quintal</span>
                  </div>
                  <span className="text-xs text-muted-foreground block">
                    Quantity: <strong>{offer.quantity} kg</strong> (Total: {formatCurrency((offer.offeredPrice * offer.quantity) / 100)})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-lg">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Delivery Logistics:</span>
                  <p className="font-semibold text-foreground">{offer.deliveryTerms}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Payment Terms:</span>
                  <p className="font-semibold text-foreground">{offer.paymentTerms}</p>
                </div>
              </div>

              {offer.status === "accepted" && (
                <div className="pt-2 flex items-center justify-between border-t text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Farmer accepted offer. Transit is being dispatched.
                  </span>
                  <Button
                    onClick={() => navigate("/buyer/orders")}
                    size="sm"
                    className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs"
                  >
                    View Shipment Route
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
