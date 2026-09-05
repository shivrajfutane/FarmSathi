import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockBuyer } from "@/mock/data";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle,
  Clock,
  PackageCheck,
  FileText,
} from "lucide-react";

export const BuyerProfile: React.FC = () => {
  const { user } = useAuth();
  const buyer = mockBuyer;

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card className="border-green-200 overflow-hidden shadow-sm">
        <div className="h-28 bg-gradient-to-r from-green-800 via-forest-900 to-forest-950" />
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-green-900 font-black text-2xl bg-gradient-to-br from-green-100 to-emerald-200">
                <Building2 className="w-12 h-12 text-green-800" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {buyer.companyName}
                  </h2>
                  <VerifiedBadge type="buyer" />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-green-700" />
                  <span>{buyer.district}, {buyer.state} • GSTIN: {buyer.gstNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>96% Payment Reliability</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-green-700" />
              <span>Procurement & Demand Specs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Type:</span>
                <strong className="text-foreground">{buyer.businessType} (Food Processing)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Settlement Window:</span>
                <strong className="text-emerald-700 font-bold">{buyer.avgPaymentDays} Days from Delivery</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Completed Lots:</span>
                <strong className="text-foreground">{buyer.totalPurchases} Farm Procurements</strong>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                Required Crops for Monthly Procurement
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {buyer.requiredCrops.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 font-semibold text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-emerald-200 bg-emerald-50/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Institutional Verification Dossier</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GST Registration:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Active ({buyer.gstNumber})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">FSSAI Food License:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Certified Clean
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Escrow Bank Guarantee:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-Disburse Enabled
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
