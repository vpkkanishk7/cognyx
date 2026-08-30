
const { AssessmentEngine } = require("./utils/assessmentEngine.js");

async function runTest() {
    console.log("Starting FINAL Verification Test...");
    const engine = new AssessmentEngine("test_user");
    
    let res = await engine.processUserResponse("[SYSTEM_INIT]");
    console.log(`Q1 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    
    res = await engine.processUserResponse("okay");
    console.log(`User: okay`);
    console.log(`Q2 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 1) throw new Error("Index should be 1");
    
    res = await engine.processUserResponse("20");
    console.log(`User: 20`);
    console.log(`Q3 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 2) throw new Error("Index should be 2");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 2) throw new Error("Index should still be 2");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (2)`);
    console.log(`Q4 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 3) throw new Error("Index should be 3");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 3) throw new Error("Index should still be 3");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (2)`);
    console.log(`Q5 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 4) throw new Error("Index should be 4");
    
    res = await engine.processUserResponse("boring");
    console.log(`User: boring (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 4) throw new Error("Index should still be 4");
    
    res = await engine.processUserResponse("i don't like it");
    console.log(`User: i don't like it (2)`);
    console.log(`Q6 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 5) throw new Error("Index should be 5");
    
    res = await engine.processUserResponse("no");
    console.log(`User: no (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 5) throw new Error("Index should still be 5");
    
    res = await engine.processUserResponse("no");
    console.log(`User: no (2)`);
    console.log(`Q7 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 6) throw new Error("Index should be 6");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 6) throw new Error("Index should still be 6");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (2)`);
    console.log(`Q8 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 7) throw new Error("Index should be 7");
    
    res = await engine.processUserResponse("no");
    console.log(`User: no (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 7) throw new Error("Index should still be 7");
    
    res = await engine.processUserResponse("don't know");
    console.log(`User: don't know (2)`);
    console.log(`Q9 ${engine.currentQuestionIndex + 1}: ${res.text}`);
    if(engine.currentQuestionIndex !== 8) throw new Error("Index should be 8");
    
    res = await engine.processUserResponse("nothing");
    console.log(`User: nothing (1)`);
    console.log(`Clarification: ${res.text}`);
    if(engine.currentQuestionIndex !== 8) throw new Error("Index should still be 8");
    
    res = await engine.processUserResponse("nothing");
    console.log(`User: nothing (2)`);
    console.log(`COMPLETE: ${res.text}`);
    if(!res.conversation_complete) throw new Error("Conversation should be complete");
    
    console.log("TEST PASSED: ALL INVARIANTS SATISFIED.");
}

runTest().catch(console.error);



