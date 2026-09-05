import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  PackagePlus,
  Boxes,
  Users,
  Tag,
  Truck,
  IndianRupee,
  ShieldAlert,
  Bell,
  UserCheck,
  Building2,
  Store,
  BarChart3,
  FileCheck2,
  HelpCircle,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const farmerLinks = [
    { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farmer/market", label: "Market Prices", icon: TrendingUp },
    { to: "/farmer/lots/create", label: "Create Produce Lot", icon: PackagePlus, highlight: true },
    { to: "/farmer/lots", label: "My Produce Lots", icon: Boxes },
    { to: "/farmer/buyers", label: "Find Verified Buyers", icon: Users },
    { to: "/farmer/offers", label: "Buyer Offers", icon: Tag },
    { to: "/farmer/orders", label: "Orders & Logistics", icon: Truck },
    { to: "/farmer/payments", label: "Payments & Payouts", icon: IndianRupee },
    { to: "/farmer/disputes", label: "Disputes & Support", icon: ShieldAlert },
  ];

  const buyerLinks = [
    { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/buyer/marketplace", label: "Browse Farmer Lots", icon: Store, highlight: true },
    { to: "/buyer/offers", label: "My Offers Sent", icon: Tag },
    { to: "/buyer/orders", label: "Active Orders", icon: Truck },
    { to: "/buyer/payments", label: "Payment Escrow", icon: IndianRupee },
    { to: "/buyer/profile", label: "Buyer Profile", icon: Building2 },
    { to: "/buyer/disputes", label: "Disputes", icon: ShieldAlert },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/verification", label: "KYC Verifications", icon: FileCheck2, highlight: true },
    { to: "/admin/users", label: "Users & Farmers", icon: Users },
    { to: "/admin/analytics", label: "Demand Analytics", icon: BarChart3 },
    { to: "/admin/disputes", label: "Dispute Resolution", icon: ShieldAlert },
  ];

  const links = role === "buyer" ? buyerLinks : role === "admin" ? adminLinks : farmerLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 sidebar-gradient text-white border-r border-green-900/40 shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-6 shadow-sm">
      <div>
        <p className="px-3 text-[11px] font-bold tracking-wider text-green-200/80 uppercase mb-2">
          {role === "buyer" ? "Buyer Procurement" : role === "admin" ? "National Oversight" : "Farmer Linkage"}
        </p>
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/20 text-white shadow-xs font-bold border-l-3 border-emerald-300 pl-2.5"
                      : item.highlight
                      ? "text-green-100 bg-white/10 hover:bg-white/15 border border-green-400/30"
                      : "text-green-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-emerald-300" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Trust & Support Box */}
      <div className="mt-auto p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-xs text-white space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <HelpCircle className="w-4 h-4 text-emerald-300" />
          <span>Kisan Helpline 24x7</span>
        </div>
        <p className="text-[11px] text-green-100/80 leading-relaxed">
          Toll Free: <strong className="text-white">1800-180-1551</strong>
          <br />Direct MSP & Mandi Support
        </p>
      </div>
    </aside>
  );
};
