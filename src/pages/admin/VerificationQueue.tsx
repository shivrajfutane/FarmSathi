import React, { useState, useEffect } from "react";
import { adminService, type PendingVerificationItem } from "@/services/admin";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { VerificationStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  Building,
  User,
  ShieldCheck,
  Search,
} from "lucide-react";

export const VerificationQueue: React.FC = () => {
  const [items, setItems] = useState<PendingVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [actionNotice, setActionNotice] = useState("");

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingVerifications();
      setItems(data);
    } catch (err) {
      console.error("Queue load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleUpdate = async (id: string, status: VerificationStatus) => {
    await adminService.updateVerification(id, status);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setActionNotice(`Verification updated to ${status.toUpperCase()} successfully.`);
    setTimeout(() => setActionNotice(""), 2500);
  };

  const filteredItems = items.filter((item) => {
    if (filterRole === "all") return true;
    return item.role === filterRole;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-purple-600" />
            <span>KYC & Platform Verification Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit Aadhaar cards, 7/12 land records, FPO certificates, and GST credentials
          </p>
        </div>

        <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              filterRole === "all" ? "bg-purple-600 text-white" : "text-muted-foreground"
            }`}
          >
            All Registrations
          </button>
          <button
            onClick={() => setFilterRole("farmer")}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              filterRole === "farmer" ? "bg-purple-600 text-white" : "text-muted-foreground"
            }`}
          >
            Farmers
          </button>
          <button
            onClick={() => setFilterRole("fpo")}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              filterRole === "fpo" ? "bg-purple-600 text-white" : "text-muted-foreground"
            }`}
          >
            FPOs
          </button>
          <button
            onClick={() => setFilterRole("buyer")}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              filterRole === "buyer" ? "bg-purple-600 text-white" : "text-muted-foreground"
            }`}
          >
            Buyers
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Verification Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-xs border-purple-200">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-base text-foreground">{item.name}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {item.role}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Entity: <strong>{item.entityName}</strong> • {item.district}, {item.state}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground">
                  Submitted on {formatDate(item.submittedAt)}
                </span>
              </div>

              {/* Document Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Document Type Submitted</span>
                  <strong className="text-foreground flex items-center gap-1.5 mt-0.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    {item.documentType}
                  </strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Document Reference No.</span>
                  <strong className="text-foreground font-mono text-xs">{item.documentNumber}</strong>
                </div>
              </div>

              {/* Verification Actions */}
              <div className="flex items-center justify-between pt-2 border-t flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Uploaded Documents</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(item.id, "more_info_needed")}
                    className="text-xs text-amber-800 border-amber-300 hover:bg-amber-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    Request More Info
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(item.id, "rejected")}
                    className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleUpdate(item.id, "approved")}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Approve & Grant Verified Badge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
