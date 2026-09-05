import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  Tag,
  Truck,
  IndianRupee,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case "offer_received":
      case "offer_accepted":
        return <Tag className="w-5 h-5 text-green-700" />;
      case "pickup_scheduled":
        return <Truck className="w-5 h-5 text-green-700" />;
      case "payment_released":
        return <IndianRupee className="w-5 h-5 text-emerald-700" />;
      case "lot_matched":
      case "price_alert":
        return <Sparkles className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleNavigate = (id: string, relatedType?: string) => {
    markAsRead(id);
    if (relatedType === "offer") navigate("/farmer/offers");
    else if (relatedType === "order") navigate("/farmer/orders");
    else if (relatedType === "lot") navigate("/farmer/market");
    else if (relatedType === "payment") navigate("/farmer/payments");
  };

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="w-7 h-7 text-green-700" />
            <span>Notification & Alert Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Realtime updates for buyer bids, price fluctuations & freight milestones
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead()}
          className="text-xs gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            onClick={() => handleNavigate(notif.id, notif.relatedType)}
            className={`shadow-xs cursor-pointer hover:border-green-300 transition-all ${
              !notif.isRead ? "border-green-200 bg-green-50/30" : "bg-card"
            }`}
          >
            <CardContent className="p-4 sm:p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-background border shrink-0 mt-0.5 shadow-2xs">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-foreground">{notif.title}</h4>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0 mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
