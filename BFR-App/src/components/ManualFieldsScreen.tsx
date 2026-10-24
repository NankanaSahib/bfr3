import React, { useState } from "react";
import { Calendar, UserPlus, Image as ImageIcon, Camera, ArrowLeft, Check, Sparkles } from "lucide-react";
import { ManualFields } from "../types";

interface ManualFieldsScreenProps {
  onComplete: (fields: ManualFields) => void;
  onBack: () => void;
  pw1Name: string;
  pw2Name: string;
  pw3Name: string;
}

export default function ManualFieldsScreen({ onComplete, onBack, pw1Name, pw2Name, pw3Name }: ManualFieldsScreenProps) {
  const [fields, setFields] = useState<ManualFields>({
    evidenceDate: new Date().toISOString().split("T")[0],
    pw1PresentPosting: "",
    pw1Photo: "",
    pw2PresentPosting: "",
    pw2Photo: "",
    pw3PresentPosting: "",
    pw3Photo: "",
  });

  const handleInputChange = (field: keyof ManualFields, value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "pw1Photo" | "pw2Photo" | "pw3Photo") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleInputChange(field, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(fields);
  };

  // Pre-set default court silhouettes for photos if none are uploaded
  const useDefaultPlaceholder = (field: "pw1Photo" | "pw2Photo" | "pw3Photo") => {
    // Standard visual placeholder for professional appearance
    const placeholderUrl = "placeholder_court_seal";
    handleInputChange(field, placeholderUrl);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-extrabold tracking-tight text-slate-800">Input Present Postings & Photos</h2>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
          STEP 3 of 4
        </span>
      </div>

      <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-8">
        {/* Evidence Hearing Date */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="max-w-md">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-600" /> Date of Evidence (بیان کی تاریخ)
            </label>
            <input
              type="date"
              value={fields.evidenceDate}
              onChange={(e) => handleInputChange("evidenceDate", e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm px-3 py-2 rounded-lg outline-none font-medium text-slate-800"
              required
            />
            <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal">This date will appear in the header of all PW statements as the official record date.</p>
          </div>
        </div>

        {/* 3 Witnesses Blocks */}
        <div className="space-y-6">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <span className="h-3.5 w-1.5 bg-indigo-600 rounded-full"></span>
            Witness Current Postings & Photos (Passport Size)
          </h3>

          {/* PW1 Block */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                PW-1 • Investigating Officer
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 mt-1">{pw1Name || "Investigating Officer"}</h4>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Present Posting (حال تعینات)</label>
                <input
                  type="text"
                  value={fields.pw1PresentPosting}
                  onChange={(e) => handleInputChange("pw1PresentPosting", e.target.value)}
                  placeholder="e.g. CIA Center Gujranwala"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-xs px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
            </div>

            {/* PW1 Photo Upload */}
            <div className="md:col-span-2 flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="h-20 w-16 bg-white border border-slate-200 rounded flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {fields.pw1Photo && fields.pw1Photo !== "placeholder_court_seal" ? (
                  <img src={fields.pw1Photo} alt="PW1" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-1">
                    <Camera className="h-5 w-5 text-slate-400 mx-auto" />
                    <span className="text-[9px] text-slate-400 block mt-0.5">No Photo</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upload Passport Photo</span>
                <div className="flex gap-2">
                  <label className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-2xs font-bold px-3 py-1 rounded cursor-pointer flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-slate-500" /> Choose
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "pw1Photo")}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => useDefaultPlaceholder("pw1Photo")}
                    className={`text-2xs font-semibold px-2.5 py-1 rounded border ${
                      fields.pw1Photo === "placeholder_court_seal"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white hover:bg-slate-100 border-slate-300 text-slate-600"
                    }`}
                  >
                    Use Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PW2 Block */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                PW-2 • Moharrar (Police Clerk)
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 mt-1">{pw2Name || "Moharrar"}</h4>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Present Posting (حال تعینات)</label>
                <input
                  type="text"
                  value={fields.pw2PresentPosting}
                  onChange={(e) => handleInputChange("pw2PresentPosting", e.target.value)}
                  placeholder="e.g. Thana Faisal Town Lahore"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-xs px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
            </div>

            {/* PW2 Photo Upload */}
            <div className="md:col-span-2 flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="h-20 w-16 bg-white border border-slate-200 rounded flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {fields.pw2Photo && fields.pw2Photo !== "placeholder_court_seal" ? (
                  <img src={fields.pw2Photo} alt="PW2" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-1">
                    <Camera className="h-5 w-5 text-slate-400 mx-auto" />
                    <span className="text-[9px] text-slate-400 block mt-0.5">No Photo</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upload Passport Photo</span>
                <div className="flex gap-2">
                  <label className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-2xs font-bold px-3 py-1 rounded cursor-pointer flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-slate-500" /> Choose
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "pw2Photo")}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => useDefaultPlaceholder("pw2Photo")}
                    className={`text-2xs font-semibold px-2.5 py-1 rounded border ${
                      fields.pw2Photo === "placeholder_court_seal"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white hover:bg-slate-100 border-slate-300 text-slate-600"
                    }`}
                  >
                    Use Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PW3 Block */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                PW-3 • Recovery Witness
              </span>
              <h4 className="text-sm font-extrabold text-slate-800 mt-1">{pw3Name || "Witness 1"}</h4>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Present Posting (حال تعینات)</label>
                <input
                  type="text"
                  value={fields.pw3PresentPosting}
                  onChange={(e) => handleInputChange("pw3PresentPosting", e.target.value)}
                  placeholder="e.g. Police Lines Gujranwala"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-xs px-3 py-1.5 rounded-md outline-none"
                  required
                />
              </div>
            </div>

            {/* PW3 Photo Upload */}
            <div className="md:col-span-2 flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="h-20 w-16 bg-white border border-slate-200 rounded flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {fields.pw3Photo && fields.pw3Photo !== "placeholder_court_seal" ? (
                  <img src={fields.pw3Photo} alt="PW3" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-1">
                    <Camera className="h-5 w-5 text-slate-400 mx-auto" />
                    <span className="text-[9px] text-slate-400 block mt-0.5">No Photo</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upload Passport Photo</span>
                <div className="flex gap-2">
                  <label className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-2xs font-bold px-3 py-1 rounded cursor-pointer flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-slate-500" /> Choose
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "pw3Photo")}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => useDefaultPlaceholder("pw3Photo")}
                    className={`text-2xs font-semibold px-2.5 py-1 rounded border ${
                      fields.pw3Photo === "placeholder_court_seal"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white hover:bg-slate-100 border-slate-300 text-slate-600"
                    }`}
                  >
                    Use Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-slate-200 pt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            ← Back to Parameter Review
          </button>

          <button
            type="submit"
            style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Generate Evidences & Statement u/s 342 <Check className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
