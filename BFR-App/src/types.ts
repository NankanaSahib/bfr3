export interface FIRData {
  caseTitle: string;
  firNumber: string;
  policeStation: string;
  dateOfOccurrence: string;
  timeOfOccurrence: string;
  complainantName: string;
  ioName: string;
  ioRank: string;
  ioBeltNumber: string;
  witness1Name: string;
  witness1BeltNumber: string;
  witness1Rank: string;
  witness2Name: string;
  witness2BeltNumber: string;
  witness2Rank: string;
  moharrarName: string;
  moharrarRank: string;
  accusedName: string;
  fatherName: string;
  caste: string;
  address: string;
  recoveryPlace: string;
  liquorQuantity: string;
  bottleCount: string; // Only if bottles are in the FIR, otherwise don't add/display
  canDescription: string;
  sampleQuantity: string;
  sealName: string;
  exhibitNumbers: string; // Ex.PA, Ex.PB, etc.
  caseType: "Informer" | "Direct Recovery";
  ocrText?: string;
}

export interface ManualFields {
  evidenceDate: string;
  pw1PresentPosting: string;
  pw1Photo: string; // base64 or URL
  pw2PresentPosting: string;
  pw2Photo: string; // base64 or URL
  pw3PresentPosting: string;
  pw3Photo: string; // base64 or URL
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const PW1_INFORMER_TEMPLATE = `بر حلف بیان کیا:
کہ مورخہ {dateOfOccurrence} کو میں ہمراہ {witness1Name} {witness1Rank} {witness1BeltNumber} اور {witness2Name} {witness2Rank} {witness2BeltNumber} بسلسلہ گشت، پڑتالِ جرائم و تلاشِ بدکرداران بمقام {address} موجود تھا کہ مخبر خاص نے اطلاع دی کہ ملزم {accusedName} ولد {fatherName} قوم {caste} سکنہ {address} اس وقت {recoveryPlace} پر موجود ہے اور شراب دیسی فروخت کر رہا ہے، اگر فوری ریڈ کیا جائے تو رنگے ہاتھوں پکڑا جا سکتا ہے۔ جس پر میں نے ہمراہ ملازمین و گواہان جائے وقوعہ پر ریڈ کیا۔ حسبِ اشارہ مخبر خاص ملزم کو قابو کیا گیا۔ ملزم کے قبضہ سے {canDescription} {bottleCount} برآمد ہوئے، جس کی پیمائش کرنے پر کل {liquorQuantity} شراب دیسی برآمد ہوئی۔ برآمد شدہ دیسی شراب میں سے {sampleQuantity} بطور نمونہ برائے کیمیائی تجزیہ پنجاب فرانزک سائنس ایجنسی (PFSA) علیحدہ کر کے الگ پارسل تیار کیا اور بقایا شراب کا الگ پارسل تیار کر کے دونوں پارسلوں کو مہر '{sealName}' سے سربمہر کیا۔ دونوں پارسل بذریعہ فرد مقبوضگی Ex.PA قبضہ پولیس میں لیے، جس پر روبرو گواہان کے دستخط ثبت کروائے۔ بعد ازاں میں نے تحریری استغاثہ Ex.PB تحریر کر کے بغرضِ اندراج مقدمہ بذریعہ کانسٹیبل تھانہ ارسال کیا۔ میں نے جائے وقوعہ کا معائنہ کر کے نقشہ موقع Ex.PC روبرو گواہان مرتب کیا۔ ملزم کو گرفتار کر کے بعد ازاں معزز عدالت کے روبرو پیش کیا جہاں سے معزز عدالت نے ملزم کو جوڈیشل حوالات بھجوا دیا۔ دورانِ تفتیش ملزم کو گنہگار پا کر رپورٹ زیر دفعہ 173 ض-ف مرتب کی جو کہ عدالتِ حضور میں پیش ہے۔`;

export const PW1_DIRECT_RECOVERY_TEMPLATE = `بر حلف بیان کیا:
کہ مورخہ {dateOfOccurrence} کو میں ہمراہ {witness1Name} {witness1Rank} {witness1BeltNumber} اور {witness2Name} {witness2Rank} {witness2BeltNumber} بسلسلہ گشت، پڑتالِ جرائم و تلاشِ بدکرداران بمقام {address} موجود تھا کہ ہم نے ملزم {accusedName} ولد {fatherName} قوم {caste} سکنہ {address} کو مشکوک حالت میں آتے دیکھا جس کے ہاتھ میں {canDescription} {bottleCount} تھے۔ ملزم نے پولیس پارٹی کو دیکھ کر بھاگنے کی کوشش کی جسے میں نے ہمراہ ملازمین حکمت عملی سے قابو کیا۔ تلاشی لینے پر ملزم کے پاس سے کل {liquorQuantity} شراب دیسی برآمد ہوئی۔ برآمد شدہ دیسی شراب میں سے {sampleQuantity} بطور نمونہ برائے کیمیائی تجزیہ پنجاب فرانزک سائنس ایجنسی (PFSA) علیحدہ کر کے الگ پارسل تیار کیا اور بقایا شراب کا الگ پارسل تیار کر کے دونوں پارسلوں کو مہر '{sealName}' سے سربمہر کیا۔ دونوں پارسل بذریعہ فرد مقبوضگی Ex.PA قبضہ پولیس میں لیے جس پر روبرو گواہان دستخط کروائے۔ بعد ازاں تحریری استغاثہ Ex.PB تحریر کر کے بغرضِ اندراج مقدمہ تھانہ ارسال کیا۔ میں نے جائے وقوعہ کا معائنہ کر کے نقشہ موقع Ex.PC روبرو گواہان مرتب کیا۔ ملزم کو گرفتار کر کے بعد ازاں معزز عدالت کے روبرو پیش کیا جہاں سے ملزم کو جوڈیشل ریمانڈ پر جیل بھجوایا گیا۔ دورانِ تفتیش ملزم کو گنہگار پا کر رپورٹ زیر دفعہ 173 ض-ف مرتب کی جو کہ پیشِ عدالت ہے۔`;

export const PW2_MOHARRAR_TEMPLATE = `بر حلف بیان کیا:
کہ مورخہ {dateOfOccurrence} کو ایک تحریری استغاثہ Ex.PB منجانب تفتیشی افسر بغرضِ اندراج مقدمہ میرے پاس تھانہ میں موصول ہوا، جس پر میں نے بلا کم و کاست و بلا تحریف و اضافہ ایف آئی آر Ex.PD من و عن درج کی اور اپنے دستخط ثبت کیے۔ بعد ازاں تفتیشی افسر نے بحفاظت پارسل مالِ مقدمہ معہ نمونہ شراب سربمہر مہر '{sealName}' میرے پاس تھانہ کے مالخانہ میں جمع کروائے جس کا باقاعدہ اندراج میں نے رجسٹر نمبر 19 (رجسٹر مال مقدمہ) میں قانون کے مطابق کیا۔ مورخہ {evidenceDate} کو میں نے نمونہ شراب کا سربمہر پارسل برائے کیمیائی تجزیہ پنجاب فرانزک سائنس ایجنسی (PFSA) بذریعہ کانسٹیبل بحفاظت روانہ کیا جس کی رپورٹ مثبت موصول ہو کر شاملِ مثل ہوئی۔ جب تک مالِ مقدمہ اور پارسل میرے پاس محفوظ رہے ان میں کسی قسم کی کوئی رد و بدل، دست اندازی یا تبدیلی نہ ہوئی۔`;

export const PW3_INFORMER_TEMPLATE = `بر حلف بیان کیا:
کہ مورخہ {dateOfOccurrence} کو میں ہمراہ تفتیشی افسر {ioName} {ioRank} اور دیگر ملازمین بسلسلہ گشت، پڑتالِ جرائم و تلاشِ بدکرداران بمقام {address} موجود تھا کہ مخبر خاص نے تفتیشی افسر کو اطلاع دی کہ ملزم {accusedName} ولد {fatherName} قوم {caste} سکنہ {address} اس وقت {recoveryPlace} پر موجود ہے اور شراب دیسی فروخت کر رہا ہے، اگر فوری ریڈ کیا جائے تو رنگے ہاتھوں پکڑا جا سکتا ہے۔ جس پر تفتیشی افسر نے ہمراہ ملازمین و گواہان جائے وقوعہ پر ریڈ کیا۔ حسبِ اشارہ مخبر خاص ملزم کو قابو کیا گیا۔ ملزم کے قبضہ سے {canDescription} {bottleCount} برآمد ہوئے، جس کی پیمائش پر کل {liquorQuantity} شراب دیسی برآمد ہوئی۔ تفتیشی افسر نے برآمد شدہ دیسی شراب میں سے {sampleQuantity} بطور نمونہ برائے کیمیائی تجزیہ PFSA علیحدہ کر کے الگ پارسل تیار کیا اور بقایا شراب کا الگ پارسل تیار کر کے دونوں پارسلوں کو مہر '{sealName}' سے سربمہر کیا۔ دونوں پارسل بذریعہ فرد مقبوضگی Ex.PA قبضہ پولیس میں لیے، جس پر روبرو میرے اور دوسرے گواہ کے دستخط کروائے گئے۔ تفتیشی افسر نے تحریری استغاثہ Ex.PB تحریر کر کے بغرضِ اندراج مقدمہ تھانہ ارسال کیا۔ تفتیشی افسر نے میرے روبرو جائے وقوعہ کا معائنہ کر کے نقشہ موقع Ex.PC مرتب کیا۔ تفتیشی افسر نے ملزم کو موقع پر گرفتار کیا۔ ملزم کو گنہگار پایا گیا۔`;

export const PW3_DIRECT_RECOVERY_TEMPLATE = `بر حلف بیان کیا:
کہ مورخہ {dateOfOccurrence} کو میں ہمراہ تفتیشی افسر {ioName} {ioRank} اور دیگر ملازمین بسلسلہ گشت، پڑتالِ جرائم و تلاشِ بدکرداران بمقام {address} موجود تھا کہ ہم نے ملزم {accusedName} ولد {fatherName} قوم {caste} سکنہ {address} کو مشکوک حالت میں آتے دیکھا جس کے ہاتھ میں {canDescription} {bottleCount} تھے۔ ملزم نے پولیس پارٹی کو دیکھ کر بھاگنے کی کوشش کی جسے ہم نے ہمراہ تفتیشی افسر قابو کیا۔ تلاشی لینے پر ملزم کے پاس سے کل {liquorQuantity} شراب دیسی برآمد ہوئی۔ تفتیشی افسر نے برآمد شدہ دیسی شراب میں سے {sampleQuantity} بطور نمونہ برائے کیمیائی تجزیہ PFSA علیحدہ کر کے الگ پارسل تیار کیا اور بقایا شراب کا الگ پارسل تیار کر کے دونوں پارسلوں کو مہر '{sealName}' سے سربمہر کیا۔ دونوں پارسل بذریعہ فرد مقبوضگی Ex.PA قبضہ پولیس میں لیے، جس پر روبرو میرے اور دوسرے گواہ کے دستخط کروائے گئے۔ تفتیشی افسر نے تحریری استغاثہ Ex.PB تحریر کر کے بغرضِ اندراج مقدمہ تھانہ ارسال کیا۔ تفتیشی افسر نے میرے روبرو جائے وقوعہ کا نقشہ موقع Ex.PC مرتب کیا۔ تفتیشی افسر نے ملزم کو گرفتار کیا۔ ملزم کو گنہگار پایا گیا۔`;

export interface Statement342Question {
  id: number;
  question: string;
  answer: string;
}

export const generateStatement342Questions = (
  fir: FIRData,
  manual: ManualFields
): Statement342Question[] => {
  const accusedName = fir.accusedName || "the accused";
  const ioName = fir.ioName || "the Investigating Officer";
  const witness1 = fir.witness1Name || "Constable";
  const dateOfOcc = fir.dateOfOccurrence || "the date of occurrence";
  const place = fir.recoveryPlace || "the alleged place of recovery";
  const qty = fir.liquorQuantity || "illicit liquor";
  const can = fir.canDescription || "plastic cane";
  const bottles = fir.bottleCount ? `(${fir.bottleCount})` : "";
  const sample = fir.sampleQuantity || "sample";
  const seal = fir.sealName || "seal";
  const policeStation = fir.policeStation || "Police Station concerned";

  return [
    {
      id: 1,
      question: "Have you heard and understood the evidence recorded by the prosecution witnesses against you?",
      answer: "Yes, I have heard and understood it.",
    },
    {
      id: 2,
      question: `It is in evidence against you that on ${dateOfOcc} at ${place}, P.W.-1 ${ioName} along with P.W.-3 ${witness1} and other police officials apprehended you and recovered ${qty} of illicit liquor contained in ${can} ${bottles} from your direct possession, out of which ${sample} was separated as a sample parcel and sealed with seal '${seal}' vide recovery memo Ex.PA? What do you say?`,
      answer: "It is absolutely incorrect. No recovery of any illicit liquor was ever effected from my possession or at my instance.",
    },
    {
      id: 3,
      question: `It is in evidence that P.W.-1 prepared written complaint Ex.PB and transmitted it to Police Station ${policeStation}, upon which formal FIR Ex.PD was registered against you? What do you say?`,
      answer: "It is incorrect. The complaint and FIR are false, fabricated, and concocted against me.",
    },
    {
      id: 4,
      question: `It is in evidence that P.W.-1 inspected the crime spot and prepared unscaled site plan Ex.PC in presence of witnesses, and that P.W.-2 kept the sealed sample parcel in safe custody in Malkhana and subsequently transmitted it intact to Punjab Forensic Science Agency (PFSA), whose report was received positive and placed on judicial record? What do you say?`,
      answer: "It is incorrect. All documents and proceedings were prepared falsely while sitting at the police station. The case property and sample were managed by the police themselves.",
    },
    {
      id: 5,
      question: "Why have the prosecution witnesses (PW-1, PW-2, and PW-3) deposed against you?",
      answer: "All prosecution witnesses are police officials and subordinate to each other. They are interested in securing my conviction and have deposed falsely merely to demonstrate bogus performance to their high-ups.",
    },
    {
      id: 6,
      question: "Why was this case registered against you?",
      answer: "I am innocent. I was picked up from my residence/bazaar by the police without any lawful justification, and this false case has been planted upon me.",
    },
    {
      id: 7,
      question: "Do you want to lead evidence in your defense?",
      answer: "No.",
    },
    {
      id: 8,
      question: "Do you want to appear as your own witness and record your statement on oath under Section 340(2) Cr.P.C. in disproof of the charges leveled against you?",
      answer: "No.",
    },
    {
      id: 9,
      question: "Have you anything else to say?",
      answer: "I am completely innocent and have been falsely roped into this fabricated case. No independent or private person from the public was associated by the police during the alleged recovery. I pray for my honorable acquittal.",
    },
  ];
};
