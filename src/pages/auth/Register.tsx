import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { STATES } from "@/lib/constants";
import { Sprout, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

export const Register: React.FC = () => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("farmer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("");
  const [farmName, setFarmName] = useState("");
  const [landHoldingAcres, setLandHoldingAcres] = useState("5");
  const [isFPO, setIsFPO] = useState(false);
  const [fpoName, setFpoName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({
        fullName,
        email,
        phone,
        password,
        role,
        state,
        district,
        village,
        farmName: role === "farmer" ? farmName : undefined,
        landHoldingAcres: role === "farmer" ? Number(landHoldingAcres) : undefined,
        isFPO: role === "farmer" ? isFPO : undefined,
        fpoName: isFPO ? fpoName : undefined,
        companyName: role === "buyer" ? companyName : undefined,
        gstNumber: role === "buyer" ? gstNumber : undefined,
      });

      if (role === "buyer") navigate("/buyer/dashboard");
      else navigate("/farmer/dashboard");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      setError(err?.message || "Failed to initialize Google Sign Up");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-emerald-50/40 p-4 py-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-green-200 shadow-sm p-1 mx-auto group-hover:scale-105 transition-transform">
              <img src="/logo-icon.png" alt="FarmSathi Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Create a <span className="text-green-700">FarmSathi</span> Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Connect directly with verified buyers & transparent market prices
          </p>
        </div>

        {/* Role Picker Card */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`p-4 rounded-xl border text-left transition-all ${
              role === "farmer"
                ? "border-green-600 bg-green-50/70 text-green-950 shadow-xs ring-1 ring-green-600"
                : "bg-card hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sprout className="w-5 h-5 text-green-700" />
              <span className="font-bold text-sm text-foreground">Farmer / FPO</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sell crops, check mandi rates & receive buyer bids
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`p-4 rounded-xl border text-left transition-all ${
              role === "buyer"
                ? "border-green-600 bg-green-50/70 text-green-950 shadow-xs ring-1 ring-green-600"
                : "bg-card hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-green-700" />
              <span className="font-bold text-sm text-foreground">Verified Buyer</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Procure farm-gate lots, send offers & arrange logistics
            </p>
          </button>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {role === "farmer" ? "Farmer / FPO Registration" : "Institutional Buyer Registration"}
            </CardTitle>
            <CardDescription>
              {role === "farmer"
                ? "Provide your farm details to get verified for direct trade."
                : "Enter company and GST credentials for instant buyer access."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick Google Sign Up Option */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignUp}
              className="w-full gap-2.5 h-11 border-slate-300 hover:bg-slate-50 font-semibold text-slate-800 shadow-2xs"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-700" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {isGoogleLoading
                  ? "Setting up with Google..."
                  : `Quick Sign Up with Google as ${role.toUpperCase()}`}
              </span>
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Or complete manual form
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Mobile Phone No. *</label>
                  <Input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Email Address *</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Password *</label>
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>

              {/* Farmer Specific Fields */}
              {role === "farmer" && (
                <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-950">Farm / FPO Info</span>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFPO}
                        onChange={(e) => setIsFPO(e.target.checked)}
                        className="rounded text-green-700"
                      />
                      <span>Register as FPO (Farmer Producer Org)</span>
                    </label>
                  </div>

                  {isFPO ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">FPO Registered Name</label>
                      <Input
                        value={fpoName}
                        onChange={(e) => setFpoName(e.target.value)}
                        placeholder="e.g. Sahyadri Agro Farmers Producer Co."
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Farm / Land Name</label>
                        <Input
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          placeholder="e.g. Ramesh Agro Farms"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Landholding (Acres)</label>
                        <Input
                          type="number"
                          value={landHoldingAcres}
                          onChange={(e) => setLandHoldingAcres(e.target.value)}
                          placeholder="e.g. 5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Buyer Specific Fields */}
              {role === "buyer" && (
                <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-200 space-y-3">
                  <span className="text-xs font-bold text-green-950 block">Business & Trade Info</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Company / Enterprise Name</label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. ABC Agro Foods Pvt Ltd"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">GSTIN Number</label>
                      <Input
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="27AAABC1234A1Z1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">State</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">District</label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Pune"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Village / Taluka</label>
                  <Input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Baramati"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 h-11"
              >
                {isLoading ? "Creating Profile..." : "Complete Registration"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 hover:underline font-bold ml-1">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
