import React, { useState, useEffect } from "react";
import { ordersService } from "@/services/orders";
import { MapComponent } from "@/components/shared/MapComponent";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ORDER_STEPS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, Logistics, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  IndianRupee,
  Navigation,
  ArrowRight,
} from "lucide-react";

export const OrdersLogistics: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [logistics, setLogistics] = useState<Logistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orders = await ordersService.getOrders();
        if (orders.length > 0) {
          setOrder(orders[0]);
          const log = await ordersService.getLogisticsByOrderId(orders[0].id);
          setLogistics(log);
        }
      } catch (err) {
        console.error("Failed to load logistics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const timelineSteps: { key: OrderStatus; label: string }[] = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "transport_assigned", label: "Transport Assigned" },
    { key: "pickup_scheduled", label: "Pickup Scheduled" },
    { key: "picked_up", label: "Picked Up" },
    { key: "in_transit", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
    { key: "payment_released", label: "Payment Released" },
  ];

  const currentStepIndex = ORDER_STEPS[order?.status || "in_transit"] ?? 4;

  const handleSimulateNextStep = async () => {
    if (!order) return;
    const nextStatuses: OrderStatus[] = [
      "confirmed",
      "transport_assigned",
      "pickup_scheduled",
      "picked_up",
      "in_transit",
      "delivered",
      "payment_released",
    ];
    const nextIdx = Math.min(currentStepIndex + 1, nextStatuses.length - 1);
    const updated = await ordersService.updateOrderStatus(order.id, nextStatuses[nextIdx]);
    setOrder({ ...updated });
    if (logistics) {
      setLogistics({ ...logistics, currentStatus: nextStatuses[nextIdx] });
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Truck className="w-7 h-7 text-green-700" />
            <span>Logistics & Order Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time GPS transit tracking, dispatch milestones, and payment escrow release
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSimulateNextStep}
            size="sm"
            variant="outline"
            className="text-xs font-semibold gap-1.5 border-green-300 text-green-800 hover:bg-green-50"
          >
            <span>Advance Transit State (Demo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 7-Step Stepper Progress Bar */}
      <Card className="shadow-xs overflow-hidden border-green-200">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-thin">
            {timelineSteps.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex items-center min-w-[110px] sm:min-w-[130px] flex-1 last:flex-none">
                  <div className="flex flex-col items-center text-center w-full">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone
                          ? "bg-green-700 text-white shadow-xs"
                          : "bg-muted text-muted-foreground border"
                      } ${isCurrent ? "ring-4 ring-emerald-100 scale-110" : ""}`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-semibold leading-tight ${
                        isCurrent
                          ? "text-green-800 font-extrabold"
                          : isDone
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < timelineSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        idx < currentStepIndex ? "bg-green-600" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Interactive Route Map + Shipment Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Geospatial Route Map */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm overflow-hidden border-slate-700">
            <CardHeader className="pb-3 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Live Geospatial Transit Route</span>
                </CardTitle>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  GPS Signal Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapComponent height="380px" showRoute={true} />
            </CardContent>
          </Card>

          {/* Detailed Tracking Logs */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Milestone Event Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {logistics?.trackingEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground capitalize">
                      {evt.status.replace(/_/g, " ")} {evt.location ? `— ${evt.location}` : ""}
                    </p>
                    {evt.note && <p className="text-muted-foreground">{evt.note}</p>}
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatDate(evt.timestamp)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Transporter & Consignment Specs */}
        <div className="space-y-6">
          <Card className="shadow-xs border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-700" />
                <span>Assigned Carrier</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Logistics Partner:</span>
                  <strong className="text-foreground font-bold">{logistics?.transporter}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle Reg No:</span>
                  <strong className="text-foreground font-mono">{logistics?.vehicleNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver Helpline:</span>
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {logistics?.transporterContact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freight Cost:</span>
                  <strong className="text-foreground">{formatCurrency(logistics?.transportCost || 1200)}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                  Transit Path
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground block">Pickup Origin</span>
                      <p className="text-muted-foreground">{logistics?.pickupAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground block">Delivery Destination</span>
                      <p className="text-muted-foreground">{logistics?.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
