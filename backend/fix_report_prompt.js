const fs = require('fs');
let js = fs.readFileSync('routes/assessment.js', 'utf8');

js = js.replace(/const prompt = "You are an analytical AI assistant.*?";/s, `
    const prompt = "You are an analytical AI assistant. Write a cohesive narrative report synthesizing this patient's data:\\nName: " + username + "\\nDiagnosis Indicator: " + diagnosis + " (" + confidence + "%)\\nImmediate Recall: " + (scores.immediateRecallScore || 0) + "/3\\nDelayed Recall: " + (scores.delayedRecallScore || 0) + "/3\\nWord Identifying Score: " + scores.memoryScore + "%\\nClock Score: " + scores.clockScore + "/10\\nReaction Time: " + scores.reactionTimeMs + "ms\\nPattern Match: " + scores.patternScore + "%\\nOculomotor Risk: " + (videoScores.OCULOMOTOR || "unavailable") + "\\n\\nProvide the response strictly as a JSON object with keys: 'overall_summary', 'strengths', 'observations', 'areas_to_monitor', 'recommended_next_steps'. DO NOT claim a definitive dementia diagnosis; instead, use 'cognitive wellness assessment'.";
`);

fs.writeFileSync('routes/assessment.js', js, 'utf8');
console.log("Updated report prompt");
