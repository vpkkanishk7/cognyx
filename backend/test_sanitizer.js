function sanitizeOutput(questionText) {
      if (!questionText) return "Could you tell me more about that?";
      
      // Robust sanitizer for <think> tags
      questionText = questionText.replace(/<think>[\s\S]*?<\/think>/gi, ""); // Remove complete blocks
      questionText = questionText.replace(/<think>[\s\S]*/gi, ""); // Remove unclosed blocks
      questionText = questionText.replace(/<\/think>/gi, ""); // Remove stray closing tags
      questionText = questionText.trim();

      if (!questionText) {
         questionText = "Could you tell me more about that?";
      }
      return questionText;
}

const tests = [
  { name: "Single think block", input: "<think>reasoning</think>How old are you?" },
  { name: "Multiline think block", input: "<think>\nreasoning\nhere\n</think>\nHow old are you?" },
  { name: "Multiple think blocks", input: "<think>r1</think> <think>r2</think>How old are you?" },
  { name: "Empty think block", input: "<think></think>How old are you?" },
  { name: "Incomplete think block", input: "<think>reasoning... How old are you?" },
  { name: "Think block followed by question", input: "<think>hmm</think> How old are you?" },
  { name: "Think block with punctuation", input: "<think>wait, what?</think> How old are you?" },
  { name: "Normal response without think tags", input: "How old are you?" },
  { name: "Only reasoning (triggers fallback)", input: "<think>I should ask their age.</think>" },
  { name: "Orphaned closing tag", input: "</think>How old are you?" },
  { name: "Whitespace around tags", input: "   <think>  \n  </think>  How old are you?  " }
];

console.log("--- SANITIZATION TEST RESULTS ---");
tests.forEach((t, i) => {
  const result = sanitizeOutput(t.input);
  console.log(`Test ${i + 1}: ${t.name}`);
  console.log(`INPUT: ${JSON.stringify(t.input)}`);
  console.log(`OUTPUT: ${JSON.stringify(result)}`);
  console.log("---------------------------------");
});
