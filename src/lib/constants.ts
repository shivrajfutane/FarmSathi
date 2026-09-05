export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-ref.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-public-key-here";

export const API_BASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-ref.supabase.co";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "FarmSathi";

export const CROPS = [
  "Tomato",
  "Onion",
  "Potato",
  "Wheat",
  "Rice",
  "Maize",
  "Soybean",
  "Groundnut",
  "Cotton",
  "Sugarcane",
  "Cabbage",
  "Cauliflower",
  "Brinjal",
  "Capsicum",
  "Chilli",
  "Okra",
  "Pea",
  "Carrot",
  "Radish",
  "Garlic",
  "Ginger",
  "Turmeric",
  "Coriander",
  "Fenugreek",
  "Banana",
  "Mango",
  "Orange",
  "Pomegranate",
  "Grapes",
  "Apple",
];

export const STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const QUALITY_GRADES = ["A", "B", "C"] as const;

export const ORDER_STEPS: Record<string, number> = {
  confirmed: 0,
  transport_assigned: 1,
  pickup_scheduled: 2,
  picked_up: 3,
  in_transit: 4,
  delivered: 5,
  payment_released: 6,
  completed: 6,
};

export const PRICE_UNIT_OPTIONS = [
  { value: "quintal", label: "Quintal (100 kg)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "tonne", label: "Tonne (1000 kg)" },
];

export const TOKEN_KEY = "agrimarket_access";
export const REFRESH_TOKEN_KEY = "agrimarket_refresh";
