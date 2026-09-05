import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  RotateCcw,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "lot" | "offer" | "order" | "payment" | "dispute" | "verification";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "lot" }) => {
  const normalized = status.toLowerCase();

  if (
    normalized === "completed" ||
    normalized === "delivered" ||
    normalized === "paid" ||
    normalized === "approved" ||
    normalized === "accepted" ||
    normalized === "resolved"
  ) {
    return (
      <Badge variant="success" className="gap-1 capitalize bg-emerald-50 text-emerald-700 border-emerald-300">
        <CheckCircle className="w-3 h-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }

  if (
    normalized === "pending" ||
    normalized === "processing" ||
    normalized === "under_review" ||
    normalized === "open"
  ) {
    return (
      <Badge variant="warning" className="gap-1 capitalize bg-amber-50 text-amber-800 border-amber-300">
        <Clock className="w-3 h-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }

  if (
    normalized === "in_transit" ||
    normalized === "picked_up" ||
    normalized === "pickup_scheduled" ||
    normalized === "transport_assigned"
  ) {
    return (
      <Badge variant="info" className="gap-1 capitalize bg-green-50 text-green-800 border-green-300">
        <Truck className="w-3 h-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }

  if (normalized === "countered") {
    return (
      <Badge variant="info" className="gap-1 capitalize bg-emerald-50 text-emerald-800 border-emerald-300">
        <RotateCcw className="w-3 h-3" />
        Counter Offer
      </Badge>
    );
  }

  if (
    normalized === "rejected" ||
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "expired"
  ) {
    return (
      <Badge variant="destructive" className="gap-1 capitalize">
        <XCircle className="w-3 h-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }

  if (normalized === "published" || normalized === "matched") {
    return (
      <Badge variant="success" className="gap-1 capitalize bg-teal-50 text-teal-800 border-teal-300">
        <FileCheck className="w-3 h-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }

  return (
    <Badge variant="muted" className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
};
