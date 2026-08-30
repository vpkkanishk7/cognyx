const fs = require("fs");
let content = fs.readFileSync("backend/routes/assessment.js", "utf8");

content = content.replace(/const comfort = session\.userAnswers\["COMFORT"\] \|\| "Not available";/g, 'const comfort = session.userAnswers["COMFORT"]?.extracted_value || session.userAnswers["COMFORT"] || "Not available";');
content = content.replace(/const age = session\.userAnswers\["AGE"\] \|\| "Not available";/g, 'const age = session.userAnswers["AGE"]?.extracted_value || session.userAnswers["AGE"] || "Not available";');
content = content.replace(/const orientation = session\.userAnswers\["ORIENTATION"\] \|\| "Not available";/g, 'const orientation = session.userAnswers["ORIENTATION"]?.extracted_value || session.userAnswers["ORIENTATION"] || "Not available";');
content = content.replace(/const social = session\.userAnswers\["SOCIAL"\] \|\| "Not available";/g, 'const social = session.userAnswers["SOCIAL"]?.extracted_value || session.userAnswers["SOCIAL"] || "Not available";');
content = content.replace(/const routine = session\.userAnswers\["ROUTINE"\] \|\| "Not available";/g, 'const routine = session.userAnswers["ROUTINE"]?.extracted_value || session.userAnswers["ROUTINE"] || "Not available";');
content = content.replace(/const activity = session\.userAnswers\["ACTIVITY"\] \|\| "Not available";/g, 'const activity = session.userAnswers["ACTIVITY"]?.extracted_value || session.userAnswers["ACTIVITY"] || "Not available";');
content = content.replace(/const memory_strategy = session\.userAnswers\["MEMORY_STRATEGY"\] \|\| "Not available";/g, 'const memory_strategy = session.userAnswers["MEMORY"]?.extracted_value || session.userAnswers["MEMORY_STRATEGY"] || "Not available";'); // Note: we changed ID to MEMORY
content = content.replace(/const functional = session\.userAnswers\["FUNCTIONAL"\] \|\| "Not available";/g, 'const functional = session.userAnswers["FUNCTIONAL"]?.extracted_value || session.userAnswers["FUNCTIONAL"] || "Not available";');
content = content.replace(/const open_observation = session\.userAnswers\["OPEN_OBSERVATION"\] \|\| "Not available";/g, 'const open_observation = session.userAnswers["OPEN_OBSERVATION"]?.extracted_value || session.userAnswers["OPEN_OBSERVATION"] || "Not available";');

fs.writeFileSync("backend/routes/assessment.js", content);
console.log("Updated assessment.js payload extraction");
