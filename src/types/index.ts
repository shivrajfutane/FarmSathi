// ──────────────────────────────────────────────
// Core domain types for SIH26132 FarmSathi
// Keep these decoupled from UI components.
// Backend (Django REST) maps to these shapes.
// ──────────────────────────────────────────────

export type UserRole = "farmer" | "buyer" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  fullName: string;
  profilePhoto?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Farmer {
  id: string;
  userId: string;
  user: User;
  farmName: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  landHoldingAcres: number;
  primaryCrops: string[];
  isFPO: boolean;
  fpoName?: string;
  fpoRegNumber?: string;
  aadhaarNumber?: string; // masked
  bankAccountVerified: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  rating?: number;
  totalTransactions: number;
}

export interface FPO {
  id: string;
  userId: string;
  user: User;
  name: string;
  regNumber: string;
  state: string;
  district: string;
  memberCount: number;
  primaryCrops: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
}

export interface Buyer {
  id: string;
  userId: string;
  user: User;
  companyName: string;
  businessType: string;
  gstNumber?: string;
  state: string;
  district: string;
  requiredCrops: string[];
  avgPaymentDays: number;
  paymentReliabilityScore: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  rating?: number;
  totalPurchases: number;
}

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "more_info_needed";

export interface Market {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

export interface MarketPrice {
  id: string;
  crop: string;
  variety: string;
  market: Market;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
}

export interface PriceTrend {
  date: string;
  price: number;
}

export interface PriceComparison {
  market: Market;
  price: number;
  distance?: number;
}

export interface SaleWindowRecommendation {
  crop: string;
  priceTrend: "positive" | "negative" | "neutral";
  percentChange: number;
  days: number;
  recommendedAction: string;
  confidence: number;
  reasoning: string;
}

export type QualityGrade = "A" | "B" | "C";

export interface QualityParameters {
  size: "small" | "medium" | "large";
  color: string;
  freshness: "fresh" | "good" | "average";
  visibleDefects: "none" | "minor" | "moderate";
}

export interface ProduceLot {
  id: string;
  farmerId: string;
  farmer?: Farmer;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  grade: QualityGrade;
  qualityParameters: QualityParameters;
  images: string[];
  harvestDate: string;
  availableFrom: string;
  locationState: string;
  locationDistrict: string;
  locationVillage: string;
  lat?: number;
  lng?: number;
  expectedPrice: number;
  minAcceptablePrice: number;
  preferredMarket?: string;
  status: LotStatus;
  createdAt: string;
  expiresAt: string;
}

export type LotStatus =
  | "draft"
  | "published"
  | "matched"
  | "offer_accepted"
  | "in_transit"
  | "delivered"
  | "completed"
  | "expired"
  | "cancelled";

export interface Offer {
  id: string;
  lotId: string;
  lot?: ProduceLot;
  buyerId: string;
  buyer?: Buyer;
  farmerId: string;
  offeredPrice: number;
  quantity: number;
  validUntil: string;
  deliveryTerms: string;
  paymentTerms: string;
  notes?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  matchScore?: number;
  matchDetails?: MatchDetails;
}

export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "expired"
  | "cancelled";

export interface MatchDetails {
  crop: boolean;
  quantity: boolean;
  quality: boolean;
  location: "excellent" | "good" | "fair" | "poor";
  price: "excellent" | "good" | "fair" | "below";
  overall: number; // 0-100
}

export interface Order {
  id: string;
  offerId: string;
  offer?: Offer;
  farmerId: string;
  buyerId: string;
  lotId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  logistics?: Logistics;
  payment?: Payment;
}

export type OrderStatus =
  | "confirmed"
  | "transport_assigned"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "payment_released"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Logistics {
  id: string;
  orderId: string;
  transporter: string;
  transporterContact?: string;
  vehicleNumber?: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  transportCost: number;
  currentStatus: OrderStatus;
  trackingEvents: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  note?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  produceValue: number;
  transportCost: number;
  platformCharge: number;
  netAmount: number;
  status: PaymentStatus;
  paidAt?: string;
  utrNumber?: string;
  createdAt: string;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string;
  relatedType?: "lot" | "offer" | "order" | "payment" | "dispute";
  createdAt: string;
}

export type NotificationType =
  | "offer_received"
  | "offer_accepted"
  | "offer_rejected"
  | "payment_released"
  | "pickup_scheduled"
  | "lot_matched"
  | "price_alert"
  | "verification_update"
  | "dispute_update"
  | "system";

export interface Dispute {
  id: string;
  userId: string;
  orderId?: string;
  title: string;
  category: DisputeCategory;
  description: string;
  evidenceFiles: string[];
  status: DisputeStatus;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export type DisputeCategory =
  | "quality_mismatch"
  | "payment_issue"
  | "delivery_issue"
  | "price_dispute"
  | "fraud"
  | "other";

export type DisputeStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "rejected";

export interface AdminStats {
  totalFarmers: number;
  totalBuyers: number;
  totalFPOs: number;
  activeLots: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingDisputes: number;
  totalTransactionValue: number;
}

// ─── Generic API wrappers ──────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}
