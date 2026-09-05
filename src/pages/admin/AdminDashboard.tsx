import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";
import type { AdminStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  ShieldCheck,
  Users,
  Store,
  Boxes,
  IndianRupee,
  ShieldAlert,
  FileCheck2,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [txAnalytics, setTxAnalytics] = useState<any[]>([]);
  const [cropDemand, setCropDemand] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsData, txData, demandData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getTransactionAnalytics(),
          adminService.getCropDemandAnalytics(),
        ]);
        setStats(statsData);
        setTxAnalytics(txData);
        setCropDemand(demandData);
      } catch (err) {
        console.error("Admin stats failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-purple-600" />
            <span>National Agricultural Marketplace Administration</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time oversight for farmer market linkages, APMC price discovery & dispute arbitration
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/verification")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5 shadow-xs text-xs"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Review KYC Verification Queue</span>
        </Button>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <Card className="border-purple-200 bg-purple-50/40">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-purple-900 uppercase">Total Farmers</span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 mt-1">12,847</div>
            <span className="text-[10px] text-purple-700 font-medium">+184 this week</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Verified Buyers</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1">3,214</div>
            <span className="text-[10px] text-emerald-600 font-medium">96% active</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Active Lots</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1">5,632</div>
            <span className="text-[10px] text-muted-foreground">Across 42 Mandis</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Volume</span>
            <div className="text-xl sm:text-2xl font-black text-green-700 mt-1">₹28.4 Cr</div>
            <span className="text-[10px] text-emerald-700 font-medium">Direct Settlement</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Completed Orders</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1">26,102</div>
            <span className="text-[10px] text-emerald-600 font-medium">90.2% Success Rate</span>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-amber-900 uppercase">Pending Claims</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1">143</div>
            <span className="text-[10px] text-amber-700 font-medium">Under Mandi Arbitration</span>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Trend */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Direct Linkage Trade Volume (₹ Monthly)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Direct farmer-to-buyer transactions bypassing traditional commission agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={txAnalytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${(Number(val) / 10000000).toFixed(2)} Crore`, "Trade Volume"]}
                    contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crop Demand Distribution */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-700" />
              <span>Crop Demand Index by Institutional Buyers</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Aggregate purchase requests from verified food processors & exporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="crop" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(val: any) => [`${val}% of total demand`, "Demand Share"]}
                    contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="demand" fill="#15803d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
