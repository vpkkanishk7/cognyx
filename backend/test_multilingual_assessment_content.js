const fs = require('fs');
const path = require('path');

// Load i18n
const i18n = require(path.join(__dirname, '..', 'frontend', 'i18n.js'));
const {
  getMemoryWords,
  getWorkingMemoryPool,
  getPatternQuestionLocalized,
  validateMemoryRecallScore,
  MEMORY_WORDS_DATA,
  WORKING_MEMORY_WORDS_DATA,
  PATTERN_QUESTIONS_LOCALIZED
} = i18n;

async function runAssessmentContentTests() {
  console.log("===================================================================");
  console.log("   COGNYX MULTILINGUAL ASSESSMENT CONTENT & TEST DATA SUITE");
  console.log("===================================================================\n");

  // [TEST 1] Verify 3-Word Memory Registration Words
  console.log("[TEST 1] Testing 3-Word Memory Registration Words across en, ta, hi...");
  const enMem = getMemoryWords("en");
  const taMem = getMemoryWords("ta");
  const hiMem = getMemoryWords("hi");

  console.log("English Memory Words:", enMem);
  console.log("Tamil Memory Words:  ", taMem);
  console.log("Hindi Memory Words:  ", hiMem);

  if (enMem.length === 3 && enMem[0] === "APPLE" && enMem[1] === "TABLE" && enMem[2] === "PENNY") {
    console.log("✅ English 3-Word test content verified!");
  } else {
    console.error("❌ English 3-Word test content failed!");
    process.exit(1);
  }

  if (taMem.length === 3 && taMem[0] === "ஆப்பிள்" && taMem[1] === "மேசை" && taMem[2] === "நாணயம்") {
    console.log("✅ Tamil 3-Word test content verified!");
  } else {
    console.error("❌ Tamil 3-Word test content failed!");
    process.exit(1);
  }

  if (hiMem.length === 3 && hiMem[0] === "सेब" && hiMem[1] === "मेज" && hiMem[2] === "सिक्का") {
    console.log("✅ Hindi 3-Word test content verified!\n");
  } else {
    console.error("❌ Hindi 3-Word test content failed!");
    process.exit(1);
  }

  // [TEST 2] Verify Memory Recall Scoring for Native Inputs
  console.log("[TEST 2] Testing Memory Recall Answer Validation...");
  const enScore = validateMemoryRecallScore("apple table penny", "en");
  const taScore = validateMemoryRecallScore("நான் ஆப்பிள், மேசை மற்றும் நாணயம் நினைவில் வைத்திருக்கிறேன்", "ta");
  const hiScore = validateMemoryRecallScore("सेब, मेज और सिक्का", "hi");
  const partialScore = validateMemoryRecallScore("ஆப்பிள் மேசை", "ta");

  console.log(`English Recall ("apple table penny") -> Score: ${enScore}/3`);
  console.log(`Tamil Recall ("ஆப்பிள், மேசை மற்றும் நாணயம்") -> Score: ${taScore}/3`);
  console.log(`Hindi Recall ("सेब, मेज और सिक्का") -> Score: ${hiScore}/3`);
  console.log(`Partial Recall ("ஆப்பிள் மேசை") -> Score: ${partialScore}/3`);

  if (enScore === 3 && taScore === 3 && hiScore === 3 && partialScore === 2) {
    console.log("✅ Multilingual Memory Recall validation accurately scored native script answers!\n");
  } else {
    console.error("❌ Memory Recall validation failed!");
    process.exit(1);
  }

  // [TEST 3] Verify Working Memory 30-Word Lexical Pool
  console.log("[TEST 3] Testing Working Memory 30-Word Pools across en, ta, hi...");
  const enPool = getWorkingMemoryPool("en");
  const taPool = getWorkingMemoryPool("ta");
  const hiPool = getWorkingMemoryPool("hi");

  console.log(`English Pool Size: ${enPool.length} words (Sample: ${enPool.slice(0, 5).join(", ")})`);
  console.log(`Tamil Pool Size:   ${taPool.length} words (Sample: ${taPool.slice(0, 5).join(", ")})`);
  console.log(`Hindi Pool Size:   ${hiPool.length} words (Sample: ${hiPool.slice(0, 5).join(", ")})`);

  if (enPool.length === 30 && taPool.length === 30 && hiPool.length === 30) {
    console.log("✅ Working memory 30-word pools are complete and balanced in all 3 languages!\n");
  } else {
    console.error("❌ Working memory pool size mismatch!");
    process.exit(1);
  }

  // [TEST 4] Verify Geometric Pattern Recognition Localized Bank (12 Questions)
  console.log("[TEST 4] Testing 12-Question Geometric Pattern Localized Content...");
  for (let i = 0; i < 12; i++) {
    const enQ = getPatternQuestionLocalized(i, "en");
    const taQ = getPatternQuestionLocalized(i, "ta");
    const hiQ = getPatternQuestionLocalized(i, "hi");

    if (!enQ.difficulty || !enQ.instruction || !taQ.difficulty || !taQ.instruction || !hiQ.difficulty || !hiQ.instruction) {
      console.error(`❌ Question ${i + 1} is missing localized content!`);
      process.exit(1);
    }
  }
  console.log("Sample Question 1 [ta]:", getPatternQuestionLocalized(0, "ta"));
  console.log("Sample Question 1 [hi]:", getPatternQuestionLocalized(0, "hi"));
  console.log("✅ All 12 Pattern Reasoning questions contain full native localized difficulty & instructions!\n");

  console.log("===================================================================");
  console.log("   ✅ ALL MULTILINGUAL ASSESSMENT CONTENT TESTS PASSED!");
  console.log("===================================================================");
}

runAssessmentContentTests();
