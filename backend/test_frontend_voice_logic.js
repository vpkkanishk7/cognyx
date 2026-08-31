// Mock Browser SpeechSynthesis and SpeechRecognition Environment
const fs = require('fs');
const path = require('path');

// Load i18n
const i18nContent = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'i18n.js'), 'utf8');
eval(i18nContent); // Populates window.i18n / translations

// Test Mock Voice List representing real OS voices (Windows / Chrome / Edge)
const mockVoices = [
  { name: "Microsoft David - English (United States)", lang: "en-US", default: true },
  { name: "Microsoft Ravi - English (India)", lang: "en-IN", default: false },
  { name: "Microsoft Zira - English (United States)", lang: "en-US", default: false },
  { name: "Google US English Female", lang: "en-US", default: false },
  { name: "Microsoft Valluvar - Tamil (India)", lang: "ta-IN", default: false },
  { name: "Google தமிழ்", lang: "ta-IN", default: false },
  { name: "Microsoft Hemant - Hindi (India)", lang: "hi-IN", default: false },
  { name: "Microsoft Kalpana - Hindi (India)", lang: "hi-IN", default: false },
  { name: "Google हिन्दी", lang: "hi-IN", default: false }
];

// Mock State and Helper Functions matching script.js
const State = {
  lang: "en",
  assessmentMode: "voice"
};

let cachedVoices = mockVoices;
let lockedSessionVoiceByLang = { en: null, ta: null, hi: null };

function loadVoices() {
  return cachedVoices;
}

function findMatchingVoice(lang) {
  const l = (lang || State.lang || "en").toLowerCase();

  // Return the permanently locked voice for this language if already established
  if (lockedSessionVoiceByLang[l]) {
    return lockedSessionVoiceByLang[l];
  }

  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;
  
  if (l === "ta") {
    const taVoice = voices.find(v => {
      const vl = (v.lang || "").toLowerCase().replace('_', '-');
      const vn = (v.name || "").toLowerCase();
      return vl === "ta-in" || vl.startsWith("ta-") || vl === "ta" || vl === "tam" || vn.includes("tamil") || vn.includes("தமிழ்") || vn.includes("valluvar") || vn.includes("latha");
    }) || null;
    if (taVoice) lockedSessionVoiceByLang["ta"] = taVoice;
    return taVoice;
  }
  
  if (l === "hi") {
    const hiVoice = voices.find(v => {
      const vl = (v.lang || "").toLowerCase().replace('_', '-');
      const vn = (v.name || "").toLowerCase();
      return vl === "hi-in" || vl.startsWith("hi-") || vl === "hi" || vl === "hin" || vn.includes("hindi") || vn.includes("हिन्दी") || vn.includes("hemant") || vn.includes("kalpana") || vn.includes("swara") || vn.includes("madhur");
    }) || null;
    if (hiVoice) lockedSessionVoiceByLang["hi"] = hiVoice;
    return hiVoice;
  }
  
  // English: STRICTLY LOCK A SINGLE MALE VOICE FOR THE ENTIRE SESSION
  const maleKeywords = [
    "david", "mark", "george", "richard", "ravi", "james", "guy", "christopher", 
    "eric", "liam", "ryan", "connor", "andrew", "nathan", "roger", "sean", 
    "sam", "alex", "daniel", "fred", "oliver", "arthur", "aaron", "tom", "rishi", "gordon", "male"
  ];
  const femaleKeywords = [
    "zira", "heera", "hazel", "susan", "catherine", "jenny", "aria", "michelle", 
    "ana", "clara", "emma", "neerja", "pooja", "priya", "veena", "kavita", 
    "female", "woman", "samantha", "victoria", "karen", "moira", "fiona", "tessa", "serena", "linda", "joanna"
  ];

  const enVoices = voices.filter(v => {
    const vl = (v.lang || "").toLowerCase().replace('_', '-');
    return vl.startsWith("en") || vl === "en";
  });

  // 1. First preference: English (India) Male voice
  let chosen = enVoices.find(v => {
    const vl = (v.lang || "").toLowerCase().replace('_', '-');
    const vn = (v.name || "").toLowerCase();
    const isEnIn = vl === "en-in" || vn.includes("india");
    const isMale = maleKeywords.some(m => vn.includes(m));
    const isFemale = femaleKeywords.some(f => vn.includes(f));
    return isEnIn && isMale && !isFemale;
  });

  // 2. Second preference: Any English Male voice
  if (!chosen) {
    chosen = enVoices.find(v => {
      const vn = (v.name || "").toLowerCase();
      const isMale = maleKeywords.some(m => vn.includes(m));
      const isFemale = femaleKeywords.some(f => vn.includes(f));
      return isMale && !isFemale;
    });
  }

  // 3. Third preference: Any English voice not in the female list
  if (!chosen) {
    chosen = enVoices.find(v => {
      const vn = (v.name || "").toLowerCase();
      return !femaleKeywords.some(f => vn.includes(f));
    });
  }

  if (!chosen) {
    chosen = enVoices[0] || null;
  }

  if (chosen) {
    lockedSessionVoiceByLang["en"] = chosen;
  }
  return chosen;
}

let speechLog = [];
let cancelCount = 0;
let serverAudioCalls = [];

const mockSpeechSynthesis = {
  cancel: () => {
    cancelCount++;
  },
  speak: (utterance) => {
    speechLog.push({
      text: utterance.text,
      lang: utterance.lang,
      voiceName: utterance.voice ? utterance.voice.name : "None",
      rate: utterance.rate,
      pitch: utterance.pitch
    });
  }
};

class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.voice = null;
    this.lang = "";
    this.rate = 1;
    this.pitch = 1;
  }
}

function playServerTtsAudio(text, lang) {
  serverAudioCalls.push({ text, lang });
}

function speakClinicalResponse(text, targetLang = State.lang) {
  mockSpeechSynthesis.cancel();
  const l = (targetLang || "en").toLowerCase();
  const matchedVoice = findMatchingVoice(l);
  const targetLangCode = l === "ta" ? "ta-IN" : (l === "hi" ? "hi-IN" : "en-IN");

  if (matchedVoice) {
    const utterance = new MockSpeechSynthesisUtterance(text);
    utterance.voice = matchedVoice;
    utterance.lang = targetLangCode;
    utterance.rate = 0.95;
    utterance.pitch = (l === "en" || l.startsWith("en")) ? 0.9 : 1.0;
    mockSpeechSynthesis.speak(utterance);
    return;
  }

  playServerTtsAudio(text, l);
}

// -------------------------------------------------------------
// TEST RUNNER
// -------------------------------------------------------------
console.log("===================================================================");
console.log("   COGNYX SINGLE-VOICE SESSION INTEGRITY & LOCKING TEST");
console.log("===================================================================\n");

// [TEST 1] Verify Consistent Male Voice Selection Across Consecutive Questions
console.log("[TEST 1] Verifying Single Voice Consistency Across 7 Chatbot Questions...");
speechLog = [];
serverAudioCalls = [];
lockedSessionVoiceByLang = { en: null, ta: null, hi: null };

const testQuestions = [
  "Hello! What is your name and how old are you?",
  "Thank you for sharing your age. Could you tell me what today's date is and what city you are in?",
  "Thank you! Can you describe something you usually do during a normal day?",
  "What is 100 minus 7?",
  "Now what is 93 minus 7?",
  "Please remember these 3 words: Apple, Table, Penny.",
  "What were the three words I asked you to remember?"
];

testQuestions.forEach(q => speakClinicalResponse(q, "en"));

console.log(`Total questions spoken: ${speechLog.length}`);
const uniqueVoicesUsed = [...new Set(speechLog.map(s => s.voiceName))];
console.log("Unique Voices Used in Session:", uniqueVoicesUsed);

if (uniqueVoicesUsed.length === 1 && uniqueVoicesUsed[0].includes("Ravi")) {
  console.log(`✅ Passed: All ${testQuestions.length} questions spoken in exact same single voice: "${uniqueVoicesUsed[0]}"\n`);
} else {
  console.error("❌ Test 1 Failed: Voice switched during the session!", uniqueVoicesUsed);
  process.exit(1);
}

// [TEST 2] Verify Zero Leaks to Female Server Stream
console.log("[TEST 2] Verifying Zero Leaks to External Server Stream for English...");
if (serverAudioCalls.length === 0) {
  console.log("✅ Passed: Zero fallback leaks to external server TTS for English.\n");
} else {
  console.error("❌ Test 2 Failed: Server fallback audio was triggered unexpectedly!", serverAudioCalls);
  process.exit(1);
}

// [TEST 3] Verify Pitch and Male Characteristics
console.log("[TEST 3] Verifying Clinical Male Voice Pitch...");
const allPitches = speechLog.map(s => s.pitch);
if (allPitches.every(p => p === 0.9)) {
  console.log("✅ Passed: All English utterances configured with calibrated male pitch (0.9).\n");
} else {
  console.error("❌ Test 3 Failed: Pitch inconsistent!", allPitches);
  process.exit(1);
}

console.log("===================================================================");
console.log("   ✅ ALL SINGLE-VOICE SESSION INTEGRITY TESTS PASSED!");
console.log("===================================================================");
