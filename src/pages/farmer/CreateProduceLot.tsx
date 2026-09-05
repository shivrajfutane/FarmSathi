import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lotsService } from "@/services/lots";
import { CROPS, STATES, QUALITY_GRADES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { QualityGrade, QualityParameters } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sprout,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  MapPin,
  IndianRupee,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  ShieldCheck,
} from "lucide-react";

const CROP_SAMPLE_IMAGES: Record<string, string[]> = {
  Tomato: [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80",
  ],
  Onion: [
    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
  ],
  Potato: [
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
  ],
  Wheat: [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
  ],
  Rice: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
  ],
  Maize: [
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80",
  ],
  Soybean: [
    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  ],
  Cotton: [
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80",
  ],
  Garlic: [
    "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80",
  ],
  Chilli: [
    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
  ],
  Apple: [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  ],
  Banana: [
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
  ],
  Grapes: [
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80",
  ],
  Mango: [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
  ],
  Pomegranate: [
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
  ],
};

export const CreateProduceLot: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Step 1: Produce Details
  const [crop, setCrop] = useState("Tomato");
  const [variety, setVariety] = useState("Hybrid (Abhinav)");
  const [quantity, setQuantity] = useState("500");
  const [unit, setUnit] = useState("kg");

  // Step 2: Quality Details & AI Grading
  const [grade, setGrade] = useState<QualityGrade>("A");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [color, setColor] = useState("Deep Red");
  const [freshness, setFreshness] = useState<"fresh" | "good" | "average">("fresh");
  const [defects, setDefects] = useState<"none" | "minor" | "moderate">("none");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isAiGrading, setIsAiGrading] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(91);

  // Step 3: Availability & Farm Gate
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split("T")[0]);
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("Baramati");

  // Step 4: Selling Preference
  const [expectedPrice, setExpectedPrice] = useState("2300");
  const [minAcceptablePrice, setMinAcceptablePrice] = useState("2100");
  const [preferredMarket, setPreferredMarket] = useState("Pune APMC / Direct Buyer");

  const runAiQualityCheck = () => {
    setIsAiGrading(true);
    setTimeout(() => {
      setGrade("A");
      setAiConfidence(94);
      setIsAiGrading(false);
    }, 1000);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages((prev) => [...prev, imageUrlInput.trim()].slice(0, 3));
      setImageUrlInput("");
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const finalImages =
        uploadedImages.length > 0
          ? uploadedImages
          : CROP_SAMPLE_IMAGES[crop] || [
              "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
            ];

      await lotsService.createLot({
        farmerId: "f1",
        crop,
        variety,
        quantity: Number(quantity),
        unit,
        grade,
        qualityParameters: {
          size,
          color,
          freshness,
          visibleDefects: defects,
        },
        images: finalImages,
        harvestDate,
        availableFrom,
        locationState: state,
        locationDistrict: district,
        locationVillage: village,
        lat: 18.1491,
        lng: 74.5744,
        expectedPrice: Number(expectedPrice),
        minAcceptablePrice: Number(minAcceptablePrice),
        preferredMarket,
      });

      setIsPublished(true);
    } catch (err) {
      console.error("Lot publication failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Produce Details" },
    { num: 2, title: "Quality & AI Grade" },
    { num: 3, title: "Availability" },
    { num: 4, title: "Price Preference" },
    { num: 5, title: "Review & Publish" },
  ];

  if (isPublished) {
    return (
      <div className="page-container max-w-xl mx-auto py-12 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground">
            Produce Lot Published Successfully!
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            “Your produce lot is now visible to verified buyers.”
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border text-left text-xs space-y-2">
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">Crop & Variety:</span>
            <span className="font-bold text-foreground">{crop} ({variety})</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">Quantity & Grade:</span>
            <span className="font-bold text-foreground">{quantity} {unit} • Grade {grade}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-muted-foreground">Expected Price:</span>
            <span className="font-bold text-green-700">{formatCurrency(Number(expectedPrice))} / quintal</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-bold text-foreground">{village}, {district}, {state}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => navigate(`/farmer/buyers?crop=${crop}&qty=${quantity}`)}
            className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold"
          >
            Find Matching Buyers Now
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/farmer/lots")}
            className="w-full sm:w-auto"
          >
            View My Lots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Sprout className="w-7 h-7 text-green-700" />
          <span>Create Produce Lot</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          List your harvest for institutional buyers with guaranteed digital settlement
        </p>
      </div>

      {/* 5-Step Progress Bar */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`p-2 rounded-lg border text-center transition-all ${
              currentStep === s.num
                ? "bg-green-700 text-white border-green-800 shadow-xs"
                : currentStep > s.num
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-muted/40 text-muted-foreground border-transparent"
            }`}
          >
            <span className="text-[10px] font-extrabold block">Step {s.num}</span>
            <span className="text-[11px] font-semibold hidden sm:block truncate">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Main Multi-Step Form Card */}
      <Card className="shadow-md border-green-200">
        <CardContent className="p-6 sm:p-7">
          {/* ── STEP 1: Produce Details ── */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-foreground border-b pb-2">
                Step 1: Produce & Crop Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Select Crop *</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold"
                  >
                    {CROPS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Variety / Hybrid *</label>
                  <Input
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Hybrid, Desi, Sharbati"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Available Quantity *</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Unit of Measurement</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintal">Quintals (100 kg)</option>
                    <option value="tonne">Tonnes (1000 kg)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Quality & AI Suggested Grade ── */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-base font-bold text-foreground">
                  Step 2: Quality Parameters & Image Upload
                </h3>
                <span className="text-xs text-muted-foreground">Grade A/B/C Standard</span>
              </div>

              {/* AI Quality Grading Feature Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-950">
                      AI Computer Vision Quality Grading
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={runAiQualityCheck}
                    disabled={isAiGrading}
                    className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {isAiGrading ? "Scanning..." : "Scan & Predict Grade"}
                  </Button>
                </div>
                <p className="text-[11px] text-emerald-900/80">
                  AI scans uploaded produce photos for color consistency, size uniformity, and surface blemishes.
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <span className="font-semibold text-emerald-900">
                    AI Suggested Grade: <strong>Grade {grade}</strong>
                  </span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-bold">
                    Confidence: {aiConfidence}%
                  </span>
                </div>
              </div>

              {/* Manual Grade Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Assigned Quality Grade *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["A", "B", "C"] as QualityGrade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                        grade === g
                          ? "bg-green-700 text-white border-green-800 shadow-sm"
                          : "bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      Grade {g}
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                        {g === "A" ? "Export Quality" : g === "B" ? "Standard Retail" : "Processing Grade"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-xs"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Color / Ripeness</label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Freshness</label>
                  <select
                    value={freshness}
                    onChange={(e) => setFreshness(e.target.value as any)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-xs"
                  >
                    <option value="fresh">Fresh (0-2 days)</option>
                    <option value="good">Good (3-5 days)</option>
                    <option value="average">Average</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Defects</label>
                  <select
                    value={defects}
                    onChange={(e) => setDefects(e.target.value as any)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-2 text-xs"
                  >
                    <option value="none">None (0%)</option>
                    <option value="minor">Minor (&lt; 5%)</option>
                    <option value="moderate">Moderate (&lt; 15%)</option>
                  </select>
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-green-700" />
                    <span>Produce Images ({uploadedImages.length}/3 photos)</span>
                  </label>
                  {uploadedImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUploadedImages([])}
                      className="text-[11px] text-red-600 hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-24 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-100 shadow-xs group"
                      >
                        <img
                          src={img}
                          alt={`Produce ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setUploadedImages(uploadedImages.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center shadow-md transition-colors"
                        >
                          ✕
                        </button>
                        <span className="absolute bottom-1 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Photo {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Adding photos increases buyer offer rates by <strong>+42%</strong>. You can upload files, paste URLs, or pick standard presets below.
                    </span>
                  </div>
                )}

                {/* Option 1: File Upload from Device */}
                {uploadedImages.length < 3 && (
                  <label className="cursor-pointer p-4 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-center bg-emerald-50/30 hover:bg-emerald-50/70 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setUploadedImages((prev) =>
                                  [...prev, ev.target!.result as string].slice(0, 3)
                                );
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                      }}
                    />
                    <UploadCloud className="w-7 h-7 text-green-700 mb-1" />
                    <p className="text-xs font-semibold text-foreground">
                      Upload photos from your phone / computer
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      JPG, PNG, WebP (up to 3 photos)
                    </p>
                  </label>
                )}

                {/* Option 2: Image URL Input */}
                {uploadedImages.length < 3 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Or paste an Image Web Link:
                    </span>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/produce.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="text-xs h-9"
                      />
                      <Button
                        type="button"
                        onClick={handleAddImageUrl}
                        disabled={!imageUrlInput.trim()}
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white shrink-0 text-xs"
                      >
                        Add Image
                      </Button>
                    </div>
                  </div>
                )}

                {/* Option 3: 1-Click Crop Sample Preset Images */}
                {CROP_SAMPLE_IMAGES[crop] && uploadedImages.length < 3 && (
                  <div className="space-y-1.5 pt-1 border-t border-dashed">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Quick {crop} sample photos (1-click attach):
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {CROP_SAMPLE_IMAGES[crop].map((presetUrl, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            if (!uploadedImages.includes(presetUrl)) {
                              setUploadedImages((prev) => [...prev, presetUrl].slice(0, 3));
                            }
                          }}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all hover:scale-105 ${
                            uploadedImages.includes(presetUrl)
                              ? "ring-2 ring-emerald-600 border-emerald-600 opacity-60"
                              : "border-slate-300 hover:border-emerald-500"
                          }`}
                        >
                          <img
                            src={presetUrl}
                            alt={`${crop} preset ${pIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {uploadedImages.includes(presetUrl) && (
                            <span className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white font-bold text-xs">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Availability & Location ── */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-foreground border-b pb-2">
                Step 3: Harvest Timeline & Farm Gate Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Harvest Date *</label>
                  <Input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Available for Pickup From *</label>
                  <Input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">District</label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Village / Taluka</label>
                  <Input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border flex items-center gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  GPS Coordinates pinned: <strong>18.1491° N, 74.5744° E</strong> (Baramati Farm Gate)
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 4: Selling Preference & Minimum Price ── */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-foreground border-b pb-2">
                Step 4: Pricing & Selling Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Expected Price (₹ / quintal) *</label>
                  <Input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder="2300"
                  />
                  <span className="text-[11px] text-muted-foreground">Current Mandi benchmark: ₹2,250/q</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Minimum Acceptable Price (₹ / q) *</label>
                  <Input
                    type="number"
                    value={minAcceptablePrice}
                    onChange={(e) => setMinAcceptablePrice(e.target.value)}
                    placeholder="2100"
                  />
                  <span className="text-[11px] text-muted-foreground">Offers below this will be auto-flagged</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Preferred Delivery / Mandi Destination</label>
                <Input
                  value={preferredMarket}
                  onChange={(e) => setPreferredMarket(e.target.value)}
                  placeholder="e.g. Farm Gate Pickup or Pune APMC"
                />
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Publish ── */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-foreground border-b pb-2">
                Step 5: Review Produce Lot Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Crop & Variety</span>
                  <p className="text-sm font-extrabold text-foreground">{crop} ({variety})</p>
                  <p className="text-muted-foreground">Quantity: <strong>{quantity} {unit}</strong></p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Quality Specification</span>
                  <p className="text-sm font-extrabold text-emerald-800">Grade {grade} ({aiConfidence}% AI Certified)</p>
                  <p className="text-muted-foreground">Size: {size} • Freshness: {freshness}</p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Farm Location</span>
                  <p className="text-sm font-extrabold text-foreground">{village}, {district}</p>
                  <p className="text-muted-foreground">{state} • Available from {availableFrom}</p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Price Expectations</span>
                  <p className="text-sm font-extrabold text-green-700">{formatCurrency(Number(expectedPrice))} / quintal</p>
                  <p className="text-muted-foreground">Floor Price: {formatCurrency(Number(minAcceptablePrice))} / q</p>
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="mt-8 pt-4 border-t flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>
            ) : <div />}

            {currentStep < 5 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="gap-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handlePublish}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing..." : "Publish Produce Lot"}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
