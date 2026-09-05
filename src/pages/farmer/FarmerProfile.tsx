import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockFarmer } from "@/mock/data";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Sprout,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Award,
  Star,
  CheckCircle,
  Camera,
  Upload,
} from "lucide-react";

export const FarmerProfile: React.FC = () => {
  const { user } = useAuth();
  const farmer = mockFarmer;
  const [profilePhoto, setProfilePhoto] = React.useState<string | undefined>(
    user?.profilePhoto
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const photoUrl = ev.target.result as string;
          setProfilePhoto(photoUrl);
          const stored = localStorage.getItem("agrimarket_user");
          if (stored) {
            const u = JSON.parse(stored);
            u.profilePhoto = photoUrl;
            localStorage.setItem("agrimarket_user", JSON.stringify(u));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="border-green-200 overflow-hidden shadow-sm">
        <div className="h-28 bg-gradient-to-r from-green-800 via-forest-900 to-forest-950" />
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="relative -mt-12 group">
                <UserAvatar
                  fullName={user?.fullName}
                  photoUrl={profilePhoto || user?.profilePhoto}
                  size="w-24 h-24"
                  className="border-4 border-white shadow-lg rounded-2xl object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-green-700 hover:bg-green-800 text-white p-1.5 rounded-full shadow-md cursor-pointer border-2 border-white transition-transform group-hover:scale-110">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <Camera className="w-3.5 h-3.5" />
                </label>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {user?.fullName || "Ravi Kumar"}
                  </h2>
                  <VerifiedBadge type="farmer" />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-green-700" />
                  <span>Baramati, Pune District, Maharashtra</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>4.8 Rating (18 Transactions)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Farm Details & Government Verification Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Farm & Agronomic Info */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sprout className="w-4 h-4 text-green-700" />
              <span>Agronomic & Farm Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farm Entity Name:</span>
                <strong className="text-foreground font-semibold">{farmer.farmName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Landholding:</span>
                <strong className="text-foreground font-semibold">{farmer.landHoldingAcres} Acres</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Irrigation Type:</span>
                <strong className="text-foreground font-semibold">Drip & Borewell</strong>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                Primary Harvest Crops
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {farmer.primaryCrops.map((c) => (
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

        {/* Right: KYC & Verification Status */}
        <Card className="shadow-xs border-emerald-200 bg-emerald-50/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KYC & Direct Benefits Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Aadhaar Card:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Verified (••••-••••-4921)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">7/12 Land Record:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Government Authenticated
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bank Account:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  SBI e-Mandate Active
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-100/60 border border-emerald-300 text-emerald-950 text-[11px] leading-relaxed">
              <strong>Verified Producer Status:</strong> You are eligible for direct buyer linkage with 0% advance commission deductions under SIH 26132 guidelines.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
