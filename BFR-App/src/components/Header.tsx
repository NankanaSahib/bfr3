import React from "react";
import { Scale, KeyRound } from "lucide-react";

interface HeaderProps {
  onOpenSettings?: () => void;
  hasApiKey?: boolean | null;
}

export default function Header({ onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm py-4 px-8 mb-6 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-lg shadow-md flex items-center justify-center">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              BFR Case Assistant
            </h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Legal Drafting System v2.4 • Punjab Trial Courts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              hasApiKey === false
                ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            API Key{hasApiKey === false ? " (required)" : ""}
          </button>
        )}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-700">SYSTEM: ONLINE</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-mono text-[10px] tracking-wide">SEC 3/4 PROHIBITION ORDER, 1979</span>
        </div>
        </div>
      </div>
    </header>
  );
}
