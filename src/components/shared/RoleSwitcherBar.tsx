import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Sprout, ShoppingBag, ShieldCheck, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoleSwitcherBar: React.FC = () => {
  const { role, switchRoleDemo } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSwitch = (newRole: UserRole) => {
    switchRoleDemo(newRole);
    if (newRole === "farmer") navigate("/farmer/dashboard");
    else if (newRole === "buyer") navigate("/buyer/dashboard");
    else if (newRole === "admin") navigate("/admin/dashboard");
  };

  if (isCollapsed) {
    return (
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Role: <strong className="capitalize text-white">{role}</strong></span>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
        >
          <span>Show Role Switcher</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Demo Role Switcher"
      className="bg-slate-950 text-slate-200 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shadow-xs transition-all"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SIH 2026 Sandbox
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-slate-300 text-[11px] hidden sm:inline">
          Active Role: <strong className="capitalize text-white font-bold">{role}</strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-[11px] mr-1 hidden md:inline font-medium">
          Quick Switch:
        </span>

        <button
          type="button"
          onClick={() => handleSwitch("farmer")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            role === "farmer"
              ? "bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400/50"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
          }`}
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-300" />
          <span>Farmer / FPO</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch("buyer")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            role === "buyer"
              ? "bg-green-700 text-white shadow-xs ring-1 ring-green-400/50"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-green-300" />
          <span>Buyer</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch("admin")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            role === "admin"
              ? "bg-purple-600 text-white shadow-xs ring-1 ring-purple-400/50"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          title="Minimize toolbar"
          className="ml-1 p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
