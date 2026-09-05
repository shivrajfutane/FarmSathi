import React, { useState, useEffect } from "react";
import { paymentsService } from "@/services/payments";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IndianRupee,
  ShieldCheck,
  Download,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
} from "lucide-react";

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await paymentsService.getPayments();
        setPayments(data);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleReleaseDemo = async (id: string) => {
    try {
      const updated = await paymentsService.releasePayment(id);
      setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setActionSuccess("Escrow payment released directly to farmer bank account!");
    } catch (err) {
      console.error("Release failed", err);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <IndianRupee className="w-7 h-7 text-green-700" />
          <span>Payment & Escrow Settlements</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Government guaranteed escrow payouts, itemized freight deductions & bank UTR confirmations
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50/40">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-green-900 uppercase">Total Settled (FY 2026)</span>
            <div className="text-2xl font-black text-green-800 mt-1">₹4,28,500</div>
            <span className="text-[11px] text-emerald-700 font-medium">18 Completed Shipments</span>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-amber-900 uppercase">Escrow Locked (In-Transit)</span>
            <div className="text-2xl font-black text-amber-800 mt-1">₹10,432</div>
            <span className="text-[11px] text-amber-700 font-medium">Release pending delivery receipt</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Linked Bank Account</span>
            <div className="text-base font-bold text-foreground mt-1">State Bank of India</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> A/C ending ••••4921 (Verified)
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Itemized Transactions Breakdown */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Transaction Invoices & Breakdown</h3>

        {payments.map((p) => (
          <Card key={p.id} className="shadow-xs border-green-200 overflow-hidden">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-foreground">
                      Transaction #{p.id.toUpperCase()}
                    </h4>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">Order ID: #{p.orderId}</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-muted-foreground block">Net Farmer Payout</span>
                  <div className="text-xl font-black text-green-700">
                    {formatCurrency(p.netAmount)}
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Produce Gross Value</span>
                  <strong className="text-foreground text-sm">{formatCurrency(p.produceValue)}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Transport & Freight</span>
                  <strong className="text-red-700 text-sm">- {formatCurrency(p.transportCost)}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">e-NAM Platform Fee (1%)</span>
                  <strong className="text-muted-foreground text-sm">- {formatCurrency(p.platformCharge)}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Net Direct Bank Transfer</span>
                  <strong className="text-emerald-700 text-sm">{formatCurrency(p.netAmount)}</strong>
                </div>
              </div>

              {p.utrNumber && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-950">Bank UTR Number: {p.utrNumber}</span>
                  </div>
                  <span className="text-emerald-800 text-[11px]">Paid on {formatDate(p.paidAt || "")}</span>
                </div>
              )}

              {/* Action */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GST Invoice</span>
                </Button>

                {p.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleReleaseDemo(p.id)}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs"
                  >
                    Simulate Payment Release (Demo)
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
