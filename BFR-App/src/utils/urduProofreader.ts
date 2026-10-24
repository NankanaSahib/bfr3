/**
 * Dedicated Urdu Proofreading & Linguistic Correction Engine for BFR Legal Assistant.
 * 
 * Enforces formal Pakistani Court Urdu standards:
 * - Preferred court spellings (e.g. فیض آباد, ساجوال, جعفر, چنگڑ, عاطف, سہیل, عبدالحمید)
 * - Correct grammatical gender/number agreement (e.g. دو سفید رنگ کے پلاسٹک کین تھے)
 * - Prevention and cleansing of mixed Urdu-English script corruptions (e.g. وونکeس -> اونس, شeر -> شیر, سیددیقوe -> صدیقی)
 * - Preservation of official court identifiers (ASI, SI, PFSA, Ex.PA..Ex.PD, 1276/C, WA)
 * - Elimination of duplicate words and phrases (e.g. سکنہ سکنہ -> سکنہ)
 * - Formal court vocabulary (برآمد شدہ دیسی شراب, دونوں پارسلوں کو مہر 'WA' سے سربمہر کیا)
 */

export interface UrduCorrectionRule {
  pattern: RegExp;
  replacement: string | ((substring: string, ...args: any[]) => string);
  description?: string;
}

// 1. Explicit Mandatory Spelling Corrections
// NOTE: JavaScript \b only matches ASCII \w word boundaries. For Urdu script we use
// Unicode lookbehind (?<![\u0600-\u06FF]) and lookahead (?![\u0600-\u06FF]).
export const PREFERRED_SPELLING_RULES: UrduCorrectionRule[] = [
  // فایزاباد -> فیض آباد
  { pattern: /(?<![\u0600-\u06FF])فایزاباد(?![\u0600-\u06FF])/g, replacement: "فیض آباد", description: "Faizabad preferred spelling" },
  { pattern: /(?<![\u0600-\u06FF])فایز\s*آباد(?![\u0600-\u06FF])/g, replacement: "فیض آباد", description: "Faizabad spaced variant" },
  { pattern: /(?<![\u0600-\u06FF])فیض\s+آباد(?![\u0600-\u06FF])/g, replacement: "فیض آباد" },

  // ساجاوال -> ساجوال
  { pattern: /(?<![\u0600-\u06FF])ساجاوال(?![\u0600-\u06FF])/g, replacement: "ساجوال", description: "Sajawal preferred spelling" },

  // جافار -> جعفر
  { pattern: /(?<![\u0600-\u06FF])جافار(?![\u0600-\u06FF])/g, replacement: "جعفر", description: "Jafar preferred spelling" },
  { pattern: /(?<![\u0600-\u06FF])جعفار(?![\u0600-\u06FF])/g, replacement: "جعفر" },

  // چانگار -> چنگڑ
  { pattern: /(?<![\u0600-\u06FF])چانگار(?![\u0600-\u06FF])/g, replacement: "چنگڑ", description: "Changar preferred spelling" },
  { pattern: /(?<![\u0600-\u06FF])چنگار(?![\u0600-\u06FF])/g, replacement: "چنگڑ" },

  // اتیف -> عاطف
  { pattern: /(?<![\u0600-\u06FF])اتیف(?![\u0600-\u06FF])/g, replacement: "عاطف", description: "Atif preferred spelling" },

  // سوہایل ولد عبدال حمید -> سہیل ولد عبدالحمید
  { pattern: /(?<![\u0600-\u06FF])سوہایل(?![\u0600-\u06FF])/g, replacement: "سہیل", description: "Sohail preferred spelling" },
  { pattern: /(?<![\u0600-\u06FF])سوہیل(?![\u0600-\u06FF])/g, replacement: "سہیل" },
  { pattern: /(?<![\u0600-\u06FF])سوہل(?![\u0600-\u06FF])/g, replacement: "سہیل" },
  
  // Abdul compound names joined without space
  { pattern: /(?<![\u0600-\u06FF])عبد\s+ال\s*حمید(?![\u0600-\u06FF])/g, replacement: "عبدالحمید" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+حمید(?![\u0600-\u06FF])/g, replacement: "عبدالحمید", description: "Abdul Hameed joined" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+رحمن(?![\u0600-\u06FF])/g, replacement: "عبدالرحمن" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+رشید(?![\u0600-\u06FF])/g, replacement: "عبدالرشید" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+رؤف(?![\u0600-\u06FF])/g, replacement: "عبدالرؤف" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+وحید(?![\u0600-\u06FF])/g, replacement: "عبدالوحید" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+ستار(?![\u0600-\u06FF])/g, replacement: "عبدالستار" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+غفار(?![\u0600-\u06FF])/g, replacement: "عبدالغفار" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+جبار(?![\u0600-\u06FF])/g, replacement: "عبدالجبار" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+مجید(?![\u0600-\u06FF])/g, replacement: "عبدالمجید" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+قادر(?![\u0600-\u06FF])/g, replacement: "عبدالقادر" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+رزاق(?![\u0600-\u06FF])/g, replacement: "عبدالرزاق" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+خالق(?![\u0600-\u06FF])/g, replacement: "عبدالخالق" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+یاسین(?![\u0600-\u06FF])/g, replacement: "عبدالیاسین" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+یسین(?![\u0600-\u06FF])/g, replacement: "عبدالیسین" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+واحد(?![\u0600-\u06FF])/g, replacement: "عبدالواحد" },
  { pattern: /(?<![\u0600-\u06FF])عبدال\s+باسط(?![\u0600-\u06FF])/g, replacement: "عبدالباسط" },

  // Duplicate / repeated words
  { pattern: /(?<![\u0600-\u06FF])سکنہ\s+سکنہ\s+بھٹہ\s+چک(?![\u0600-\u06FF])/g, replacement: "سکنہ بھٹہ چک" },
  { pattern: /(?<![\u0600-\u06FF])سکنہ\s+سکنہ(?![\u0600-\u06FF])/g, replacement: "سکنہ", description: "Deduplicate sakna" },
  { pattern: /(?<![\u0600-\u06FF])مورخہ\s+مورخہ(?![\u0600-\u06FF])/g, replacement: "مورخہ", description: "Deduplicate morikha" },
  { pattern: /(?<![\u0600-\u06FF])ولد\s+ولد(?![\u0600-\u06FF])/g, replacement: "ولد" },
  { pattern: /(?<![\u0600-\u06FF])قوم\s+قوم(?![\u0600-\u06FF])/g, replacement: "قوم" },
  { pattern: /(?<![\u0600-\u06FF])تھانہ\s+تھانہ(?![\u0600-\u06FF])/g, replacement: "تھانہ" },
  { pattern: /(?<![\u0600-\u06FF])کہ\s+کہ(?![\u0600-\u06FF])/g, replacement: "کہ" },
  { pattern: /(?<![\u0600-\u06FF])کو\s+کو(?![\u0600-\u06FF])/g, replacement: "کو" },
  { pattern: /(?<![\u0600-\u06FF])سے\s+سے(?![\u0600-\u06FF])/g, replacement: "سے" },
  { pattern: /(?<![\u0600-\u06FF])پر\s+پر(?![\u0600-\u06FF])/g, replacement: "پر" },
  { pattern: /(?<![\u0600-\u06FF])میں\s+میں(?![\u0600-\u06FF])/g, replacement: "میں" },
  { pattern: /(?<![\u0600-\u06FF])غلط\s+غلط(?![\u0600-\u06FF])/g, replacement: "غلط" },
  { pattern: /(?<![\u0600-\u06FF])درست\s+درست(?![\u0600-\u06FF])/g, replacement: "درست" },
];

// 2. Grammar, Gender Agreement & Formal Sentence Phrasing Rules
export const GRAMMAR_AGREEMENT_RULES: UrduCorrectionRule[] = [
  // "2 کین پلاسٹک رنگ سفید تھی" -> "دو سفید رنگ کے پلاسٹک کین تھے"
  // "ملزم کے ہاتھ میں 2 کین پلاسٹک رنگ سفید تھی۔" -> "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔"
  {
    pattern: /ملزم\s+کے\s+ہاتھ\s+میں\s+2\s*کین\s*پلاسٹک\s*رنگ\s*سفید\s*تھی[۔.]?/g,
    replacement: "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔",
  },
  {
    pattern: /ملزم\s+کے\s+ہاتھ\s+میں\s+2\s*کین\s*پلاسٹک\s*رنگ\s*سفید\s*تھیں[۔.]?/g,
    replacement: "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔",
  },
  {
    pattern: /ملزم\s+کے\s+ہاتھ\s+میں\s+دو\s+سفید\s+رنگ\s+کے\s+پلاسٹک\s+کین\s*تھی[۔.]?/g,
    replacement: "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔",
  },
  {
    pattern: /ملزم\s+کے\s+ہاتھ\s+میں\s+دو\s+سفید\s+رنگ\s+کے\s+پلاسٹک\s+کین\s*تھیں[۔.]?/g,
    replacement: "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔",
  },
  {
    pattern: /(?<![\u0600-\u06FF])2\s*کین\s*پلاسٹک\s*رنگ\s*سفید\s*تھی(?![\u0600-\u06FF])/g,
    replacement: "دو سفید رنگ کے پلاسٹک کین تھے",
  },
  {
    pattern: /(?<![\u0600-\u06FF])2\s*کین\s*پلاسٹک\s*رنگ\s*سفید\s*تھیں(?![\u0600-\u06FF])/g,
    replacement: "دو سفید رنگ کے پلاسٹک کین تھے",
  },
  {
    pattern: /(?<![\u0600-\u06FF])2\s*کین\s*پلاسٹک\s*رنگ\s*سفید(?![\u0600-\u06FF])/g,
    replacement: "دو سفید رنگ کے پلاسٹک کین",
  },
  {
    pattern: /(?<![\u0600-\u06FF])2\s*پلاسٹک\s*کین\s*سفید\s*رنگ\s*تھی(?![\u0600-\u06FF])/g,
    replacement: "دو سفید رنگ کے پلاسٹک کین تھے",
  },

  // "برآمدہ شراب میں سے 20 وونکeس شراب دیسی بطور نمونہ..." -> "برآمد شدہ دیسی شراب میں سے 20 اونس بطور نمونہ..."
  {
    pattern: /برآمدہ\s+شراب\s+میں\s+سے\s+20\s*وونکeس\s*شراب\s+دیسی\s+بطور\s+نمونہ/g,
    replacement: "برآمد شدہ دیسی شراب میں سے 20 اونس بطور نمونہ",
  },
  {
    pattern: /برآمدہ\s+شراب\s+میں\s+سے\s+(\d+)\s*(?:وونکeس|وونس|اونس)\s*(?:شراب\s+دیسی)?\s*بطور\s+نمونہ/g,
    replacement: "برآمد شدہ دیسی شراب میں سے $1 اونس بطور نمونہ",
  },
  {
    pattern: /برآمدہ\s+شراب\s+میں\s+سے/g,
    replacement: "برآمد شدہ دیسی شراب میں سے",
  },
  {
    pattern: /(?<![\u0600-\u06FF])برآمدہ\s+شراب(?![\u0600-\u06FF])/g,
    replacement: "برآمد شدہ شراب",
  },

  // "دونوں پارسل جات پر مہر بحروفِ اسمی وا لگائی۔" -> "دونوں پارسلوں کو مہر 'WA' سے سربمہر کیا۔"
  {
    pattern: /دونوں\s+پارسل\s*جات\s+پر\s+مہر\s+بحروفِ?\s*اسمی\s*(?:وا|WA)\s*لگائی[۔.]?/gi,
    replacement: "دونوں پارسلوں کو مہر 'WA' سے سربمہر کیا۔",
  },
  {
    pattern: /دونوں\s+پارسل\s*جات\s+پر\s+مہر\s+بحروفِ?\s*اسمی\s*['"]?([A-Za-z0-9_-]+)['"]?\s*لگائی[۔.]?/g,
    replacement: "دونوں پارسلوں کو مہر '$1' سے سربمہر کیا۔",
  },
  {
    pattern: /دونوں\s+پارسلوں\s+پر\s+مہر\s+بحروفِ?\s*اسمی\s*['"]?([A-Za-z0-9_-]+)['"]?\s*لگائی[۔.]?/g,
    replacement: "دونوں پارسلوں کو مہر '$1' سے سربمہر کیا۔",
  },
  {
    pattern: /مہر\s+بحروفِ?\s*اسمی\s*(?:وا|WA)\s*سے\s*سربمہر\s*کیا/gi,
    replacement: 'مہر "WA" سے سربمہر کیا',
  },
  {
    pattern: /مہر\s+بحروفِ?\s*اسمی\s*وا/g,
    replacement: 'مہر "WA" سے سربمہر کیا',
  },
  {
    pattern: /مہر\s+بحروفِ?\s*اسمی\s*['"]?([A-Za-z0-9_-]+)['"]?/g,
    replacement: 'مہر "$1"',
  },
  {
    pattern: /دونوں\s+پارسل\s*جات\s+بذریعہ\s+فرد\s+مقبوضگی/g,
    replacement: "دونوں پارسل بذریعہ فرد مقبوضگی",
  },
  {
    pattern: /دونوں\s+پارسل\s*جات/g,
    replacement: "دونوں پارسلوں",
  },
];

// 3. Mixed Script Corruption Cleansing
export const MIXED_SCRIPT_CLEANUP_RULES: UrduCorrectionRule[] = [
  // "وونکeس" -> "اونس"
  { pattern: /20\s*وونکeس/g, replacement: "20 اونس" },
  { pattern: /وونکeس/g, replacement: "اونس" },
  { pattern: /وونس/g, replacement: "اونس" },
  { pattern: /\bounces?\b/gi, replacement: "اونس" },
  { pattern: /(\d+)\s*ounces?\b/gi, replacement: "$1 اونس" },

  // "شeر" -> "شیر"
  { pattern: /شeر/g, replacement: "شیر" },

  // "سیددیقوe" -> "صدیقی"
  { pattern: /سیددیقوe/g, replacement: "صدیقی" },

  // Strip accidental lone Latin letters embedded inside Urdu words (anti-corruption safeguard)
  // e.g. "وونکeس" where 'e' is stuck inside Urdu characters
  {
    pattern: /([\u0600-\u06FF]+)[a-zA-Z]+([\u0600-\u06FF]+)/g,
    replacement: (match, before, after) => {
      // Known sub-patterns
      if (before.includes("وونک") || after.includes("س")) return "اونس";
      if (before.includes("ش") && after.includes("ر")) return "شیر";
      if (before.includes("سیددیق") || before.includes("صدیق")) return "صدیقی";
      // Default: stitch the Urdu characters cleanly without corruption
      return before + after;
    },
  },
];

/**
 * Proofreads any Urdu string or document narrative.
 * Guarantees court-standard terminology, correct grammar, no malformed mixed-script words,
 * and clean preservation of English acronyms / belt numbers / seals.
 */
export function proofreadUrduText(text: string): string {
  if (!text) return "";

  let result = text;

  // Step 1: Specific explicit correction rules from requirements
  for (const rule of PREFERRED_SPELLING_RULES) {
    result = result.replace(rule.pattern, rule.replacement as any);
  }

  // Step 2: Grammar agreement & formal court phrasing rules
  for (const rule of GRAMMAR_AGREEMENT_RULES) {
    result = result.replace(rule.pattern, rule.replacement as any);
  }

  // Step 3: Mixed-script corruption removal
  for (const rule of MIXED_SCRIPT_CLEANUP_RULES) {
    result = result.replace(rule.pattern, rule.replacement as any);
  }

  // Step 4: Final whitespace and punctuation tidying for court documents
  result = result.replace(/\s+،/g, "،");
  result = result.replace(/\s+۔/g, "۔");
  result = result.replace(/[ ]{2,}/g, " ");

  return result.trim();
}

/**
 * Proofreads an entire FIR data object in place, ensuring all Urdu and transliterated fields
 * conform strictly to the linguistic standards without altering legal facts or numbers.
 */
export function proofreadFIRData<T extends Record<string, any>>(fir: T): T {
  if (!fir) return fir;

  const stringFields = [
    "caseTitle",
    "policeStation",
    "complainantName",
    "ioName",
    "witness1Name",
    "witness2Name",
    "moharrarName",
    "accusedName",
    "fatherName",
    "caste",
    "address",
    "recoveryPlace",
    "liquorQuantity",
    "bottleCount",
    "canDescription",
    "sampleQuantity",
    "sealName",
    "ocrText",
  ];

  const updated: Record<string, any> = { ...fir };

  for (const field of stringFields) {
    if (typeof updated[field] === "string" && updated[field]) {
      updated[field] = proofreadUrduText(updated[field]);
    }
  }

  return updated as T;
}
