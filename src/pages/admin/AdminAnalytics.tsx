import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, TrendingUp, Sparkles, MapPin, IndianRupee } from "lucide-react";

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [cropDemand, setCropDemand] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [a, c] = await Promise.all([
        adminService.getTransactionAnalytics(),
        adminService.getCropDemandAnalytics(),
      ]);
      setAnalytics(a);
      setCropDemand(c);
    };
    load();
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-600" />
          <span>Agricultural Market Analytics & Price Realization</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Macro price trends, mandi arrival volumes, and farmer price realization delta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Farmer Price Realization Index (+14.8%)</CardTitle>
            <CardDescription className="text-xs">
              Comparison of farm gate realization via direct platform linkage vs APMC middleman deductions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropDemand}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Price Realization Delta %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Monthly Transaction Flow (₹ Cr)</CardTitle>
            <CardDescription className="text-xs">
              Cumulative digital settlement executed via automated escrow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
                  <Tooltip formatter={(val: any) => [`₹${(Number(val) / 10000000).toFixed(2)} Cr`, "Volume"]} />
                  <Line type="monotone" dataKey="value" stroke="#15803d" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
