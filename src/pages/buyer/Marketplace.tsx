import React, { useState, useEffect } from "react";
import { lotsService } from "@/services/lots";
import { offersService } from "@/services/offers";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CROPS, QUALITY_GRADES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProduceLot } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  Search,
  Filter,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

export const Marketplace: React.FC = () => {
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [searchCrop, setSearchCrop] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "newest">("newest");
  const [loading, setLoading] = useState(true);

  // Make Offer Modal State
  const [activeLotForOffer, setActiveLotForOffer] = useState<ProduceLot | null>(null);
  const [offeredPrice, setOfferedPrice] = useState("");
  const [offerQuantity, setOfferQuantity] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("Buyer arranges transport from farm gate");
  const [paymentTerms, setPaymentTerms] = useState("Direct bank payout within 2 business days");
  const [offerSuccess, setOfferSuccess] = useState("");

  const loadLots = async () => {
    setLoading(true);
    try {
      const data = await lotsService.getLots({
        crop: searchCrop || undefined,
        grade: selectedGrade || undefined,
        district: districtFilter || undefined,
      });

      let sorted = [...data];
      if (sortBy === "price_asc") sorted.sort((a, b) => a.expectedPrice - b.expectedPrice);
      else if (sortBy === "price_desc") sorted.sort((a, b) => b.expectedPrice - a.expectedPrice);

      setLots(sorted);
    } catch (err) {
      console.error("Failed to load lots", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
  }, [searchCrop, selectedGrade, districtFilter, sortBy]);

  const handleOpenOfferModal = (lot: ProduceLot) => {
    setActiveLotForOffer(lot);
    setOfferedPrice(lot.expectedPrice.toString());
    setOfferQuantity(lot.quantity.toString());
    setOfferSuccess("");
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLotForOffer) return;

    try {
      await offersService.createOffer({
        lotId: activeLotForOffer.id,
        buyerId: "b1",
        farmerId: activeLotForOffer.farmerId,
        offeredPrice: Number(offeredPrice),
        quantity: Number(offerQuantity),
        validUntil: new Date(Date.now() + 4 * 86400000).toISOString(),
        deliveryTerms,
        paymentTerms,
      });

      setOfferSuccess(`Offer of ${formatCurrency(Number(offeredPrice))}/q submitted to farmer!`);
      setTimeout(() => {
        setActiveLotForOffer(null);
        setOfferSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Offer creation failed", err);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Store className="w-7 h-7 text-green-700" />
          <span>Farm Produce Marketplace</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Procure quality-certified harvest lots directly from verified farmers & FPOs across mandis
        </p>
      </div>

      {/* Search & Filter Bar */}
      <Card className="shadow-xs border-green-200">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Search Crop</label>
              <Input
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                placeholder="e.g. Tomato, Onion, Wheat"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Quality Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="">All Quality Grades</option>
                {QUALITY_GRADES.map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Location / District</label>
              <Input
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                placeholder="e.g. Pune, Nashik"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="newest">Newly Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produce Lots Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">
            Available Produce Lots ({lots.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lots.map((lot) => (
            <Card
              key={lot.id}
              className="shadow-xs border-green-200 hover:border-green-400 hover:shadow-md transition-all overflow-hidden p-0 flex flex-col justify-between"
            >
              <div>
                {/* Produce Lot Photo */}
                <div className="w-full h-44 relative bg-muted overflow-hidden">
                  {lot.images && lot.images.length > 0 ? (
                    <img
                      src={lot.images[0]}
                      alt={`${lot.crop} - ${lot.variety}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 text-green-700">
                      <Store className="w-10 h-10 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-green-900 shadow-xs border border-green-200/60 backdrop-blur-xs">
                      Grade {lot.grade}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-forest-900/85 text-white shadow-xs backdrop-blur-xs">
                      {lot.quantity} {lot.unit}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-lg text-foreground">
                        {lot.crop}
                      </h4>
                      <p className="text-xs text-muted-foreground">{lot.variety}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-green-700">
                        {formatCurrency(lot.expectedPrice)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">/ quintal</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground p-3 rounded-xl bg-slate-50 border">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <strong className="text-foreground font-semibold">{lot.locationDistrict}, {lot.locationState}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Harvest Date:</span>
                      <strong className="text-foreground">{formatDate(lot.harvestDate)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <strong className="text-foreground font-bold">{lot.quantity} {lot.unit}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() => handleOpenOfferModal(lot)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs h-10 shadow-xs"
                >
                  Make Offer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Make Offer Modal */}
      {activeLotForOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-green-300">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-lg font-bold text-foreground">
                  Submit Purchase Offer to Farmer
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lot #{activeLotForOffer.id} • {activeLotForOffer.crop} (Grade {activeLotForOffer.grade})
                </p>
              </div>

              {offerSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{offerSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Your Offered Price (₹ / quintal) *</label>
                      <Input
                        required
                        type="number"
                        value={offeredPrice}
                        onChange={(e) => setOfferedPrice(e.target.value)}
                        placeholder="2300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Quantity Desired (kg) *</label>
                      <Input
                        required
                        type="number"
                        value={offerQuantity}
                        onChange={(e) => setOfferQuantity(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Delivery Arrangement</label>
                    <select
                      value={deliveryTerms}
                      onChange={(e) => setDeliveryTerms(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                    >
                      <option value="Buyer arranges transport from farm gate">Buyer arranges transport from farm gate</option>
                      <option value="Farmer delivers to buyer warehouse in Mumbai">Farmer delivers to buyer warehouse in Mumbai</option>
                      <option value="Delivery to benchmark APMC mandi">Delivery to benchmark APMC mandi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Payment & Escrow Terms</label>
                    <Input
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveLotForOffer(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-green-700 hover:bg-green-800 text-white font-bold"
                    >
                      Submit Official Offer
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
