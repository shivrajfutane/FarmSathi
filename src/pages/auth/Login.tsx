import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ShoppingBag, ShieldCheck, ArrowRight, Lock, Mail, Loader2, Sparkles } from "lucide-react";

export const Login: React.FC = () => {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("ravi.kumar@example.com");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password, role: selectedRole });
      if (selectedRole === "buyer") navigate("/buyer/dashboard");
      else if (selectedRole === "admin") navigate("/admin/dashboard");
      else navigate("/farmer/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(selectedRole);
    } catch (err: any) {
      setError(err?.message || "Google Sign In could not be initialized");
      setIsGoogleLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "farmer") setEmail("ravi.kumar@example.com");
    else if (role === "buyer") setEmail("abc.foods@example.com");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-emerald-50/40 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-green-200 shadow-md p-1 mx-auto group-hover:scale-105 transition-transform">
              <img src="/logo-icon.png" alt="FarmSathi Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Farm<span className="text-green-700">Sathi</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            National Farmer Market Linkage & Price Discovery Platform
          </p>
        </div>

        {/* Quick Role Selection for Live Juries / Demos */}
        <div className="p-3 rounded-xl bg-card border shadow-xs space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span>Select Portal Role</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect("farmer")}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                selectedRole === "farmer"
                  ? "bg-green-50 border-green-600 text-green-800 shadow-xs ring-1 ring-green-600"
                  : "bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Farmer / FPO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect("buyer")}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                selectedRole === "buyer"
                  ? "bg-green-50 border-green-600 text-green-800 shadow-xs ring-1 ring-green-600"
                  : "bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-green-700" />
              <span>Buyer</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-green-100">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Access market prices, trade lots, and smart buyer matches
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Google OAuth Login Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignIn}
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
                  ? "Connecting to Google..."
                  : `Continue with Google as ${selectedRole.toUpperCase()}`}
              </span>
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Or with email credentials
                </span>
              </div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-green-700 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 h-11"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 hover:underline font-bold ml-1"
            >
              Register as Farmer or Buyer
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
