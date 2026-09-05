import React, { useState, useEffect } from "react";
import { ordersService } from "@/services/orders";
import { paymentsService } from "@/services/payments";
import { MapComponent } from "@/components/shared/MapComponent";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, Logistics, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle2, IndianRupee, ShieldCheck, MapPin, PackageCheck } from "lucide-react";

export const BuyerOrders: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [logistics, setLogistics] = useState<Logistics | null>(null);
  const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
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
        console.error("Buyer orders fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const handleConfirmDelivery = async () => {
    if (!order) return;
    await ordersService.updateOrderStatus(order.id, "delivered");
    await paymentsService.releasePayment("pay1");
    setOrder((prev) => (prev ? { ...prev, status: "delivered" } : null));
    setIsDeliveryConfirmed(true);
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Truck className="w-7 h-7 text-green-700" />
            <span>Buyer Consignments & Inbound Freight</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor GPS transit to your hub, inspect quality upon arrival & release escrow payment
          </p>
        </div>

        {order?.status !== "delivered" && order?.status !== "payment_released" && (
          <Button
            onClick={handleConfirmDelivery}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-xs text-xs"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Confirm Delivery & Release Escrow</span>
          </Button>
        )}
      </div>

      {isDeliveryConfirmed && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Delivery successfully confirmed! Escrow funds (₹10,432) have been released to the farmer's bank account.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-xs overflow-hidden border-slate-700">
            <CardHeader className="pb-3 bg-slate-900 text-white">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Consignment GPS Track</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapComponent height="380px" showRoute={true} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-xs border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-700" />
                <span>Escrow Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Value:</span>
                  <strong className="text-foreground">₹11,750</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Freight & Insurance:</span>
                  <strong className="text-foreground">₹1,200</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <StatusBadge status={order?.status || "in_transit"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
