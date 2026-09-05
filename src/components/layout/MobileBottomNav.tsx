import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  TrendingUp,
  PlusCircle,
  Users,
  Truck,
  User,
  Store,
  FileCheck2,
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const { role } = useAuth();

  const farmerNav = [
    { to: "/farmer/dashboard", label: "Home", icon: Home },
    { to: "/farmer/market", label: "Market", icon: TrendingUp },
    { to: "/farmer/lots/create", label: "Sell Lot", icon: PlusCircle, highlight: true },
    { to: "/farmer/buyers", label: "Buyers", icon: Users },
    { to: "/farmer/orders", label: "Orders", icon: Truck },
    { to: "/farmer/profile", label: "Profile", icon: User },
  ];

  const buyerNav = [
    { to: "/buyer/dashboard", label: "Home", icon: Home },
    { to: "/buyer/marketplace", label: "Lots", icon: Store, highlight: true },
    { to: "/buyer/offers", label: "Offers", icon: Users },
    { to: "/buyer/orders", label: "Orders", icon: Truck },
    { to: "/buyer/profile", label: "Profile", icon: User },
  ];

  const adminNav = [
    { to: "/admin/dashboard", label: "Overview", icon: Home },
    { to: "/admin/verification", label: "KYC Queue", icon: FileCheck2, highlight: true },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  const navItems = role === "buyer" ? buyerNav : role === "admin" ? adminNav : farmerNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none active:scale-95 transition-all ${
                  isActive
                    ? "text-green-700 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.highlight ? (
                <div className="w-10 h-10 -mt-4 rounded-full bg-green-700 text-white flex items-center justify-center shadow-md border-2 border-background">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className="w-5 h-5 mb-0.5" />
              )}
              <span className={`text-[10px] ${item.highlight ? "mt-0.5 font-bold text-green-800" : "font-medium"}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
