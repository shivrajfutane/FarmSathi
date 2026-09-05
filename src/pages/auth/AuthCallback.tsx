import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { Sprout, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";


export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const { user, token } = await authService.handleOAuthCallback();
        // Persist real Google user (includes profilePhoto from Google)
        localStorage.setItem("agrimarket_user", JSON.stringify(user));
        localStorage.setItem("agrimarket_token", token);

        setTimeout(() => {
          if (user.role === "buyer") navigate("/buyer/dashboard");
          else if (user.role === "admin") navigate("/admin/dashboard");
          else navigate("/farmer/dashboard");
        }, 800);
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setError(err?.message || "Failed to complete Google Sign In");
      }
    };

    processCallback();
  }, [navigate]);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-card border shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Authentication Error</h2>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/login")} className="w-full bg-green-700 hover:bg-green-800 text-white">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-amber-50 p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-green-200 shadow-xl text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-green-800 text-white flex items-center justify-center mx-auto shadow-md">
          <Sprout className="w-9 h-9 text-emerald-300 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">
            Authenticating with Google...
          </h2>
          <p className="text-xs text-muted-foreground">
            Verifying your Google credentials and linking your Kisan/Buyer Mandi profile.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-green-700 bg-green-50 py-2.5 px-4 rounded-xl border border-green-200">
          <Loader2 className="w-4 h-4 animate-spin text-green-700" />
          <span>Setting up secure session...</span>
        </div>
      </div>
    </div>
  );
};
