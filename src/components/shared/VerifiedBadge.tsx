import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerifiedBadgeProps {
  type?: "farmer" | "fpo" | "buyer" | "govt";
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = "farmer",
  label,
  size = "sm",
  showIcon = true,
}) => {
  const defaultLabel =
    type === "fpo"
      ? "Verified FPO"
      : type === "buyer"
      ? "Verified Buyer"
      : type === "govt"
      ? "Govt. Mandi Verified"
      : "Govt. Verified Farmer";

  return (
    <Badge
      variant="success"
      className={`inline-flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 border-emerald-300 ${
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
    >
      {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
      <span>{label || defaultLabel}</span>
    </Badge>
  );
};
