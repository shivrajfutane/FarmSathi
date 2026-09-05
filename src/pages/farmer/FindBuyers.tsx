import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buyerService, type BuyerMatchItem } from "@/services/buyer";
import { offersService } from "@/services/offers";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { SmartMatchScore } from "@/components/shared/SmartMatchScore";
import { CROPS, QUALITY_GRADES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const FindBuyers: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(searchParams.get("crop") || "Tomato");
  const [quantity, setQuantity] = useState(searchParams.get("qty") || "500");
  const [grade, setGrade] = useState("A");
  const [district, setDistrict] = useState("Pune");
  const [buyers, setBuyers] = useState<BuyerMatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState<BuyerMatchItem | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const matches = await buyerService.findMatchingBuyers({
          crop,
          quantity: Number(quantity),
          grade,
          district,
        });
        setBuyers(matches);
      } catch (err) {
        console.error("Failed to find buyers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [crop, quantity, grade, district]);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-7 h-7 text-green-700" />
          <span>Find Verified Institutional Buyers</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          AI Smart-Match connects your harvest directly to certified agribusinesses, processors & retailers
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-xs border-green-200 bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Quantity Available (kg)</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                {QUALITY_GRADES.map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Proximity District</label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Pune"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyers Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <span>Verified Buyer Matches</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
              {buyers.length} Found
            </span>
          </h3>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Ranked by Smart Match algorithm & payment reliability
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {buyers.map((item) => (
            <Card
              key={item.buyer.id}
              className="border-green-200/80 hover:border-green-400 transition-all shadow-xs space-y-4 p-5"
            >
              {/* Top Row: Buyer Name, Badge, Rating */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-base text-foreground">
                      {item.buyer.companyName}
                    </h4>
                    <VerifiedBadge type="buyer" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.buyer.businessType} • {item.buyer.district}, {item.buyer.state} ({item.distanceKm} km away)
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-green-700">
                    {formatCurrency(item.offeredPrice)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ q</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    Needs: <strong>{item.requiredQuantity} kg</strong>
                  </span>
                </div>
              </div>

              {/* Smart Match Score Widget */}
              <SmartMatchScore score={item.matchScore} breakdown={item.breakdown as any} />

              {/* Reliability & Delivery Terms */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-slate-50 border">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Payment Reliability</span>
                    <strong className="text-emerald-800 font-bold">
                      {item.buyer.paymentReliabilityScore}% Verified ({item.buyer.avgPaymentDays} Days avg)
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-green-700 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Logistics Arrangement</span>
                    <strong className="text-green-900 font-bold">
                      Farm Gate Pickup Available
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Avg response in &lt; 2 hours
                </span>

                <Button
                  onClick={() => navigate("/farmer/offers")}
                  size="sm"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold gap-1.5"
                >
                  <span>View Offer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
