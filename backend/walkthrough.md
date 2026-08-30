# End-to-End Walkthrough of Conversational Engine Stabilization

## 1. Exact Files Changed
- ackend/utils/assessmentEngine.js: Completely rewritten to enforce a strict backend-controlled state machine.
- ackend/routes/assessment.js: Updated the data mapping logic to extract the .extracted_value object properties correctly.
- 	est_engine.js: Created to simulate double-vague interactions and verify exactly-one index advancement.

## 2. Exact Root Cause
The LLM was being fed the entire conversation transcript and future phrasing pools, and it was implicitly tasked with deciding *when* to advance and *what* to ask next. This caused "context bleeding" where the LLM would infer it was still on an earlier question (like Q5) when the backend intended it to be on Q6.

## 3. Exact State-Machine Fix
The backend now acts as the sole authority over currentQuestionIndex, clarificationUsed, and phase transition. The LLM has been stripped of all state control and is now strictly a **Semantic Validator**. The backend uses the LLM to validate the answer, handles the state advancement, and manually constructs the final reply by selecting the next question directly from the hardcoded array.

## 4. Exact Gemini Request Contract
Gemini now receives only the absolute minimum context required to validate the *current* question:
- CURRENT QUESTION ID
- CURRENT QUESTION INTENT
- CURRENT QUESTION POOL
- ACKNOWLEDGEMENT POOL
- USER ANSWER
- AGE BAND
- CLARIFICATION ALREADY USED

## 5. Exact Gemini Response Contract
`json
{
  "answered": true,
  "extracted_value": "concise structured extraction",
  "response": "Got it.", // ONLY an acknowledgement or a single clarification
  "confidence": 0.9,
  "flag_for_review": false,
  "flag_reason": "if applicable"
}
`

## 6. How Clarification Handling Works
If Gemini determines the answer is vague (nswered: false), the backend checks clarificationUsed.
- If alse: The backend sets it to 	rue and returns Gemini's clarification (generated strictly from the *current* question pool).
- If 	rue: The backend marks the question as 
ot_available, forces dvanceExactlyOneQuestion(), and returns a short acknowledgement appended with the *next* question. Maximum 2 user responses per question.

## 7. How Repetition is Prevented
Gemini no longer generates the questions. The backend generates the questions by selecting from the hardcoded QUESTIONS array. The backend maintains a Set of skedQuestions to guarantee it never selects the exact same string twice, even for clarifications.

## 8. Automated Test Result
**PASSED**. I created 	est_engine.js to simulate a user providing double-vague answers ("i don't know" -> "i don't know") across Q4, Q5, Q6, and Q7. The backend correctly restricted clarifications to 1, marked the status as 
ot_available, and advanced exactly one index every time.

## 9. Clinical Wording Changes
**NONE**. The clinical phrasing pools in the system prompt were completely untouched. The only text added was the small ACKNOWLEDGEMENTS array (e.g., "Thanks for sharing that.", "Got it.") to enforce Rule 8 (Acknowledgement Rotation).

## 10. Remaining Limitations
If *both* Gemini and the fallback API fail simultaneously, the system relies on a hardcoded deterministic check (['dont know', 'not sure', ...]) to decide if an answer is vague. While this guarantees the assessment won't freeze during a network outage, a heavily misspelled vague answer (e.g., "idkkkk") might be treated as a valid answer if the APIs are down.
