import React, { useState } from "react";
import { mockFarmer, mockBuyer, mockBuyers } from "@/mock/data";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Sprout, ShoppingBag, ShieldCheck, MapPin } from "lucide-react";

export const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const allUsers = [
    {
      id: "u1",
      name: "Ravi Kumar",
      entity: "Ravi Kumar Farm",
      role: "farmer",
      location: "Baramati, Pune, MH",
      crops: "Tomato, Onion, Wheat",
      verified: true,
      rating: 4.8,
    },
    {
      id: "u2",
      name: "Arjun Mehta",
      entity: "ABC Foods Pvt Ltd",
      role: "buyer",
      location: "Mumbai, MH",
      crops: "Tomato, Potato, Onion",
      verified: true,
      rating: 4.8,
    },
    {
      id: "u4",
      name: "Sunita Reddy",
      entity: "Fresh Direct India",
      role: "buyer",
      location: "Pune, MH",
      crops: "Capsicum, Tomato",
      verified: true,
      rating: 4.5,
    },
    {
      id: "u7",
      name: "Suresh Patil",
      entity: "Sahyadri Farmers Producer Co.",
      role: "fpo",
      location: "Nashik, MH",
      crops: "Grapes, Onion, Tomato",
      verified: true,
      rating: 4.9,
    },
  ];

  const filtered = allUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (searchTerm && !u.name.toLowerCase().includes(searchTerm.toLowerCase()) && !u.entity.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-7 h-7 text-purple-600" />
          <span>Platform User Directory</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Directory of registered farmers, FPOs, and institutional buyers
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or entity..."
            className="pl-9"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
        >
          <option value="all">All Roles</option>
          <option value="farmer">Farmers</option>
          <option value="fpo">FPOs</option>
          <option value="buyer">Buyers</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((u) => (
          <Card key={u.id} className="shadow-xs p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-base text-foreground">{u.name}</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {u.role}
                  </span>
                  <VerifiedBadge type={u.role as any} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{u.entity}</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 p-2.5 rounded-lg bg-muted/30">
              <p className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{u.location}</span>
              </p>
              <p>Key Commodities: <strong className="text-foreground">{u.crops}</strong></p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
