import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  Users,
  Truck,
  BarChart3,
  Star,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Zap,
  Globe,
  Award,
  ChevronRight,
  Quote,
  Wheat,
  ShoppingBag,
  Phone,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCounter(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, suffix, start: () => setStarted(true) };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: TrendingUp,
    title: "Live Mandi Price Discovery",
    desc: "Real-time price feeds from 2,800+ APMCs across India. Compare mandis before you harvest, not after.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Institutional Buyers",
    desc: "Every buyer undergoes FSSAI, GSTIN, and bank-account verification before accessing the marketplace.",
  },
  {
    icon: Zap,
    title: "AI Quality Grading",
    desc: "Upload produce photos and get a Grade A/B/C certification backed by computer-vision in under 30 seconds.",
  },
  {
    icon: IndianRupee,
    title: "Escrow-Protected Payments",
    desc: "Funds are held in escrow until the buyer confirms delivery. Farmers receive UTR within 24 hours of release.",
  },
  {
    icon: Truck,
    title: "Logistics Coordination",
    desc: "Integrated carrier network with live GPS tracking. Know exactly where your produce is at every milestone.",
  },
  {
    icon: BarChart3,
    title: "Smart Offer Matching",
    desc: "5-factor algorithm matches your lot to the best buyer based on crop, quantity, quality, location, and price.",
  },
];

const FARMER_STEPS = [
  {
    num: "01",
    title: "Create a Produce Lot",
    desc: "Upload photos, enter crop type, quantity, and expected price. AI grades your produce instantly.",
  },
  {
    num: "02",
    title: "Receive Verified Buyer Offers",
    desc: "Institutional buyers bid on your lot. Review, negotiate, or accept — all in one dashboard.",
  },
  {
    num: "03",
    title: "Get Paid Securely",
    desc: "Escrow holds buyer funds. Payment releases to your bank within 24 hours of confirmed delivery.",
  },
];

const BUYER_STEPS = [
  {
    num: "01",
    title: "Browse Verified Lots",
    desc: "Filter by crop, grade, district, and quantity. Every lot has AI quality certification.",
  },
  {
    num: "02",
    title: "Place & Negotiate Offers",
    desc: "Make an offer, counter-negotiate, and lock the deal directly with the farmer.",
  },
  {
    num: "03",
    title: "Arrange Logistics & Confirm",
    desc: "Coordinate pickup, track delivery live, and release payment on confirmation.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Patil",
    role: "Farmer, Nashik",
    crop: "Grapes & Onion · 12 acres",
    avatar: "RP",
    avatarColor: "bg-green-700",
    quote:
      "Pehle main mandi pe seedha jaata tha aur jo bhaav milta tha le leta tha. Ab FarmSathi pe pahle prices dekh ke decision karta hoon. Is season meri angoor ki fasal ₹2,400/quintal pe biki — mandi rate se ₹600 zyada.",
    stars: 5,
    badge: "Verified Farmer",
    badgeColor: "text-green-800 bg-green-50 border-green-200",
  },
  {
    name: "Sunita Devi",
    role: "FPO Secretary, Muzaffarpur",
    crop: "Litchi · FPO of 340 farmers",
    avatar: "SD",
    avatarColor: "bg-emerald-700",
    quote:
      "Hamara FPO 340 farmers ko represent karta hai. Pehle hum ek hi trader pe depend the. Ab platform pe 12 verified buyers hain jo directly hamare saath deal karte hain. Transparency bahut badh gayi hai — har farmer ko proper price pata chal raha hai.",
    stars: 5,
    badge: "FPO Verified",
    badgeColor: "text-green-800 bg-green-50 border-green-200",
  },
  {
    name: "Arjun Singh Chauhan",
    role: "Wheat & Soybean Farmer, Vidisha",
    crop: "Wheat · 28 acres",
    avatar: "AC",
    avatarColor: "bg-forest-800",
    quote:
      "Mujhe sabse zyada payment security pasand hai. Mera 340 quintal gehu lock hua, logistics bhi platform ne coordinate kiya, aur payment milli 18 ghante mein. Koi tension nahi ki paisa aayega ya nahi.",
    stars: 5,
    badge: "Verified Farmer",
    badgeColor: "text-green-800 bg-green-50 border-green-200",
  },
  {
    name: "Priya Narayanan",
    role: "Procurement Manager, FreshMart Retail",
    crop: "Institutional Buyer · 3 states",
    avatar: "PN",
    avatarColor: "bg-green-800",
    quote:
      "We source for 200+ stores across Karnataka and Tamil Nadu. Before FarmSathi, verifying farmer credentials took weeks. Now every lot on the platform is pre-graded and the farmer's land records are verified. Our procurement cycle went from 3 weeks to 4 days.",
    stars: 5,
    badge: "Verified Buyer",
    badgeColor: "text-emerald-900 bg-emerald-50 border-emerald-200",
  },
  {
    name: "Mohammed Yakub",
    role: "Export Trader, Bengaluru",
    crop: "Tomato & Capsicum · Export",
    avatar: "MY",
    avatarColor: "bg-emerald-800",
    quote:
      "The AI grading feature is a game changer for export. I need Grade A produce consistently, and the quality certificates from FarmSathi are now accepted by my UAE and Gulf buyers without additional inspection. Saved us ₹18 lakhs in testing costs this year.",
    stars: 5,
    badge: "Verified Buyer",
    badgeColor: "text-emerald-900 bg-emerald-50 border-emerald-200",
  },
  {
    name: "Kavitha Reddy",
    role: "Farmer, Kurnool",
    crop: "Groundnut & Chilli · 18 acres",
    avatar: "KR",
    avatarColor: "bg-green-700",
    quote:
      "Pehle middleman 20–25% le jaata tha. Platform pe direct buyer se deal karke mera margin 18% improve hua. Beti ki padhai ke liye extra ₹45,000 is season mein save kar paaye — yeh mujhe sabse zyada khushi deta hai.",
    stars: 5,
    badge: "Verified Farmer",
    badgeColor: "text-green-800 bg-green-50 border-green-200",
  },
];

const STATS = [
  { value: 38000, label: "Registered Farmers", suffix: "+", icon: Sprout },
  { value: 2800, label: "APMC Mandis Tracked", suffix: "+", icon: Globe },
  { value: 94, label: "Avg. Price Realisation", suffix: "%", icon: TrendingUp },
  { value: 120, label: "Crore in Transactions", suffix: "Cr+", icon: IndianRupee },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────
const StarRow = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<"farmer" | "buyer">("farmer");

  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif] overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-emerald-100 bg-white shadow-xs p-0.5">
              <img src="/logo-icon.png" alt="FarmSathi" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Farm<span className="text-emerald-700">Sathi</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
              SIH 26132
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-emerald-700 transition-colors">Stories</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-700 font-semibold hover:text-emerald-700">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #34d399 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #059669 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #065f46 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Smart India Hackathon 2026 · Problem SIH26132
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                Farmers deserve{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                  better prices.
                </span>
                <br />
                We make it happen.
              </h1>

              <p className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed mb-8 max-w-2xl">
                FarmSathi connects Indian farmers and FPOs directly to verified institutional buyers — with live APMC price data, AI quality grading, and escrow-protected payments. No middlemen. No surprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 h-13 text-base shadow-lg shadow-emerald-900/40 gap-2">
                    <Sprout className="w-5 h-5" />
                    I'm a Farmer / FPO
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-13 text-base gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    I'm a Buyer
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-emerald-300/70">
                {[
                  "Ministry of Agriculture approved",
                  "APMC licensed mandis",
                  "RBI-compliant escrow",
                  "No listing fee",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Featured FarmSathi Logo Showcase */}
            <div className="hidden lg:flex lg:col-span-5 justify-center">
              <div className="relative p-5 rounded-3xl bg-white shadow-2xl border border-emerald-300/30 max-w-sm w-full text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="w-full rounded-2xl overflow-hidden bg-white p-3 flex items-center justify-center">
                  <img src="/logo.png" alt="FarmSathi - Smart Farming, Stronger Tomorrow" className="w-full h-auto object-contain max-h-[320px]" />
                </div>
                <div className="mt-2 pt-2.5 border-t border-emerald-100 flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>National Agriculture Linkage Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64L1440 64L1440 20C1380 50 1260 64 1080 40C900 16 720 0 540 16C360 32 180 64 0 48L0 64Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-white py-14 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 mb-3 group-hover:bg-emerald-100 transition-colors mx-auto">
                  <stat.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value.toLocaleString("en-IN")}{stat.suffix}
                </div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything a farmer needs to sell smarter
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Built specifically for the Indian agricultural context — with regional language support, low-bandwidth optimization, and mandi integrations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-800 transition-colors">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Simple for farmers. Powerful for buyers.
            </h2>
          </div>

          {/* Role Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-xl border border-emerald-100 bg-emerald-50/50 p-1 gap-1">
              <button
                onClick={() => setActiveRole("farmer")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeRole === "farmer"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-emerald-900/70 hover:text-emerald-950"
                }`}
              >
                <Sprout className="w-4 h-4" /> Farmer / FPO
              </button>
              <button
                onClick={() => setActiveRole("buyer")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeRole === "buyer"
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-emerald-900/70 hover:text-emerald-950"
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Institutional Buyer
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(activeRole === "farmer" ? FARMER_STEPS : BUYER_STEPS).map((step, i) => (
              <div key={step.num} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent z-0" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }} />
                )}
                <div className="relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-black text-lg mb-4 shadow-sm bg-gradient-to-br from-emerald-600 to-emerald-800">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/register">
              <Button className="gap-2 font-semibold px-8 h-11 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 text-white shadow-md">
                {activeRole === "farmer" ? "Start Selling Your Produce" : "Start Sourcing on FarmSathi"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-slate-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              Farmer & Buyer Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Real people. Real results.
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              These are illustrative testimonials representing the real-world experiences of farmers and institutional buyers that FarmSathi is designed to serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-emerald-200 mb-3 flex-shrink-0" />

                {/* Stars */}
                <StarRow count={t.stars} />

                {/* Quote text */}
                <blockquote className="mt-3 text-slate-700 text-sm leading-relaxed flex-1 italic">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.crop}</div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            * Testimonials are representative personas based on real challenges faced by Indian agricultural stakeholders. Names and specific figures are illustrative.
          </p>
        </div>
      </section>

      {/* ── IMPACT STRIP ──────────────────────────────────────── */}
      <section className="py-14 bg-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "₹600–₹1,200", label: "Average extra income per quintal vs. traditional mandi", icon: IndianRupee },
              { value: "18–25%", label: "Reduction in middleman commission savings for farmers", icon: TrendingUp },
              { value: "24 hrs", label: "Average payment settlement after confirmed delivery", icon: Zap },
            ].map((item) => (
              <div key={item.label} className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700/50 mb-4 group-hover:bg-emerald-600/50 transition-colors mx-auto">
                  <item.icon className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="text-3xl font-extrabold text-white mb-2">{item.value}</div>
                <div className="text-sm text-emerald-300/80 max-w-xs mx-auto">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-emerald-200 shadow-md mb-6 p-2">
            <img src="/logo-icon.png" alt="FarmSathi" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Ready to sell smarter?
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto">
            Join thousands of farmers and FPOs already using FarmSathi to discover better prices, reach verified buyers, and receive secure payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-10 h-12 gap-2 shadow-md">
                <Sprout className="w-5 h-5" />
                Register as Farmer / FPO
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-10 h-12 gap-2">
                <ShoppingBag className="w-4 h-4" />
                Register as Buyer
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Free to register. No platform listing fee. No hidden charges.
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-emerald-100 shadow-2xs p-0.5">
                <img src="/logo-icon.png" alt="FarmSathi" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-slate-900">
                Farm<span className="text-emerald-700">Sathi</span>
              </span>
              <span className="text-xs text-slate-400">· SIH26132</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              <Link to="/login" className="hover:text-emerald-700 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-emerald-700 transition-colors">Register</Link>
              <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-emerald-700 transition-colors">Stories</a>
            </div>

            <p className="text-xs text-slate-400">
              © 2026 FarmSathi · Smart India Hackathon · SIH26132
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
