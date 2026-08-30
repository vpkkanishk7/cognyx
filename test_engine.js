require("dotenvx").config({ path: "backend/.env" });
const { AssessmentEngine } = require("./backend/utils/assessmentEngine.js");

async function runTest() {
    console.log("Starting Automated Test for Conversational Engine...");
    const engine = new AssessmentEngine("test_user");
    
    let oldIndex;
    
    console.log("=== Q1 Comfort ===");
    let res = await engine.processUserResponse("[SYSTEM_INIT]");
    console.log("Assistant:", res.text);
    
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("okay");
    console.log("User: okay");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 1");
    
    console.log("=== Q2 Age ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("74");
    console.log("User: 74");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 2");
    
    console.log("=== Q3 Orientation ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("nagercoil");
    console.log("User: nagercoil");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 3");
    
    console.log("=== Q4 Social ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("i don't know");
    console.log("User: i don't know (1)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex) throw new Error("Advanced incorrectly on first vague answer");
    if (engine.clarificationUsed !== true) throw new Error("Clarification not set");
    
    res = await engine.processUserResponse("i don't know");
    console.log("User: i don't know (2)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 4 after double vague");
    
    console.log("=== Q5 Routine ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("boring");
    console.log("User: boring (1)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex) throw new Error("Advanced incorrectly on first vague answer");
    
    res = await engine.processUserResponse("i don't like");
    console.log("User: i don't like (2)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 5 after double vague");
    
    console.log("=== Q6 Activity ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("i can't remember");
    console.log("User: i can't remember (1)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex) throw new Error("Advanced incorrectly on first vague answer");
    
    res = await engine.processUserResponse("no");
    console.log("User: no (2)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 6 after double vague");
    
    console.log("=== Q7 Memory ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("don't knowq");
    console.log("User: don't knowq (1)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex) throw new Error("Advanced incorrectly on first vague answer");
    
    res = await engine.processUserResponse("don't know");
    console.log("User: don't know (2)");
    console.log("Assistant:", res.text);
    if (engine.currentQuestionIndex !== oldIndex + 1) throw new Error("Failed to advance 7 after double vague");
    
    console.log("=== Q8 Functional ===");
    oldIndex = engine.currentQuestionIndex;
    res = await engine.processUserResponse("fine");
    console.log("User: fine");
    console.log("Assistant:", res.text);
    
    console.log("TEST PASSED: Backend advanced EXACTLY one question after every forced completion.");
}

runTest().catch(err => {
    console.error("TEST FAILED:", err);
    process.exit(1);
});
