# 🌾 FarmSathi (फार्मसाथी)
### National Direct Farmer-to-Buyer Market Linkage & Fair Price Discovery Platform

FarmSathi is a modern, high-trust digital agricultural marketplace connecting Indian farmers, Farmer Producer Organizations (FPOs), and institutional wholesale buyers (processors, exporters, retail chains, and agribusinesses) directly to achieve fair farm-gate pricing, reduce intermediary leakages, and automate agricultural trade contracts.

---

## 🚀 Key Features

### 🚜 For Farmers & FPOs
- **Produce Lot Creation**: Catalog harvest lots with crop variety, quality grade (Grade A/B/C), quantity, moisture content, floor price, and high-resolution produce photographs.
- **Smart Buyer Matching**: Multi-criteria matching engine ranking institutional buyers by geographical proximity, historic payment reliability, and purchase history.
- **Real-Time Mandi Intelligence**: Benchmark live price trends across local APMCs with AI-driven harvest window sale recommendations ("Hold 4 Days" vs. "Sell Now").
- **Offer & Bid Management**: Review binding purchase orders, negotiate terms, accept escrow-backed contracts, or propose counter-offers.
- **Logistics & Dispatch Tracking**: Real-time dispatch manifests, carrier allocation, and live GPS route visualization.

### 🏢 For Institutional Buyers & Agribusinesses
- **Live Produce Marketplace**: Browse, filter, and procure quality-certified harvest lots across mandis and rural clusters with high-res photos and quality specs.
- **Direct Procurement Offers**: Submit binding offers with customizable delivery terms (farm-gate pickup, mandi delivery, warehouse delivery) and escrow milestones.
- **Fleet & Consignment Tracking**: Track live transit stages from harvest pickup to regional depot delivery.
- **Digital Invoicing & Escrow Settlements**: Integrated trade invoicing, digital contracts, and verifiable payout records.

---

## 🎨 Design & Visual Identity
- **Color Palette**: Rich agricultural Forest Green (`#064e3b`, `#14532d`, `#166534`), Fresh Emerald (`#059669`), and Crisp White with gentle gradients.
- **Brand Assets**: Custom vector logo and favicon depicting golden grain, emerald foliage, and sunrise prosperity.
- **Responsive Layout**: Designed for seamless usage across rural mobile devices, tablets, and desktop mandi terminals.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Custom Green Theme System
- **State & Routing**: React Router v7, Context API
- **Data & Backend**: Supabase integration with full mock data fallback (`VITE_USE_MOCK=true`)
- **Maps & Location**: Leaflet & OpenStreetMap geospatial matching
- **Charts & Intelligence**: Recharts for APMC mandi price volatility analysis

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or later
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/shivrajfutane/FarmSathi.git
cd FarmSathi

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```
Generates zero-error optimized static bundle in the `dist/` directory.

---

## 👥 Demo Access

Select your desired role directly on the **Sign In** screen:
1. **Farmer / FPO Portal**: `farmer@farmsathi.in` (Password: `demo1234`)
2. **Institutional Buyer Portal**: `buyer@farmsathi.in` (Password: `demo1234`)

---

## 📄 License
MIT License. Built for empowerment of agricultural communities and transparent farm trade.
