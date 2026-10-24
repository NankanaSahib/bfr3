import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { analyzeFirWithGemini } from "./src/utils/firAnalysis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.BFR_PORT) || 3000;
// Desktop app sets BFR_HOST=127.0.0.1 so the server is reachable only from this computer.
const HOST = process.env.BFR_HOST || "0.0.0.0";

// ---- Local settings store (used by the Windows desktop app to keep the Gemini API key) ----
const DATA_DIR = process.env.BFR_DATA_DIR || process.cwd();
const CONFIG_FILE = path.join(DATA_DIR, "bfr-config.json");

type LocalConfig = { geminiApiKey?: string };

function readConfig(): LocalConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) as LocalConfig;
  } catch {
    return {};
  }
}

function writeConfig(cfg: LocalConfig) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), { encoding: "utf8", mode: 0o600 });
}

function getApiKey(): string {
  const saved = (readConfig().geminiApiKey || "").trim();
  if (saved) return saved;
  const fromEnv = (process.env.GEMINI_API_KEY || "").trim();
  return fromEnv && fromEnv !== "MY_GEMINI_API_KEY" ? fromEnv : "";
}

// Set up JSON body parser with generous size limit for uploaded base64 PDFs and images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = getApiKey();
    if (!key) {
      throw new Error("Gemini API key is not set. Click the \"API Key\" button at the top right of the app and paste your key.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

import { proofreadFIRData, proofreadUrduText } from "./src/utils/urduProofreader";

// REST API endpoint to analyze Urdu FIR
app.post("/api/analyze-fir", async (req, res) => {
  try {
    const { fileData, mimeType } = req.body;

    if (!fileData || !mimeType) {
      res.status(400).json({ error: "Missing fileData (base64) or mimeType parameters" });
      return;
    }

    const ai = getGeminiClient();

    const parsedData = await analyzeFirWithGemini(ai, fileData, mimeType);
    
    // Dedicated Post-Processing Linguistic Proofreading Step
    const proofreadData = proofreadFIRData(parsedData);
    res.json(proofreadData);
  } catch (error: any) {
    console.error("Error during FIR analysis:", error);
    res.status(500).json({ error: error.message || "An error occurred during processing." });
  }
});

// Dedicated REST API endpoint for Urdu text proofreading
app.post("/api/proofread-urdu", (req, res) => {
  try {
    const { text } = req.body;
    if (typeof text !== "string") {
      res.status(400).json({ error: "Missing or invalid 'text' property in body" });
      return;
    }
    const corrected = proofreadUrduText(text);
    res.json({ original: text, corrected });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Proofreading failed" });
  }
});

// ---- Settings endpoints (API key management) ----
const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
const isLocalRequest = (req: express.Request) => LOOPBACK.has(req.socket.remoteAddress || "");

app.get("/api/settings", (_req, res) => {
  const key = getApiKey();
  res.json({ hasApiKey: !!key, keyHint: key ? `\u2022\u2022\u2022\u2022${key.slice(-4)}` : "" });
});

app.post("/api/settings", (req, res) => {
  if (!isLocalRequest(req)) {
    res.status(403).json({ error: "Settings can only be changed from this computer." });
    return;
  }
  const raw = typeof req.body?.apiKey === "string" ? req.body.apiKey : "";
  const apiKey = raw.trim().replace(/^["']|["']$/g, "");
  if (apiKey.length < 20 || /\s/.test(apiKey)) {
    res.status(400).json({ error: "That does not look like a valid Gemini API key." });
    return;
  }
  try {
    writeConfig({ ...readConfig(), geminiApiKey: apiKey });
    aiClient = null; // force a new client with the new key
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Could not save the API key." });
  }
});

app.delete("/api/settings", (req, res) => {
  if (!isLocalRequest(req)) {
    res.status(403).json({ error: "Settings can only be changed from this computer." });
    return;
  }
  try {
    const cfg = readConfig();
    delete cfg.geminiApiKey;
    writeConfig(cfg);
    aiClient = null;
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Could not remove the API key." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = process.env.BFR_DIST_DIR || path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, HOST, () => {
    console.log(`BFR Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
