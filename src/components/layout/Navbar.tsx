import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  Sprout,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  LogOut,
  User,
  PlusCircle,
  Search,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (role === "buyer") return "/buyer/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/farmer/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link
              to={getDashboardLink()}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-xs border border-green-200 bg-white group-hover:scale-105 transition-transform p-0.5">
                <img src="/logo-icon.png" alt="FarmSathi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                    Farm<span className="text-green-700">Sathi</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-900 px-1.5 py-0.5 rounded border border-green-200">
                    SIH 26132
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground hidden sm:block font-medium">
                  Farmer Market Linkage & Price Discovery
                </p>
              </div>
            </Link>
          </div>

          {/* Center Location Indicator & Live Status */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-green-700" />
              <span>Location:</span>
              <strong className="text-foreground font-semibold">
                {role === "buyer" ? "Mumbai (HQ)" : "Baramati, Pune, MH"}
              </strong>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Mandi Rates: <strong>Live</strong></span>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {role === "farmer" && (
              <Button
                onClick={() => navigate("/farmer/lots/create")}
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Lot</span>
              </Button>
            )}

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* User Profile / Status */}
            <div className="flex items-center gap-2 pl-2 border-l">
              <Link
                to={role === "farmer" ? "/farmer/profile" : role === "buyer" ? "/buyer/profile" : "/admin/dashboard"}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <UserAvatar
                  fullName={user?.fullName}
                  photoUrl={user?.profilePhoto}
                  size="w-8 h-8"
                  className="border border-green-300"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-foreground leading-tight max-w-[120px] truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {role} • Verified
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
