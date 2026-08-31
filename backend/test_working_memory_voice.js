const path = require('path');
const i18n = require(path.join(__dirname, '..', 'frontend', 'i18n.js'));
const {
  normalizeCognitiveText,
  extractSpokenWorkingMemoryWords,
  getWorkingMemoryPool,
  t
} = i18n;

function runWorkingMemoryVoiceTests() {
  console.log("===================================================================");
  console.log("   COGNYX WORKING MEMORY VOICE INPUT VERIFICATION SUITE");
  console.log("   Languages: English (en-IN), Tamil (ta-IN), Hindi (hi-IN)");
  console.log("===================================================================\n");

  // [TEST 1] Text Normalization Test
  console.log("[TEST 1] Testing Cognitive Text Normalizer across scripts...");
  const rawEn = "   Apple, Bread & Table!   ";
  const rawTa = "  ஆப்பிள், ரொட்டி, மேசை!  ";
  const rawHi = "  सेब, रोटी, मेज!  ";

  const normEn = normalizeCognitiveText(rawEn);
  const normTa = normalizeCognitiveText(rawTa);
  const normHi = normalizeCognitiveText(rawHi);

  console.log("Normalized English:", normEn);
  console.log("Normalized Tamil:  ", normTa);
  console.log("Normalized Hindi:  ", normHi);

  if (normEn === "apple bread table" && normTa === "ஆப்பிள் ரொட்டி மேசை" && normHi === "सेब रोटी मेज") {
    console.log("✅ Text normalization correctly strips punctuation and cleans whitespace across all 3 languages!\n");
  } else {
    console.error("❌ Text normalization failed!");
    process.exit(1);
  }

  // [TEST 2] English Voice Input Word Extraction & Matching
  console.log("[TEST 2] Testing English Voice Recognition Matching...");
  const enTargets = ["APPLE", "RIVER", "CHAIR", "BREAD", "HOUSE"];
  const enDistractors = ["TABLE", "GARDEN", "BOOK", "WATER", "HORSE"];
  const enPool = [...enTargets, ...enDistractors];

  const enSpoken = "I clearly remember seeing apple, river, chair, bread, and house on the screen.";
  const enExtracted = extractSpokenWorkingMemoryWords(enSpoken, enPool, "en");
  console.log("English Target Words:  ", enTargets);
  console.log("English Spoken Sentence:", enSpoken);
  console.log("English Extracted Words:", enExtracted);

  const enScore = Math.round((enExtracted.filter(w => enTargets.includes(w)).length / 5) * 100);
  console.log(`Calculated Working Memory Score: ${enScore}% (${enExtracted.length}/5)`);

  if (enExtracted.length === 5 && enScore === 100) {
    console.log("✅ English voice input correctly extracted all 5 target words with 100% score!\n");
  } else {
    console.error("❌ English voice extraction failed!");
    process.exit(1);
  }

  // [TEST 3] Tamil Voice Input Word Extraction (No Translation to English)
  console.log("[TEST 3] Testing Tamil Voice Recognition Matching (Native Script Validation)...");
  const taTargets = ["ஆப்பிள்", "ஆறு", "நாற்காலி", "ரொட்டி", "வீடு"];
  const taDistractors = ["மேசை", "தோட்டம்", "புத்தகம்", "தண்ணீர்", "குதிரை"];
  const taPool = [...taTargets, ...taDistractors];

  const taSpoken = "நான் ஆப்பிள், ஆறு, நாற்காலி, ரொட்டி மற்றும் வீடு ஆகியவற்றை நினைவில் வைத்திருக்கிறேன்.";
  const taExtracted = extractSpokenWorkingMemoryWords(taSpoken, taPool, "ta");
  console.log("Tamil Target Words:  ", taTargets);
  console.log("Tamil Spoken Sentence:", taSpoken);
  console.log("Tamil Extracted Words:", taExtracted);

  const taScore = Math.round((taExtracted.filter(w => taTargets.includes(w)).length / 5) * 100);
  console.log(`Calculated Working Memory Score: ${taScore}% (${taExtracted.length}/5)`);

  if (taExtracted.length === 5 && taScore === 100) {
    console.log("✅ Tamil voice input correctly validated directly against Tamil targets without English translation!\n");
  } else {
    console.error("❌ Tamil voice extraction failed!");
    process.exit(1);
  }

  // [TEST 4] Hindi Voice Input Word Extraction (Native Script Validation)
  console.log("[TEST 4] Testing Hindi Voice Recognition Matching (Native Script Validation)...");
  const hiTargets = ["सेब", "नदी", "कुर्सी", "रोटी", "घर"];
  const hiDistractors = ["मेज", "बगीचा", "किताब", "पानी", "घोड़ा"];
  const hiPool = [...hiTargets, ...hiDistractors];

  const hiSpoken = "मुझे याद है सेब, नदी, कुर्सी, रोटी और घर।";
  const hiExtracted = extractSpokenWorkingMemoryWords(hiSpoken, hiPool, "hi");
  console.log("Hindi Target Words:  ", hiTargets);
  console.log("Hindi Spoken Sentence:", hiSpoken);
  console.log("Hindi Extracted Words:", hiExtracted);

  const hiScore = Math.round((hiExtracted.filter(w => hiTargets.includes(w)).length / 5) * 100);
  console.log(`Calculated Working Memory Score: ${hiScore}% (${hiExtracted.length}/5)`);

  if (hiExtracted.length === 5 && hiScore === 100) {
    console.log("✅ Hindi voice input correctly validated directly against Hindi targets with 100% score!\n");
  } else {
    console.error("❌ Hindi voice extraction failed!");
    process.exit(1);
  }

  // [TEST 5] Partial Recall and Distractor Filtering Test
  console.log("[TEST 5] Testing Partial Recall & Distractor Filtering...");
  const mixedSpoken = "நான் ஆப்பிள், மேசை மற்றும் வீடு நினைவில் வைத்திருக்கிறேன்"; // 'மேசை' is a distractor
  const mixedExtracted = extractSpokenWorkingMemoryWords(mixedSpoken, taPool, "ta");
  const matchedTargets = mixedExtracted.filter(w => taTargets.includes(w));
  const partialScore = Math.round((matchedTargets.length / 5) * 100);

  console.log("Spoken with 2 targets + 1 distractor:", mixedSpoken);
  console.log("Extracted candidate words:          ", mixedExtracted);
  console.log("Matched Target Words:               ", matchedTargets);
  console.log(`Calculated Working Memory Score:     ${partialScore}% (${matchedTargets.length}/5)`);

  if (matchedTargets.length === 2 && partialScore === 40) {
    console.log("✅ Distractor filtering and partial score calculation strictly accurate!\n");
  } else {
    console.error("❌ Distractor filtering test failed!");
    process.exit(1);
  }

  // [TEST 6] Localized UI Strings Verification
  console.log("[TEST 6] Testing Localized Voice Input UI Strings...");
  const keys = ['memory_mic_btn', 'memory_mic_listening', 'memory_mic_recognized', 'memory_mic_denied', 'memory_grid_desc'];
  for (const lang of ['en', 'ta', 'hi']) {
    for (const k of keys) {
      const val = t(k, lang);
      if (!val || val === k) {
        console.error(`❌ Missing translation key "${k}" for language "${lang}"!`);
        process.exit(1);
      }
    }
  }
  console.log("Sample UI string [ta]:", t('memory_mic_btn', 'ta'));
  console.log("Sample UI string [hi]:", t('memory_mic_btn', 'hi'));
  console.log("✅ All voice input UI labels, prompts, and error fallbacks translated for en, ta, and hi!\n");

  console.log("===================================================================");
  console.log("   ✅ ALL WORKING MEMORY VOICE INPUT TESTS PASSED PERFECTLY!");
  console.log("===================================================================");
}

runWorkingMemoryVoiceTests();
