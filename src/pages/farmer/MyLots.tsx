import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lotsService } from "@/services/lots";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProduceLot } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  PackagePlus,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle,
  Eye,
} from "lucide-react";

export const MyLots: React.FC = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
      try {
        const data = await lotsService.getLots();
        setLots(data);
      } catch (err) {
        console.error("Failed to load lots", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="w-7 h-7 text-green-700" />
            <span>My Produce Lots</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your harvest listings, track active buyer matches & update lot status
          </p>
        </div>

        <Button
          onClick={() => navigate("/farmer/lots/create")}
          size="sm"
          className="bg-green-700 hover:bg-green-800 text-white font-bold gap-1.5 shadow-xs"
        >
          <PackagePlus className="w-4 h-4" />
          <span>Create New Lot</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lots.map((lot) => (
          <Card key={lot.id} className="shadow-xs border-green-200 hover:border-green-300 transition-all overflow-hidden p-0 flex flex-col justify-between">
            <div>
              {lot.images && lot.images.length > 0 && (
                <div className="w-full h-36 relative bg-muted overflow-hidden">
                  <img
                    src={lot.images[0]}
                    alt={`${lot.crop} - ${lot.variety}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/95 text-green-900 border border-green-200/50 shadow-2xs">
                      Grade {lot.grade}
                    </span>
                    <StatusBadge status={lot.status} />
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base text-foreground truncate">
                        {lot.crop} ({lot.variety})
                      </h3>
                      {(!lot.images || lot.images.length === 0) && (
                        <>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                            Grade {lot.grade}
                          </span>
                          <StatusBadge status={lot.status} />
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
                      <MapPin className="w-3.5 h-3.5 text-green-700 shrink-0" />
                      <span className="truncate">{lot.locationVillage}, {lot.locationDistrict}, {lot.locationState}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-green-700">
                      {formatCurrency(lot.expectedPrice)}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">/ quintal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-muted/30">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Available Quantity</span>
                    <strong className="text-foreground">{lot.quantity} {lot.unit}</strong>
                  </div>

              <div>
                <span className="text-muted-foreground text-[10px] block">Floor (Min) Price</span>
                <strong className="text-foreground">{formatCurrency(lot.minAcceptablePrice)}/q</strong>
              </div>

              <div>
                <span className="text-muted-foreground text-[10px] block">Harvest Date</span>
                <strong className="text-foreground">{formatDate(lot.harvestDate)}</strong>
              </div>

              <div>
                <span className="text-muted-foreground text-[10px] block">Available From</span>
                <strong className="text-foreground">{formatDate(lot.availableFrom)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-center justify-between pt-3 border-t text-xs">
            <span className="text-muted-foreground text-[11px]">
              Listed on {formatDate(lot.createdAt)}
            </span>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(`/farmer/buyers?crop=${lot.crop}&qty=${lot.quantity}`)}
                size="sm"
                className="text-xs bg-green-700 hover:bg-green-800 text-white font-bold gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Find Buyers</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
</div>
  );
};
