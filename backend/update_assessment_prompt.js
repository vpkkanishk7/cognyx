const fs = require('fs');
let code = fs.readFileSync('routes/assessment.js', 'utf8');

const newPrompt = `const prompt = \`
You are a Cognitive Wellness Clinical Assistant. Write a highly professional, well-structured cognitive wellness report based on the following multi-modal assessment data.

**IMPORTANT MEDICAL SAFETY RULES:**
- DO NOT diagnose dementia, Alzheimer's, or any medical condition.
- DO NOT say "You have dementia."
- DO NOT say "You don't have dementia."
- Use phrasing like: "This screening identified patterns that may warrant further evaluation" or "Observed performance is within the expected range."
- Every claim must be grounded in the provided data. Do NOT say the user performed well if the data shows poor performance, or vice versa.

**DATA:**
- AI/ML Model Risk Assessment: \${diagnosis} (Confidence: \${Math.round(confidence * 100)}%)
- Reaction Time (Median of 5 trials): \${scores.reactionTimeMs || 'N/A'} ms
- Working Memory Score: \${scores.memoryScore || 0}%
- Pattern Recognition Score: \${scores.patternScore || 0}%
- Clock Drawing Score: \${scores.clockScore || 0}/10
- Behavioral/Video Analysis (if any): \${JSON.stringify(videoScores)}
- Video Summary: \${videoSummary}

**REQUIRED REPORT STRUCTURE (Use exact Markdown headers):**
# Cognitive Wellness Profile
[Insert a short executive summary of the overall assessment]

### Observed Strengths
[List 2-3 cognitive domains where the user performed well based strictly on data]

### Areas That May Need Attention
[List any cognitive domains that showed reduced performance, or write "None observed" if all scores are optimal]

### Memory Performance
[Describe the working memory score result]

### Attention & Processing
[Describe the reaction time and pattern recognition scores]

### Visuospatial Performance
[Describe the clock drawing score]

### Behavioral & Interaction Observations
[Describe the video/behavioral data]

### Recommended Next Steps
[If risk is high or moderate, recommend discussing results with a healthcare professional. Otherwise, recommend continued healthy cognitive habits]

**Disclaimer:** This is an early screening tool and does not establish a medical diagnosis. Please consult a healthcare provider for any clinical concerns.
\`;`;

// Replace the old prompt assignment with the new one
code = code.replace(/const prompt = `You are a medical AI analyst[\s\S]*?Please provide a detailed medical report:\`;/, newPrompt);

fs.writeFileSync('routes/assessment.js', code, 'utf8');
console.log("Updated assessment.js prompt");
