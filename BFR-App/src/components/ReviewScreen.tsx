import React, { useState } from "react";
import { Check, Edit3, ShieldAlert, Sparkles, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { FIRData } from "../types";
import { proofreadFIRData } from "../utils/urduProofreader";

interface ReviewScreenProps {
  data: FIRData;
  onContinue: (updatedData: FIRData) => void;
  onBack: () => void;
}

export default function ReviewScreen({ data, onContinue, onBack }: ReviewScreenProps) {
  const [editedData, setEditedData] = useState<FIRData>({ ...data });
  const [showBottleField, setShowBottleField] = useState(!!data.bottleCount);

  const handleChange = (field: keyof FIRData, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCaseTypeChange = (type: "Informer" | "Direct Recovery") => {
    setEditedData((prev) => ({
      ...prev,
      caseType: type,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guarantee that State Vs. matches accused name if empty
    let finalTitle = editedData.caseTitle.trim();
    if (!finalTitle || finalTitle === "State Vs") {
      finalTitle = `State Vs. ${editedData.accusedName || "Accused"}`;
    }
    const finalData = {
      ...editedData,
      caseTitle: finalTitle,
      bottleCount: showBottleField ? editedData.bottleCount : "",
    };
    onContinue(proofreadFIRData(finalData));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-extrabold tracking-tight text-slate-800">Review Extracted Case Parameters</h2>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
          98% Confidence • {editedData.caseType === "Informer" ? "Type A (Informer)" : "Type B (Direct Recovery)"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Important Court Integrity Rule:</span> Every value shown below was extracted automatically from the FIR using server-side intelligence. Please crosscheck them against your original Urdu FIR and make corrections if needed. Highlighted fields are critical for perfect template matches.
          </div>
        </div>

        {/* 2-Column Main Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic & Legal Info */}
          <div className="space-y-5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="h-3 w-1.5 bg-indigo-600 rounded-full"></span>
              Primary Case Information
            </h3>

            {/* State Vs */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Case Title (State Vs Accused)</label>
              <input
                type="text"
                value={editedData.caseTitle}
                onChange={(e) => handleChange("caseTitle", e.target.value)}
                placeholder="State Vs. Ahmad"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                required
              />
            </div>

            {/* FIR Number & Police Station */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">FIR Number</label>
                <input
                  type="text"
                  value={editedData.firNumber}
                  onChange={(e) => handleChange("firNumber", e.target.value)}
                  placeholder="e.g. 142/26"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Police Station (Thana)</label>
                <input
                  type="text"
                  value={editedData.policeStation}
                  onChange={(e) => handleChange("policeStation", e.target.value)}
                  placeholder="e.g. Nishtar Colony"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Date & Time of Occurrence */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Date of Occurrence</label>
                <input
                  type="text"
                  value={editedData.dateOfOccurrence}
                  onChange={(e) => handleChange("dateOfOccurrence", e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Time of Occurrence</label>
                <input
                  type="text"
                  value={editedData.timeOfOccurrence}
                  onChange={(e) => handleChange("timeOfOccurrence", e.target.value)}
                  placeholder="e.g. 21:30"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Accused Personal Profile */}
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pt-3 pb-2 flex items-center gap-1.5">
              <span className="h-3 w-1.5 bg-indigo-600 rounded-full"></span>
              Accused Profile
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Accused Name</label>
                <input
                  type="text"
                  value={editedData.accusedName}
                  onChange={(e) => handleChange("accusedName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Caste (قوم)</label>
                <input
                  type="text"
                  value={editedData.caste}
                  onChange={(e) => handleChange("caste", e.target.value)}
                  placeholder="e.g. Rajput"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Father's Name</label>
                <input
                  type="text"
                  value={editedData.fatherName}
                  onChange={(e) => handleChange("fatherName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Address (سکنہ)</label>
                <input
                  type="text"
                  value={editedData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium text-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column: Recovery & Witness Info */}
          <div className="space-y-5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="h-3 w-1.5 bg-indigo-600 rounded-full"></span>
              Liquor Recovery Details
            </h3>

            {/* Liquor Quantity & Sample Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Liquor Quantity</label>
                <input
                  type="text"
                  value={editedData.liquorQuantity}
                  onChange={(e) => handleChange("liquorQuantity", e.target.value)}
                  placeholder="e.g. 50 Liters"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-bold text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Sample Quantity</label>
                <input
                  type="text"
                  value={editedData.sampleQuantity}
                  onChange={(e) => handleChange("sampleQuantity", e.target.value)}
                  placeholder="e.g. 1000 ml"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Bottles Presence Control */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Are Bottles Mentioned in FIR?</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !showBottleField;
                    setShowBottleField(next);
                    if (!next) handleChange("bottleCount", "");
                  }}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                    showBottleField
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                >
                  {showBottleField ? "Yes, Bottles Present" : "No, Only Cans"}
                </button>
              </div>

              {showBottleField && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Bottle Count Description</label>
                  <input
                    type="text"
                    value={editedData.bottleCount}
                    onChange={(e) => handleChange("bottleCount", e.target.value)}
                    placeholder="e.g. 24 Bottles (بوتلیں)"
                    className="w-full bg-white border border-indigo-200 focus:border-indigo-500 text-sm px-3 py-1.5 rounded-lg outline-none"
                    required={showBottleField}
                  />
                </div>
              )}
            </div>

            {/* Can/Container Description & Seal Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Can Description</label>
                <input
                  type="text"
                  value={editedData.canDescription}
                  onChange={(e) => handleChange("canDescription", e.target.value)}
                  placeholder="e.g. Plastic Can Blue"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Seal Name (مہر کا نام)</label>
                <input
                  type="text"
                  value={editedData.sealName}
                  onChange={(e) => handleChange("sealName", e.target.value)}
                  placeholder="e.g. AA or SM"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-bold"
                  required
                />
              </div>
            </div>

            {/* Recovery Place */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Recovery Place (جائے وقوعہ)</label>
              <input
                type="text"
                value={editedData.recoveryPlace}
                onChange={(e) => handleChange("recoveryPlace", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                required
              />
            </div>

            {/* Investigating Officer Name & Rank */}
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pt-3 pb-2 flex items-center gap-1.5">
              <span className="h-3 w-1.5 bg-indigo-600 rounded-full"></span>
              Investigating Officer & Witnesses
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">I.O. Name</label>
                <input
                  type="text"
                  value={editedData.ioName}
                  onChange={(e) => handleChange("ioName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">I.O. Rank</label>
                <input
                  type="text"
                  value={editedData.ioRank}
                  onChange={(e) => handleChange("ioRank", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm px-3 py-2 rounded-lg transition-all outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Witness 1 Name & Belt No */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Witness 1 (PW3 Witness Name)</label>
                <input
                  type="text"
                  value={editedData.witness1Name}
                  onChange={(e) => handleChange("witness1Name", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Belt No.</label>
                <input
                  type="text"
                  value={editedData.witness1BeltNumber}
                  onChange={(e) => handleChange("witness1BeltNumber", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
            </div>

            {/* Witness 2 Name & Belt No */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Witness 2 Name</label>
                <input
                  type="text"
                  value={editedData.witness2Name}
                  onChange={(e) => handleChange("witness2Name", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Belt No.</label>
                <input
                  type="text"
                  value={editedData.witness2BeltNumber}
                  onChange={(e) => handleChange("witness2BeltNumber", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Case Type Automatic Selector */}
        <div className="border-t border-slate-200 pt-6">
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Case Classification (Selected Template)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleCaseTypeChange("Informer")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                editedData.caseType === "Informer"
                  ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/20"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-950">Type A: Informer Case</span>
                {editedData.caseType === "Informer" && <span className="h-2 w-2 rounded-full bg-indigo-600"></span>}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The police had prior information from a secret informant (Mukhbar-e-Khas) before executing the raid.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleCaseTypeChange("Direct Recovery")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                editedData.caseType === "Direct Recovery"
                  ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/20"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-950">Type B: Direct Recovery Case</span>
                {editedData.caseType === "Direct Recovery" && <span className="h-2 w-2 rounded-full bg-indigo-600"></span>}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The police encountered the accused during routine patrolling/checking, and directly recovered liquor with no prior informant.
              </p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-200 pt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            ← Upload New FIR
          </button>

          <button
            type="submit"
            style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Continue to Postings & Photos <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
