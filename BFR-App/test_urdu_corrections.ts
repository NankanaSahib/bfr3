import { proofreadUrduText, proofreadFIRData } from "./src/utils/urduProofreader";
import { 
  PW1_INFORMER_TEMPLATE, 
  PW1_DIRECT_RECOVERY_TEMPLATE, 
  PW2_MOHARRAR_TEMPLATE, 
  PW3_INFORMER_TEMPLATE, 
  PW3_DIRECT_RECOVERY_TEMPLATE,
  generateStatement342Questions,
  FIRData,
  ManualFields
} from "./src/types";

let failures = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (details) console.error(`   Details: ${details}`);
    failures++;
  }
}

console.log("=== RUNNING REGRESSION TESTS FOR URDU LANGUAGE CORRECTIONS ===");

// 1. Explicit Spelling Corrections
const test1 = proofreadUrduText("ملزم فایزاباد کا رہائشی ہے");
assert(test1.includes("فیض آباد") && !test1.includes("فایزاباد"), "Correction: فایزاباد -> فیض آباد", test1);

const test2 = proofreadUrduText("مقام ساجاوال پر کارروائی کی گئی");
assert(test2.includes("ساجوال") && !test2.includes("ساجاوال"), "Correction: ساجاوال -> ساجوال", test2);

const test3 = proofreadUrduText("گواہ جافار موقع پر موجود تھا");
assert(test3.includes("جعفر") && !test3.includes("جافار"), "Correction: جافار -> جعفر", test3);

const test4 = proofreadUrduText("ملزم چانگار قوم سے تعلق رکھتا ہے");
assert(test4.includes("چنگڑ") && !test4.includes("چانگار"), "Correction: چانگار -> چنگڑ", test4);

const test5 = proofreadUrduText("سکنہ سکنہ بھٹہ چک");
assert(test5 === "سکنہ بھٹہ چک", "Correction: سکنہ سکنہ بھٹہ چک -> سکنہ بھٹہ چک", test5);

const test6 = proofreadUrduText("کانسٹیبل اتیف نے ملزم کو قابو کیا");
assert(test6.includes("عاطف") && !test6.includes("اتیف"), "Correction: اتیف -> عاطف", test6);

// 2. Grammar & Agreement
const test7 = proofreadUrduText("ملزم کے ہاتھ میں 2 کین پلاسٹک رنگ سفید تھی۔");
assert(test7 === "ملزم کے ہاتھ میں دو سفید رنگ کے پلاسٹک کین تھے۔", "Grammar: 2 کین پلاسٹک رنگ سفید تھی -> دو سفید رنگ کے پلاسٹک کین تھے", test7);

const test8 = proofreadUrduText("برآمدہ شراب میں سے 20 وونکeس شراب دیسی بطور نمونہ");
assert(test8 === "برآمد شدہ دیسی شراب میں سے 20 اونس بطور نمونہ", "Grammar: برآمدہ شراب میں سے 20 وونکeس -> برآمد شدہ دیسی شراب میں سے 20 اونس بطور نمونہ", test8);

const test9 = proofreadUrduText("دونوں پارسل جات پر مہر بحروفِ اسمی وا لگائی۔");
assert(test9 === "دونوں پارسلوں کو مہر 'WA' سے سربمہر کیا۔", "Grammar: دونوں پارسل جات پر مہر بحروفِ اسمی وا لگائی -> دونوں پارسلوں کو مہر 'WA' سے سربمہر کیا۔", test9);

const test10 = proofreadUrduText("سوہایل ولد عبدال حمید");
assert(test10 === "سہیل ولد عبدالحمید", "Name joining & spelling: سوہایل ولد عبدال حمید -> سہیل ولد عبدالحمید", test10);

// 3. Mixed Script Corruption Cleansing
const test11 = proofreadUrduText("کل مقدار 20 وونکeس شراب برآمد ہوئی۔");
assert(!test11.includes("وونکeس") && test11.includes("20 اونس"), "Mixed script: prevent وونکeس -> 20 اونس", test11);

const test12 = proofreadUrduText("محمد شeر موقع پر موجود تھا۔");
assert(!test12.includes("شeر") && test12.includes("شیر"), "Mixed script: prevent شeر -> شیر", test12);

const test13 = proofreadUrduText("گواہ سیددیقوe نے بیان دیا۔");
assert(!test13.includes("سیددیقوe") && test13.includes("صدیقی"), "Mixed script: prevent سیددیقوe -> صدیقی", test13);

// 4. Test Official Identifiers are Preserved
const test14 = proofreadUrduText("تفتیشی افسر ASI محمد فاروق نے فرد Ex.PA اور Ex.PB اور Ex.PC اور Ex.PD مرتب کیں اور نمونہ PFSA ارسال کیا بذریعہ کانسٹیبل 1276/C مہر WA");
assert(test14.includes("ASI") && test14.includes("PFSA") && test14.includes("Ex.PA") && test14.includes("1276/C") && test14.includes("WA"), "Preserve official identifiers (ASI, PFSA, Ex.PA, 1276/C, WA)", test14);

// 5. Test Sample Case with PW-1, PW-2, PW-3 and Section 342 statement
const sampleFIR: FIRData = {
  caseTitle: "State Vs. Sohail",
  firNumber: "142/26",
  policeStation: "Saddar",
  dateOfOccurrence: "15-05-2026",
  timeOfOccurrence: "21:30",
  complainantName: "Farooq ASI",
  ioName: "Muhammad Farooq",
  ioRank: "ASI",
  ioBeltNumber: "1276/C",
  witness1Name: "Atif",
  witness1BeltNumber: "1525/C",
  witness1Rank: "Constable",
  witness2Name: "Jafar",
  witness2BeltNumber: "1890/C",
  witness2Rank: "Constable",
  moharrarName: "Abdul Hameed",
  moharrarRank: "Head Constable",
  accusedName: "Sohail",
  fatherName: "Abdul Hameed",
  caste: "Changar",
  address: "Bhatta Chak, Faizabad",
  recoveryPlace: "Sajawal Chowk",
  liquorQuantity: "50 Liters",
  bottleCount: "",
  canDescription: "2 plastic can white color",
  sampleQuantity: "20 ounces",
  sealName: "WA",
  exhibitNumbers: "Ex.PA, Ex.PB, Ex.PC, Ex.PD",
  caseType: "Informer",
  ocrText: "سوہایل ولد عبدالحمید سکنہ بھٹہ چک فیض آباد"
};

const sampleManual: ManualFields = {
  evidenceDate: "20-05-2026",
  pw1PresentPosting: "Thana Saddar",
  pw1Photo: "",
  pw2PresentPosting: "Thana Saddar",
  pw2Photo: "",
  pw3PresentPosting: "Thana Saddar",
  pw3Photo: ""
};

// Check Section 342 generation preserves English without corruption
const s342 = generateStatement342Questions(sampleFIR, sampleManual);
assert(s342.length === 9, "Section 342 questions count is 9");
assert(s342[0].question.includes("Have you heard and understood"), "Section 342 English is intact");
assert(s342[1].question.includes("Ex.PA"), "Section 342 contains Ex.PA reference");

// Check proofreadFIRData on sampleFIR
const proofreadFIR = proofreadFIRData(sampleFIR);
assert(proofreadFIR.accusedName === "Sohail", "FIR accusedName intact");
assert(proofreadFIR.sealName === "WA", "FIR sealName WA intact");

// Check template strings do not have known errors
const templates = [
  PW1_INFORMER_TEMPLATE, 
  PW1_DIRECT_RECOVERY_TEMPLATE, 
  PW2_MOHARRAR_TEMPLATE, 
  PW3_INFORMER_TEMPLATE, 
  PW3_DIRECT_RECOVERY_TEMPLATE
];

for (const tmpl of templates) {
  assert(!tmpl.includes("وونکeس"), "Template does not contain وونکeس");
  assert(!tmpl.includes("شeر"), "Template does not contain شeر");
  assert(!tmpl.includes("سیددیقوe"), "Template does not contain سیددیقوe");
  assert(!tmpl.includes("فایزاباد"), "Template does not contain فایزاباد");
  assert(!tmpl.includes("ساجاوال"), "Template does not contain ساجاوال");
  assert(!tmpl.includes("جافار"), "Template does not contain جافار");
  assert(!tmpl.includes("چانگار"), "Template does not contain چانگار");
  assert(!tmpl.includes("سکنہ سکنہ"), "Template does not contain duplicate سکنہ سکنہ");
  assert(!tmpl.includes("مہر بحروفِ اسمی وا"), "Template does not contain مہر بحروفِ اسمی وا");
  assert(!tmpl.includes("برآمدہ شراب میں سے"), "Template uses برآمد شدہ دیسی شراب میں سے");
  assert(!tmpl.includes("دونوں پارسل جات پر مہر"), "Template uses دونوں پارسلوں کو مہر");
}

console.log("\n=== TEST RUN SUMMARY ===");
if (failures === 0) {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO FAILURES.");
  process.exit(0);
} else {
  console.error(`💥 ${failures} TESTS FAILED.`);
  process.exit(1);
}
