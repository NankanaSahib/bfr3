import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, X } from "lucide-react";
import { saveApiKey, removeApiKey } from "../utils/backend";

interface ApiKeySettingsProps {
  open: boolean;
  hasKey: boolean;
  keyHint: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function ApiKeySettings({ open, hasKey, keyHint, onClose, onSaved }: ApiKeySettingsProps) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await saveApiKey(value);
      setValue("");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Could not save the API key.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setError(null);
    setSaving(true);
    try {
      await removeApiKey();
      onSaved();
    } catch (err: any) {
      setError(err.message || "Could not remove the API key.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 no-print">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-extrabold tracking-tight text-slate-800">Gemini API Key</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            The app reads FIRs with Google Gemini, so it needs your own API key. Get a free key at{" "}
            <span className="font-semibold text-indigo-700">aistudio.google.com/apikey</span>, then paste it below.
            The key is saved only on this device.
          </p>

          {hasKey && (
            <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-3 py-2 font-medium">
              A key is currently saved ({keyHint}). Paste a new one to replace it.
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="AIza..."
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-sm pl-3 pr-10 py-2 rounded-lg outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={show ? "Hide key" : "Show key"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2">{error}</div>
          )}

          <div className="flex items-center justify-between pt-2">
            {hasKey ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={saving}
                className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove saved key
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || value.trim().length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
              >
                {saving ? "Saving..." : "Save Key"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
