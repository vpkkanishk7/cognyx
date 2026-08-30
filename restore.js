const fs = require('fs');
let code = fs.readFileSync('backend/routes/assessment.js', 'utf8');

const regex = /\/\/ Always use deterministic report immediately - no LLM wait[\s\S]*?res\.json\(\{ report: deterministicReport, analysis_source: "deterministic" \}\);/;

const newStr = `  try {
    const prompt = \`Synthesize a structured clinical-style report based on this data:
\${JSON.stringify(payload, null, 2)}
Ensure you include a section for 'Conversational Assessment', 'Cognitive Task Performance', 'Face + Voice Observations', and 'ML Risk Analysis'.
If any module is missing, explicitly write 'Not available in this session'. Do not fabricate results.
Output the report as Markdown.\`;

    const systemPrompt = "You are a professional cognitive wellness assistant generating a structured markdown report.";
    const reportText = await generateCompletionWithFailover(prompt, systemPrompt, false);
    
    res.json({ report: reportText, analysis_source: "llm" });
  } catch (err) {
    console.error("Report Generation Error:", err.message);
    res.json({ report: generateDeterministicReport(), analysis_source: "fallback" });
  }`;

if(regex.test(code)) {
  code = code.replace(regex, newStr);
  fs.writeFileSync('backend/routes/assessment.js', code);
  console.log('Restored LLM report generation');
} else {
  console.log('Could not find search string');
}
