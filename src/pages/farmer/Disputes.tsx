import React, { useState, useEffect } from "react";
import { disputesService } from "@/services/disputes";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Dispute, DisputeCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
} from "lucide-react";

export const Disputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DisputeCategory>("quality_mismatch");
  const [description, setDescription] = useState("");
  const [orderId, setOrderId] = useState("ord1");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const data = await disputesService.getDisputes();
      setDisputes(data);
    } catch (err) {
      console.error("Failed to load disputes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await disputesService.createDispute({
        userId: "u1",
        orderId,
        title,
        category,
        description,
        evidenceFiles: [],
      });
      setDisputes([created, ...disputes]);
      setIsCreating(false);
      setTitle("");
      setDescription("");
      setSuccessMessage("Dispute claim submitted! Assigned to Mandi Arbitrator.");
    } catch (err) {
      console.error("Dispute creation failed", err);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-amber-600" />
            <span>Grievance & Dispute Mediation</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Transparent dispute resolution for produce quality, freight delays, and payment adjustments
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(!isCreating)}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isCreating ? "Cancel" : "File New Dispute"}</span>
        </Button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* File Dispute Form */}
      {isCreating && (
        <Card className="shadow-md border-amber-300 bg-amber-50/20 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">File Grievance Claim</CardTitle>
            <CardDescription className="text-xs">
              Provide transaction and evidence details for review by a neutral government arbitrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Associated Order ID</label>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="ord1">#ORD-8821 (Tomato - 500kg - ABC Foods)</option>
                    <option value="ord2">#ORD-8820 (Onion - 1000kg - Fresh Direct)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Dispute Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DisputeCategory)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="quality_mismatch">Quality Mismatch (Grading Dispute)</option>
                    <option value="payment_issue">Payment Deduction Issue</option>
                    <option value="delivery_issue">Logistics / Transit Damage</option>
                    <option value="price_dispute">Price Reconciliation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Dispute Subject / Summary *</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Buyer disputed Grade A certificate without proper photo proof"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain exactly what occurred and what resolution you request..."
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Upload Photo Evidence / Weighbridge Slips</label>
                <div className="p-4 border border-dashed rounded-xl flex items-center justify-center gap-2 bg-muted/20 text-xs text-muted-foreground">
                  <UploadCloud className="w-5 h-5 text-amber-600" />
                  <span>Attach weighment slips or crop photos (PDF/JPG)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Submit Claim to Arbitrator
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Disputes History */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Active & Past Claims</h3>

        {disputes.map((d) => (
          <Card key={d.id} className="shadow-xs border-amber-200">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-base text-foreground">{d.title}</h4>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Category: <strong className="capitalize">{d.category.replace(/_/g, " ")}</strong> • Order #{d.orderId}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Filed on {formatDate(d.createdAt)}
                </span>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-lg">
                {d.description}
              </p>

              <div className="p-3 rounded-lg bg-green-50/70 border border-green-200 text-xs text-green-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-700 shrink-0" />
                <span>
                  <strong>Arbitration SLA:</strong> A district agricultural officer will review uploaded evidence within 48 hours. Escrow payout is held securely.
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
