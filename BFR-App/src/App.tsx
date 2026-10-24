import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ReviewScreen from "./components/ReviewScreen";
import ManualFieldsScreen from "./components/ManualFieldsScreen";
import GeneratedEvidenceScreen from "./components/GeneratedEvidenceScreen";
import ApiKeySettings from "./components/ApiKeySettings";
import { getSettings } from "./utils/backend";
import { FIRData, ManualFields } from "./types";
import { AlertCircle, Scale, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

type AppStep = "upload" | "review" | "manual" | "generate";

export default function App() {
  const [step, setStep] = useState<AppStep>("upload");
  const [firData, setFirData] = useState<FIRData | null>(null);
  const [manualFields, setManualFields] = useState<ManualFields | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [keyHint, setKeyHint] = useState("");

  const refreshSettings = async (): Promise<boolean | null> => {
    try {
      const info = await getSettings();
      setHasApiKey(info.hasApiKey);
      setKeyHint(info.keyHint);
      return info.hasApiKey;
    } catch {
      setHasApiKey(null);
      return null;
    }
  };

  // On first launch, ask for the Gemini API key if none is saved yet.
  useEffect(() => {
    refreshSettings().then((has) => {
      if (has === false) setShowSettings(true);
    });
  }, []);

  const handleAnalysisComplete = (data: FIRData) => {
    setErrorMessage(null);
    setFirData(data);
    setStep("review");
  };

  const handleReviewContinue = (updatedData: FIRData) => {
    setFirData(updatedData);
    setStep("manual");
  };

  const handleManualFieldsComplete = (fields: ManualFields) => {
    setManualFields(fields);
    setStep("generate");
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
  };

  const handleReset = () => {
    setStep("upload");
    setFirData(null);
    setManualFields(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* App Header (Hidden during printing) */}
      <div className="no-print">
        <Header onOpenSettings={() => setShowSettings(true)} hasApiKey={hasApiKey} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
        {/* Error banner (Hidden during printing) */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 no-print shadow-xs">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Error Processing Document:</span> {errorMessage}
            </div>
          </div>
        )}

        {/* Step Rendering */}
        <div className="transition-all duration-300">
          {step === "upload" && (
            <UploadSection
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
            />
          )}

          {step === "review" && firData && (
            <ReviewScreen
              data={firData}
              onContinue={handleReviewContinue}
              onBack={handleReset}
            />
          )}

          {step === "manual" && firData && (
            <ManualFieldsScreen
              onComplete={handleManualFieldsComplete}
              onBack={() => setStep("review")}
              pw1Name={firData.ioName}
              pw2Name={firData.moharrarName || "Moharrar Thana"}
              pw3Name={firData.witness1Name}
            />
          )}

          {step === "generate" && firData && manualFields && (
            <GeneratedEvidenceScreen
              data={firData}
              fields={manualFields}
              onBack={() => setStep("manual")}
            />
          )}
        </div>
      </main>

      <ApiKeySettings
        open={showSettings}
        hasKey={!!hasApiKey}
        keyHint={keyHint}
        onClose={() => setShowSettings(false)}
        onSaved={() => {
          setErrorMessage(null);
          refreshSettings();
        }}
      />

      {/* Footer (Hidden during printing) */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            &copy; 2026 BFR Legal Assistant. Specially calibrated for trial courts in Punjab, Pakistan.
          </p>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>SEC 3/4 PROHIBITION ORDER, 1979</span>
            <span>•</span>
            <span>VER: 1.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
