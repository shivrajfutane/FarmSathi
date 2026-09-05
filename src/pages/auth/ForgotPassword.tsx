import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ArrowLeft, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setError("");
    setIsLoading(true);
    try {
      await resetPassword(identifier);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-amber-50/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-800 text-white shadow-md">
            <Sprout className="w-7 h-7 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account Recovery
          </h1>
          <p className="text-xs text-muted-foreground">
            Reset your password via verified Email or SMS OTP
          </p>
        </div>

        <Card className="shadow-lg border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Reset Password</CardTitle>
            <CardDescription>
              Enter the registered email address or mobile number associated with your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-3 mb-4 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSubmitted ? (
              <div className="text-center space-y-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">Recovery Link Dispatched</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  We have dispatched a secure password reset link to{" "}
                  <strong>{identifier}</strong>. Please check your inbox or spam folder.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                >
                  Send Another Link
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    Registered Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ravi.kumar@example.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    "Send Password Reset Link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
            <Link
              to="/login"
              className="text-green-700 hover:underline font-bold inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
