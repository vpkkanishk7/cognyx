/**
 * COGNYX Centralized Multilingual Translation System (i18n)
 * Supported Languages: English (en), Tamil (ta), Hindi (hi)
 */

const translations = {
  en: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "Multimodal Digital Phenotyping & Cognitive Screening",
    nav_dashboard: "Dashboard",
    nav_assessment: "Assessment",
    nav_report: "Passport Report",
    nav_history: "History",
    nav_logout: "Logout",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "Deep Neural Phenotyping Engine",

    // Auth Screen
    auth_title: "Precision Cognitive Screening",
    auth_subtitle: "Enter subject identifier to initiate or resume assessment session.",
    auth_user_label: "Subject Username",
    auth_user_placeholder: "e.g. subject_042",
    auth_pass_label: "Access Password",
    auth_pass_placeholder: "••••••••",
    btn_login: "Access Terminal",
    btn_signup: "Register New Subject",
    auth_toggle_signup: "New user? Create an account",
    auth_toggle_login: "Existing user? Sign in",
    auth_status_ready: "System Ready • Cryptographic Authentication Enabled",

    // Dashboard
    dash_title: "Dashboard",
    dash_subtitle: "Session authenticated for subject",
    dash_card_new_title: "New Assessment",
    dash_card_new_desc: "Launch a full digital phenotyping battery including interview, reflex, working memory, geometric patterns, and visuospatial CDT.",
    dash_card_report_title: "View Latest Report",
    dash_card_report_desc: "Access your latest completed Cognitive Vitality Passport, domain radar charts, and PDF download.",
    dash_card_history_title: "Track History",
    dash_card_history_desc: "Access longitudinal records, historical pattern scores, and multi-session biometric progressions.",
    dash_quick_stats: "Longitudinal Summary",
    dash_last_score: "Last Vitality Score",
    dash_last_prob: "Screening Probability",
    dash_sessions_count: "Total Sessions",

    // Hardware & Sensor Setup
    setup_title: "Sensor & Sensorimotor Calibration",
    setup_subtitle: "Enable audio-visual inputs to activate digital biomarker capture.",
    setup_cam_title: "Optical Video Stream",
    setup_cam_desc: "Tracks oculomotor fixation, blink dynamics, and facial expressivity.",
    setup_mic_title: "Acoustic Audio Stream",
    setup_mic_desc: "Analyzes speech cadence, lexical latency, and prosodic stability.",
    setup_calib_title: "Eye-Tracking Calibration",
    setup_calib_desc: "Look directly at calibration targets to align WebGazer gaze vectors.",
    btn_start_sensors: "Initialize Sensors",
    btn_start_battery: "Begin Assessment Battery",
    sensor_ready: "Active & Calibrated",
    sensor_inactive: "Standby / Unavailable",

    // Phase 1: Conversational Dialogue (Chat)
    chat_header_title: "Clinical Conversational Dialogue",
    chat_header_subtitle: "Engage in an AI-guided conversational interview assessing orientation, lexical retrieval, and speech latency.",
    chat_placeholder: "Type your answer here or click microphone to speak...",
    btn_send: "Send",
    btn_mic: "Voice Input",
    voice_listening: "Listening to your voice (English / en-IN)...",
    voice_not_supported: "Voice input is not supported in this browser.",
    voice_unavailable: "English TTS voice is not available in your browser.",
    mic_listening: "Listening to your voice...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "Sensorimotor Reflex Test",
    reaction_desc: "When the central circle changes to GREEN, click or tap anywhere on the screen immediately.",
    reaction_instruction: "Click 'Start Test' when ready. Complete 3 trials.",
    reaction_trial_counter: "Trial",
    reaction_waiting: "Wait for green...",
    reaction_click_now: "CLICK NOW!",
    reaction_too_early: "Too early! Wait for the circle to turn green.",
    reaction_recorded: "Response Latency",
    reaction_median: "3-Trial Median",
    reaction_btn_start: "Start Reflex Test",
    reaction_btn_next: "Next Cognitive Task",

    // Phase 3: Working Memory Test
    memory_title: "Working Memory & Lexical Recall",
    memory_step1_title: "Memory Registration",
    memory_step1_desc: "Memorize the sequence of words presented below. You will be asked to recall them shortly.",
    memory_step2_title: "Delayed Recall",
    memory_step2_desc: "Type all the words you remember from earlier, separated by spaces or commas.",
    memory_input_placeholder: "Enter remembered words...",
    memory_btn_confirm: "Submit Recall",
    memory_score_label: "Recall Accuracy",
    memory_mic_btn: "Speak Words (Voice Input)",
    memory_mic_listening: "Listening... Speak the words you memorized",
    memory_mic_recognized: "Recognized Speech Transcript:",
    memory_mic_denied: "Microphone access unavailable or denied. Please select words from the grid.",
    memory_grid_desc: "Select or speak the 5 words shown during the memorization sequence:",
    memory_btn_start_memorize: "Start Memorization",
    memory_btn_skip_to_recall: "I'm Ready / Start Recall",
    memory_timer_prompt: "Memorize these 5 words. Recall begins shortly.",
    memory_memorize_countdown: "Memorize these words",

    // Phase 4: Abstract Pattern Reasoning
    pattern_title: "Abstract Geometric Pattern Reasoning",
    pattern_desc: "Analyze the 3x3 visual matrix and select the option that logically completes the geometric rule.",
    pattern_question_label: "Question",
    pattern_select_prompt: "Select the missing matrix tile:",
    pattern_btn_submit: "Confirm Selection",
    pattern_accuracy_label: "Pattern Score",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "Visuospatial Clock Construction (CDT)",
    clock_desc: "Draw a circular clock face with all 12 hour numbers and set the hands to show 10 minutes past 11 (11:10).",
    clock_tool_pencil: "Pencil",
    clock_tool_eraser: "Eraser",
    clock_tool_clear: "Clear Canvas",
    clock_btn_finish: "Submit Drawing & Analyze",

    // Processing & Synthesis Screen
    proc_title: "Multimodal Synthesis & AI Analysis",
    proc_subtitle: "Synthesizing cross-domain digital biomarkers, running trained ML screening inference, and generating report...",
    proc_step1: "Processing Conversational Cadence & Semantic Structure",
    proc_step2: "Evaluating Sensorimotor Latency & Psychometric Z-Scores",
    proc_step3: "Running Machine Learning Cognitive Screening Inference",
    proc_step4: "Generating Analytical AI Clinical Narrative (Groq LLM)",
    proc_step5: "Finalizing Cognitive Vitality Passport",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. Explainable Multimodal ML Screening & Factor Contribution",
    rep_ml_prob_label: "Estimated Cognitive Impairment Risk:",
    rep_ml_risk_label: "Risk Level:",
    rep_ml_model_label: "Model:",
    rep_ml_factors_heading: "Major Assessment Factors Influencing Screening Result:",
    rep_ml_prob_unavailable: "Reliable screening probability unavailable.",
    risk_low: "Low",
    risk_moderate: "Moderate",
    risk_elevated: "Elevated",
    risk_unavailable: "Unavailable",
    risk_tier_low: "Low Cognitive Risk",
    risk_tier_moderate: "Moderate Cognitive Risk",
    risk_tier_elevated: "Elevated Cognitive Risk",

    // Report Sections & Headers
    rep_header_title: "Cognitive Vitality Passport",
    rep_header_subtitle: "Comprehensive Multimodal Phenotyping & Cognitive Wellness Assessment",
    rep_subject_name: "Subject Name",
    rep_subject_id: "Session ID",
    rep_subject_age: "Subject Age",
    rep_subject_date: "Assessment Date",
    rep_overall_score: "Overall Cognitive Vitality Score",
    rep_sec1_title: "1. Core Biomarker & Assessment Matrix",
    rep_sec2_title: "2. Visual Analytics & Radar Profile",
    rep_sec3_title: "3. Age-Based Reference Comparison & Speed Benchmarks",
    rep_sec4_title: "4. Facial Movement & Affect Telemetry",
    rep_sec5_title: "5. Acoustic & Voice Biomarkers",
    rep_sec6_title: "6. Recorded Session Video",
    rep_sec8_title: "8. Analytical AI Narrative & Domain Interpretations",
    rep_sec9_title: "9. Actionable Cognitive Wellness Recommendations",
    rep_disclaimer_title: "Research & Non-Diagnostic Disclaimer",
    rep_disclaimer_body: "This assessment is an algorithmic cognitive-risk screening result generated for research and educational purposes. It is not a medical diagnosis and cannot diagnose dementia, Alzheimer's disease, or neurological disorders. Always consult a qualified neurologist or physician for clinical evaluations.",

    // Report Table Column Headers
    col_domain: "Cognitive Assessment Domain",
    col_measured: "Measured Result",
    col_baseline: "Age-Group Reference",
    col_status: "Performance Tier",

    // Action Buttons
    btn_download_pdf: "Download Full PDF Report",
    btn_back_dash: "Return to Dashboard",
    btn_view_history: "View Historical Sessions",

    // History Table
    hist_title: "Historical Assessment Records",
    hist_date: "Date & Time",
    hist_memory: "Memory",
    hist_pattern: "Pattern",
    hist_rx: "Reaction Time",
    hist_vitality: "Vitality Score",
    hist_prob: "ML Probability",
    hist_risk: "Risk Level",
    hist_status: "Screening Result",
    hist_no_records: "No recorded assessments found for this subject.",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "Thank you. We've finished our conversation. Now we'll try a short memory activity. I'll show you a few items and ask you to remember them. There's no need to rush. Just do your best.",
    trans_game_word: "Well done. You've completed the first memory activity. Next, we'll try another short memory activity. I'll explain it before we begin. I will show you a group of words to remember, followed by a larger list to select from.",
    trans_game_pattern: "Well done. That activity is complete. Now let's try the Geometric Pattern Recognition assessment. Observe each sequence, rotation, and matrix transformation, then select the matching shape.",
    trans_game_reaction: "Well done. That activity is complete. Next, we'll do a quick reaction activity. You will click the button as soon as it turns green.",
    trans_game_clock: "Well done. That activity is complete. Now we'll try a drawing activity. You will draw a clock face and set the time to 11:10.",
    trans_delayed_recall: "Well done. That activity is complete. For our final activity, I'd like you to recall the items you memorized earlier.",
    trans_report: "Thank you! All activities are complete. I am now preparing your summary.",
    memory_delayed_title: "Delayed Recall",
    memory_delayed_desc: "Earlier, I asked you to remember three words. Which ones do you remember?",
    clock_analyzing: "Analyzing Drawing...",
    time_remaining: "Time remaining",
    pattern_option: "Option",
    domain_memory: "Memory",
    domain_pattern: "Pattern Logic",
    domain_visuospatial: "Visuospatial",
    domain_reflex: "Reflex Speed",
    domain_fluency: "Fluency & Speech"
  },

  ta: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "பன்முக டிஜிட்டல் பினோடைப்பிங் மற்றும் அறிவாற்றல் பரிசோதனை",
    nav_dashboard: "முகப்பு",
    nav_assessment: "பரிசோதனை",
    nav_report: "மருத்துவ அறிக்கை",
    nav_history: "வரலாறு",
    nav_logout: "வெளியேறு",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "ஆழ்ந்த நரம்பியல் பினோடைப்பிங் இயந்திரம்",

    // Auth Screen
    auth_title: "துல்லிய அறிவாற்றல் பரிசோதனை",
    auth_subtitle: "பரிசோதனை அமர்வைத் தொடங்க பயனர்பெயரை உள்ளிடவும்.",
    auth_user_label: "பயனர் பெயர்",
    auth_user_placeholder: "எ.கா. subject_042",
    auth_pass_label: "கடவுச்சொல்",
    auth_pass_placeholder: "••••••••",
    btn_login: "உள்நுழைக",
    btn_signup: "புதிய கணக்கு பதிவு செய்க",
    auth_toggle_signup: "புதிய பயனரா? கணக்கை உருவாக்கவும்",
    auth_toggle_login: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
    auth_status_ready: "அமைப்பு தயார் • மறைகுறியாக்க பாதுகாப்பு இயக்கப்பட்டது",

    // Dashboard
    dash_title: "முகப்பு கட்டுப்பாட்டகம்",
    dash_subtitle: "அங்கீகரிக்கப்பட்ட பயனர் அமர்வு",
    dash_card_new_title: "புதிய பரிசோதனை",
    dash_card_new_desc: "உரையாடல், எதிர்வினை நேரம், நினைவுத்திறன், வடிவ முறை மற்றும் கடிகார வரைதல் அடங்கிய முழுமையான பரிசோதனையைத் தொடங்குங்கள்.",
    dash_card_report_title: "சமீபத்திய அறிக்கை",
    dash_card_report_desc: "உங்கள் சமீபத்திய அறிவாற்றல் பாஸ்போர்ட், வரைபடங்கள் மற்றும் PDF பதிவிறக்கத்தைப் பெறுங்கள்.",
    dash_card_history_title: "வரலாற்றுப் பதிவுகள்",
    dash_card_history_desc: "முந்தைய பரிசோதனைகள், முன்னேற்ற வரைபடங்கள் மற்றும் மதிப்பெண்களைக் காண்க.",
    dash_quick_stats: "நீண்டகால சுருக்கம்",
    dash_last_score: "கடைசி அறிவாற்றல் மதிப்பெண்",
    dash_last_prob: "பரிசோதனை நிகழ்தகவு",
    dash_sessions_count: "மொத்த அமர்வுகள்",

    // Hardware & Sensor Setup
    setup_title: "சென்சார் & உணரி அளவுத்திருத்தம்",
    setup_subtitle: "டிஜிட்டல் பயோமார்க் அமைப்பை இயக்க கேமரா மற்றும் மைக்கை இயக்கவும்.",
    setup_cam_title: "கேமரா வீடியோ ஸ்ட்ரீம்",
    setup_cam_desc: "கண் அசைவு, இமைத்தல் மற்றும் முக உணர்ச்சி மாறுதல்களை கண்காணிக்கிறது.",
    setup_mic_title: "குரல் ஆடியோ ஸ்ட்ரீம்",
    setup_mic_desc: "பேச்சு வேகம், இடைநிறுத்தம் மற்றும் குரல் நிலைத்தன்மையை ஆராய்கிறது.",
    setup_calib_title: "கண் பார்வை அளவுத்திருத்தம்",
    setup_calib_desc: "கண் பார்வையை சீரமைக்க திரையில் உள்ள புள்ளிகளை நேரடியாகப் பார்க்கவும்.",
    btn_start_sensors: "சென்சார்களை இயக்குக",
    btn_start_battery: "பரிசோதனையைத் தொடங்கு",
    sensor_ready: "இயக்கத்தில் உள்ளது • அளவுத்திருத்தம் முடிந்தது",
    sensor_inactive: "காத்திருப்பு / கிடைக்கவில்லை",

    // Phase 1: Conversational Dialogue (Chat)
    chat_header_title: "மருத்துவ உரையாடல் பரிசோதனை",
    chat_header_subtitle: "நோக்குநிலை, சொல் மீட்பு மற்றும் பேச்சு வேகத்தை மதிப்பிடும் AI வழிகாட்டப்பட்ட உரையாடலில் ஈடுபடுங்கள்.",
    chat_placeholder: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும் அல்லது மைக்ரோஃபோனைப் பயன்படுத்தவும்...",
    btn_send: "அனுப்பு",
    btn_mic: "குரல் உள்ளீடு",
    voice_listening: "உங்கள் குரலைக் கேட்கிறது (தமிழ் / ta-IN)...",
    voice_not_supported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.",
    voice_unavailable: "உங்கள் உலாவியில் தமிழ் பேச்சு குரல் (ta-*) கிடைக்கவில்லை.",
    mic_listening: "உங்கள் குரலைக் கேட்கிறது...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "எதிர்வினை வேகப் பரிசோதனை (பச்சை இலக்கு)",
    reaction_desc: "மைய வட்டம் பச்சையாக மாறும்போது, உடனடியாக திரையை கிளிக் செய்யவும் அல்லது தொடவும்.",
    reaction_instruction: "தயாரானதும் 'சோதனையைத் தொடங்கு' என்பதைக் கிளிக் செய்யவும். 3 சுற்றுகளை முடிக்கவும்.",
    reaction_trial_counter: "சுற்று",
    reaction_waiting: "பச்சை நிறத்திற்காக காத்திருங்கள்...",
    reaction_click_now: "இப்போது கிளிக் செய்யவும்!",
    reaction_too_early: "மிக விரைவில் அழுத்திவிட்டீர்கள்! வட்டம் பச்சையாக மாறும் வரை காத்திருக்கவும்.",
    reaction_recorded: "பதில் நேரம்",
    reaction_median: "3 சுற்றுகளின் சராசரி",
    reaction_btn_start: "சோதனையைத் தொடங்கு",
    reaction_btn_next: "அடுத்த சோதனை",

    // Phase 3: Working Memory Test
    memory_title: "செயல் நினைவகம் மற்றும் சொல் மீட்பு",
    memory_step1_title: "சொல் பதிவு",
    memory_step1_desc: "கீழே காண்பிக்கப்படும் வார்த்தைகளை நினைவில் வைத்துக் கொள்ளுங்கள். சிறிது நேரத்தில் அவற்றை நினைவுபடுத்த வேண்டும்.",
    memory_step2_title: "நினைவுபடுத்தி எழுதுதல்",
    memory_step2_desc: "முன்பு பார்த்த வார்த்தைகளை இடைவெளி அல்லது காற்புள்ளியிட்டு தட்டச்சு செய்யவும்.",
    memory_input_placeholder: "நினைவுள்ள வார்த்தைகளை உள்ளிடவும்...",
    memory_btn_confirm: "சமர்ப்பிக்கவும்",
    memory_score_label: "நினைவுத் துல்லியம்",
    memory_mic_btn: "வார்த்தைகளைப் பேசுங்கள் (குரல் உள்ளீடு)",
    memory_mic_listening: "கேட்கிறது... நீங்கள் நினைவில் வைத்த வார்த்தைகளைப் பேசுங்கள்",
    memory_mic_recognized: "குரல் வழி பெறப்பட்ட வார்த்தைகள்:",
    memory_mic_denied: "மைக்ரோஃபோன் அனுமதி கிடைக்கவில்லை. கீழே உள்ள கட்டத்திலிருந்து தேர்ந்தெடுக்கவும்.",
    memory_grid_desc: "நினைவில் வைத்த வரிசையில் காட்டப்பட்ட 5 வார்த்தைகளைத் தேர்ந்தெடுக்கவும் அல்லது பேசவும்:",
    memory_btn_start_memorize: "நினைவாற்றல் பயிற்சியைத் தொடங்கு",
    memory_btn_skip_to_recall: "நான் தயார் / நினைவுகூரத் தொடங்கு",
    memory_timer_prompt: "இந்த 5 வார்த்தைகளை நினைவில் வைத்துக் கொள்ளுங்கள்.",
    memory_memorize_countdown: "இந்த வார்த்தைகளை நினைவில் வைத்துக் கொள்ளுங்கள்",

    // Phase 4: Abstract Pattern Reasoning
    pattern_title: "வடிவ முறை மற்றும் தருக்க சிந்தனை",
    pattern_desc: "3x3 மேட்ரிக்ஸை ஆராய்ந்து, விடுபட்ட கட்டத்திற்கு பொருத்தமான சரியான விருப்பத்தைத் தேர்ந்தெடுக்கவும்.",
    pattern_question_label: "கேள்வி",
    pattern_select_prompt: "பொருத்தமான கட்டத்தைத் தேர்ந்தெடுக்கவும்:",
    pattern_btn_submit: "தேர்வை உறுதிப்படுத்து",
    pattern_accuracy_label: "வடிவ மதிப்பெண்",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "கடிகார வரைதல் சோதனை (11:10)",
    clock_desc: "ஒரு வட்டக் கடிகாரத்தை வரைந்து, 12 எண்களையும் குறித்து, நேரம் 11 மணி 10 நிமிடம் (11:10) காட்டுமாறு முட்களை வரையவும்.",
    clock_tool_pencil: "பென்சில்",
    clock_tool_eraser: "அழிப்பான்",
    clock_tool_clear: "அனைத்தையும் அழி",
    clock_btn_finish: "வரைபடத்தை சமர்ப்பித்து பகுப்பாய்வு செய்க",

    // Processing & Synthesis Screen
    proc_title: "பன்முக ஒருங்கிணைப்பு & AI பகுப்பாய்வு",
    proc_subtitle: "டிஜிட்டல் பயோமார்க்கர்களை ஒருங்கிணைத்து, பயிற்சி பெற்ற ML மாதிரி மூலம் அறிக்கை உருவாக்கப்படுகிறது...",
    proc_step1: "உரையாடல் வேகம் மற்றும் வாக்கிய அமைப்பைப் பகுப்பாய்வு செய்கிறது",
    proc_step2: "எதிர்வினை வேகம் மற்றும் Z-மதிப்பெண்களைக் கணக்கிடுகிறது",
    proc_step3: "இயந்திர கற்றல் (ML) பரிசோதனை மாதிரியை இயக்குகிறது",
    proc_step4: "மருத்துவ AI பகுப்பாய்வை உருவாக்குகிறது (Groq LLM)",
    proc_step5: "அறிவாற்றல் பாஸ்போர்ட்டை இறுதி செய்கிறது",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. இயந்திர கற்றல் (ML) பரிசோதனை & காரணிகள்",
    rep_ml_prob_label: "மதிப்பிடப்பட்ட அறிவாற்றல் குறைபாடு ஆபத்து:",
    rep_ml_risk_label: "ஆபத்து நிலை:",
    rep_ml_model_label: "மாதிரி (Model):",
    rep_ml_factors_heading: "பரிசோதனை முடிவை பாதிக்கும் முக்கிய காரணிகள்:",
    rep_ml_prob_unavailable: "நம்பகமான பரிசோதனை நிகழ்தகவு கிடைக்கவில்லை.",
    risk_low: "குறைந்த (Low)",
    risk_moderate: "மிதமான (Moderate)",
    risk_elevated: "தீவிர (Elevated)",
    risk_unavailable: "கிடைக்கவில்லை (Unavailable)",
    risk_tier_low: "குறைந்த அறிவாற்றல் ஆபத்து",
    risk_tier_moderate: "மிதமான அறிவாற்றல் ஆபத்து",
    risk_tier_elevated: "தீவிர அறிவாற்றல் ஆபத்து",

    // Report Sections & Headers
    rep_header_title: "அறிவாற்றல் திறன் பாஸ்போர்ட்",
    rep_header_subtitle: "முழுமையான பன்முக டிஜிட்டல் பினோடைப்பிங் அறிக்கை",
    rep_subject_name: "பயனர் பெயர்",
    rep_subject_id: "அமர்வு எண்",
    rep_subject_age: "வயது",
    rep_subject_date: "பரிசோதனை தேதி",
    rep_overall_score: "ஒட்டுமொத்த அறிவாற்றல் மதிப்பெண்",
    rep_sec1_title: "1. முக்கிய பயோமார்க் & பரிசோதனை அட்டவணை",
    rep_sec2_title: "2. காட்சிப் பகுப்பாய்வு & ரேடார் விளக்கப்படம்",
    rep_sec3_title: "3. வயது அடிப்படையிலான ஒப்பீடு & வேக அளவீடுகள்",
    rep_sec4_title: "4. முக அசைவு மற்றும் உணர்ச்சி அளவீடுகள்",
    rep_sec5_title: "5. குரல் மற்றும் ஒலிப் பயோமார்க்கர்கள்",
    rep_sec6_title: "6. அமர்வு பதிவு செய்யப்பட்ட வீடியோ",
    rep_sec8_title: "8. மருத்துவ AI பகுப்பாய்வு & விளக்கவுரை",
    rep_sec9_title: "9. செயல்முறை ஆரோக்கிய பரிந்துரைகள்",
    rep_disclaimer_title: "ஆராய்ச்சி மற்றும் மருத்துவ மறுப்பு",
    rep_disclaimer_body: "இந்த மதிப்பீடு ஆராய்ச்சி மற்றும் கல்வி நோக்கங்களுக்காக உருவாக்கப்பட்ட அல்காரிதமிக் பரிசோதனை முடிவு மட்டுமே. இது மருத்துவ நோயறிதல் அல்ல, டிமென்ஷியா அல்லது பிற நரம்பியல் நோய்களைக் கண்டறிய முடியாது. மருத்துவ ஆலோசனைக்கு தகுதியான நரம்பியல் மருத்துவரை அணுகவும்.",

    // Report Table Column Headers
    col_domain: "அறிவாற்றல் பிரிவு",
    col_measured: "அளவிடப்பட்ட முடிவு",
    col_baseline: "வயதுக் குழு ஒப்பீடு",
    col_status: "செயல்திறன் நிலை",

    // Action Buttons
    btn_download_pdf: "முழு PDF அறிக்கையைப் பதிவிறக்குக",
    btn_back_dash: "முகப்பிற்குத் திரும்பு",
    btn_view_history: "முந்தைய பதிவுகளைக் காண்க",

    // History Table
    hist_title: "முந்தைய பரிசோதனை பதிவுகள்",
    hist_date: "தேதி & நேரம்",
    hist_memory: "நினைவகம்",
    hist_pattern: "வடிவம்",
    hist_rx: "எதிர்வினை நேரம்",
    hist_vitality: "மதிப்பெண்",
    hist_prob: "ML நிகழ்தகவு",
    hist_risk: "ஆபத்து நிலை",
    hist_status: "முடிவு",
    hist_no_records: "பதிவுகள் எதுவும் கிடைக்கவில்லை.",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "நன்றி. நமது உரையாடல் நிறைவடைந்தது. இப்போது ஒரு குறுகிய நினைவக செயல்பாட்டை முயற்சிப்போம். சில வார்த்தைகளை நினைவில் வைத்துக் கொள்ளுங்கள். பதற்றப்படாமல் உங்கள் சிறந்த முயற்சியை மேற்கொள்ளுங்கள்.",
    trans_game_word: "நன்று. முதல் நினைவகப் பயிற்சி முடிந்தது. அடுத்து, மற்றொரு நினைவகப் பயிற்சியை முயற்சிப்போம். தொடங்குவதற்கு முன் விளக்குகிறேன். சில வார்த்தைகளை நினைவில் கொள்ள காட்டிய பின், பெரிய பட்டியலிலிருந்து அவற்றைத் தேர்ந்தெடுக்க வேண்டும்.",
    trans_game_pattern: "நன்று. அந்தப் பயிற்சி முடிந்தது. இப்போது வடிவியல் வடிவ முறை அங்கீகாரப் பரிசோதனையை முயற்சிப்போம். ஒவ்வொரு வரிசை, சுழற்சி மற்றும் மாற்றத்தை கவனித்து, பொருத்தமான வடிவத்தைத் தேர்ந்தெடுக்கவும்.",
    trans_game_reaction: "நன்று. அந்தப் பயிற்சி முடிந்தது. அடுத்து, விரைவான எதிர்வினை வேகப் பயிற்சியை மேற்கொள்வோம். பொத்தான் பச்சையாக மாறியவுடன் அதை உடனே கிளிக் செய்யவும்.",
    trans_game_clock: "நன்று. அந்தப் பயிற்சி முடிந்தது. இப்போது ஒரு வரைதல் பயிற்சியை முயற்சிப்போம். ஒரு கடிகார முகப்பை வரைந்து நேரத்தை 11:10 என குறிக்கவும்.",
    trans_delayed_recall: "நன்று. அந்தப் பயிற்சி முடிந்தது. நமது இறுதிப் பயிற்சியாக, முன்பு நீங்கள் நினைவில் வைத்த வார்த்தைகளை நினைவுபடுத்திக் கூறுங்கள்.",
    trans_report: "மிக்க நன்றி! அனைத்துப் பயிற்சிகளும் முடிவடைந்தன. உங்கள் விரிவான அறிக்கையை தயார் செய்கிறேன்.",
    memory_delayed_title: "தாமதமான நினைவுபடுத்தல்",
    memory_delayed_desc: "முன்பு 3 வார்த்தைகளை நினைவில் கொள்ளக் கூறினேன். அவற்றில் எவை நினைவில் உள்ளன?",
    clock_analyzing: "படம் பகுப்பாய்வு செய்யப்படுகிறது...",
    time_remaining: "மீதமுள்ள நேரம்",
    pattern_option: "விருப்பம்",
    domain_memory: "நினைவகம்",
    domain_pattern: "வடிவ முறை",
    domain_visuospatial: "காட்சிவெளித் திறன்",
    domain_reflex: "எதிர்வினை வேகம்",
    domain_fluency: "பேச்சு சரளம்"
  },

  hi: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "मल्टीमॉडल डिजिटल फेनोटाइपिंग और संज्ञानात्मक स्क्रीनिंग",
    nav_dashboard: "डैशबोर्ड",
    nav_assessment: "मूल्यांकन",
    nav_report: "पासपोर्ट रिपोर्ट",
    nav_history: "इतिहास",
    nav_logout: "लॉगआउट",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "डीप न्यूरल फेनोटाइपिंग इंजन",

    // Auth Screen
    auth_title: "सटीक संज्ञानात्मक स्क्रीनिंग",
    auth_subtitle: "सत्र शुरू करने या पुनः आरंभ करने के लिए यूजरनेम दर्ज करें।",
    auth_user_label: "यूजरनेम",
    auth_user_placeholder: "उदा. subject_042",
    auth_pass_label: "पासवर्ड",
    auth_pass_placeholder: "••••••••",
    btn_login: "लॉग इन करें",
    btn_signup: "नया खाता बनाएं",
    auth_toggle_signup: "नए उपयोगकर्ता? खाता बनाएं",
    auth_toggle_login: "पहले से खाता है? साइन इन करें",
    auth_status_ready: "सिस्टम तैयार है • क्रिप्टोग्राफिक सुरक्षा सक्षम",

    // Dashboard
    dash_title: "डैशबोर्ड",
    dash_subtitle: "सत्यापित उपयोगकर्ता सत्र",
    dash_card_new_title: "नया मूल्यांकन",
    dash_card_new_desc: "संवाद, प्रतिक्रिया समय, स्मृति, पैटर्न तर्क और घड़ी निर्माण सहित संपूर्ण संज्ञानात्मक परीक्षण शुरू करें।",
    dash_card_report_title: "नवीनतम रिपोर्ट देखें",
    dash_card_report_desc: "अपना नवीनतम संज्ञानात्मक पासपोर्ट, रडार चार्ट और पीडीएफ डाउनलोड प्राप्त करें।",
    dash_card_history_title: "इतिहास ट्रैक करें",
    dash_card_history_desc: "पिछले मूल्यांकन रिकॉर्ड, प्रगति रेखांकन और स्कोर का विश्लेषण करें।",
    dash_quick_stats: "दीर्घकालिक सारांश",
    dash_last_score: "अंतिम संज्ञानात्मक स्कोर",
    dash_last_prob: "स्क्रीनिंग संभावना",
    dash_sessions_count: "कुल सत्र",

    // Hardware & Sensor Setup
    setup_title: "सेंसर और इनपुट कैलिब्रेशन",
    setup_subtitle: "डिजिटल बायोमार्कर एकत्र करने के लिए कैमरा और माइक्रोफ़ोन सक्षम करें।",
    setup_cam_title: "कैमरा वीडियो स्ट्रीम",
    setup_cam_desc: "नेत्र गति, पलक झपकना और चेहरे की भाव-भंगिमा को ट्रैक करता है।",
    setup_mic_title: "ध्वनि ऑडियो स्ट्रीम",
    setup_mic_desc: "बोलने की गति, ठहराव और आवाज की स्थिरता का विश्लेषण करता है।",
    setup_calib_title: "आई-ट्रैकिंग कैलिब्रेशन",
    setup_calib_desc: "स्क्रीन पर दिए गए बिंदुओं को सीधे देखकर दृष्टि संरेखित करें।",
    btn_start_sensors: "सेंसर सक्रिय करें",
    btn_start_battery: "परीक्षण शुरू करें",
    sensor_ready: "सक्रिय • कैलिब्रेशन पूर्ण",
    sensor_inactive: "प्रतीक्षारत / अनुपलब्ध",

    // Phase 1: Conversational Dialogue (Chat)
    chat_header_title: "क्लिनिकल संवादात्मक मूल्यांकन",
    chat_header_subtitle: "दिशा, शब्द स्मरण और बोलने की गति का आकलन करने वाले AI संवाद में भाग लें।",
    chat_placeholder: "अपना उत्तर यहाँ लिखें या बोलने के लिए माइक पर क्लिक करें...",
    btn_send: "भेजें",
    btn_mic: "आवाज इनपुट",
    voice_listening: "आपकी आवाज़ सुनी जा रही है (हिन्दी / hi-IN)...",
    voice_not_supported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।",
    voice_unavailable: "आपके ब्राउज़र में हिंदी आवाज़ (hi-*) उपलब्ध नहीं है।",
    mic_listening: "आपकी आवाज़ सुनी जा रही है...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "सेंसरिमोटर प्रतिक्रिया परीक्षण (हरा लक्ष्य)",
    reaction_desc: "जब केंद्र का वृत्त हरा हो जाए, तो तुरंत स्क्रीन पर कहीं भी क्लिक या टैप करें।",
    reaction_instruction: "तैयार होने पर 'परीक्षण शुरू करें' पर क्लिक करें। कुल 3 राउंड पूरे करें।",
    reaction_trial_counter: "राउंड",
    reaction_waiting: "हरे रंग की प्रतीक्षा करें...",
    reaction_click_now: "अभी क्लिक करें!",
    reaction_too_early: "बहुत जल्दी क्लिक किया! वृत्त के हरे होने तक प्रतीक्षा करें।",
    reaction_recorded: "प्रतिक्रिया समय",
    reaction_median: "3 राउंड का औसत",
    reaction_btn_start: "परीक्षण शुरू करें",
    reaction_btn_next: "अगला परीक्षण",

    // Phase 3: Working Memory Test
    memory_title: "कार्यशील स्मृति और शब्द स्मरण",
    memory_step1_title: "शब्द पंजीकरण",
    memory_step1_desc: "नीचे दिखाए गए शब्दों को ध्यान से याद रखें। थोड़ी देर बाद आपसे इन्हें दोहराने को कहा जाएगा।",
    memory_step2_title: "स्मरण परीक्षण",
    memory_step2_desc: "पहले दिखाए गए शब्दों को याद करके स्पेस या कॉमा के साथ टाइप करें।",
    memory_input_placeholder: "याद किए गए शब्द यहाँ दर्ज करें...",
    memory_btn_confirm: "जमा करें",
    memory_score_label: "स्मरण सटीकता",
    memory_mic_btn: "शब्द बोलें (आवाज इनपुट)",
    memory_mic_listening: "सुन रहा है... याद किए गए शब्द बोलें",
    memory_mic_recognized: "आवाज से पहचाने गए शब्द:",
    memory_mic_denied: "माइक्रोफ़ोन अनुमति अनुपलब्ध है। कृपया नीचे दिए गए ग्रिड से शब्द चुनें।",
    memory_grid_desc: "याद रखने के क्रम में दिखाए गए 5 शब्दों को चुनें या बोलें:",
    memory_btn_start_memorize: "स्मरण अभ्यास शुरू करें",
    memory_btn_skip_to_recall: "मैं तैयार हूँ / स्मरण शुरू करें",
    memory_timer_prompt: "इन 5 शब्दों को ध्यान से याद रखें।",
    memory_memorize_countdown: "इन शब्दों को ध्यान से याद रखें",

    // Phase 4: Abstract Pattern Reasoning
    pattern_title: "पैटर्न तर्क और ज्यामितीय अनुक्रम",
    pattern_desc: "3x3 मैट्रिक्स का विश्लेषण करें और तार्किक रूप से खाली स्थान भरने वाला सही विकल्प चुनें।",
    pattern_question_label: "प्रश्न",
    pattern_select_prompt: "सही टाइल चुनें:",
    pattern_btn_submit: "चयन की पुष्टि करें",
    pattern_accuracy_label: "पैटर्न स्कोर",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "घड़ी निर्माण परीक्षण (11:10)",
    clock_desc: "एक गोल घड़ी बनाएं, 12 तक सभी अंक लिखें और 11 बजकर 10 मिनट (11:10) का समय दिखाने के लिए सुइयां बनाएं।",
    clock_tool_pencil: "पेंसिल",
    clock_tool_eraser: "इरेज़र",
    clock_tool_clear: "कैनवास साफ़ करें",
    clock_btn_finish: "ड्राइंग जमा करें और विश्लेषण करें",

    // Processing & Synthesis Screen
    proc_title: "मल्टीमॉडल संश्लेषण और AI विश्लेषण",
    proc_subtitle: "डिजिटल बायोमार्करों को संसाधित कर प्रशिक्षित ML मॉडल द्वारा रिपोर्ट तैयार की जा रही है...",
    proc_step1: "संवाद गति और वाक्य संरचना का विश्लेषण",
    proc_step2: "प्रतिक्रिया समय और Z-स्कोर का मूल्यांकन",
    proc_step3: "मशीन लर्निंग (ML) संज्ञानात्मक स्क्रीनिंग निष्पादन",
    proc_step4: "क्लिनिकल AI विश्लेषण का निर्माण (Groq LLM)",
    proc_step5: "संज्ञानात्मक पासपोर्ट को अंतिम रूप देना",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. मशीन लर्निंग (ML) स्क्रीनिंग और कारक योगदान",
    rep_ml_prob_label: "अनुमानित संज्ञानात्मक हानि जोखिम:",
    rep_ml_risk_label: "जोखिम स्तर:",
    rep_ml_model_label: "मॉडल (Model):",
    rep_ml_factors_heading: "स्क्रीनिंग परिणाम को प्रभावित करने वाले मुख्य कारक:",
    rep_ml_prob_unavailable: "विश्वसनीय स्क्रीनिंग संभावना अनुपलब्ध है।",
    risk_low: "कम (Low)",
    risk_moderate: "मध्यम (Moderate)",
    risk_elevated: "उच्च (Elevated)",
    risk_unavailable: "अनुपलब्ध (Unavailable)",
    risk_tier_low: "कम संज्ञानात्मक जोखिम",
    risk_tier_moderate: "मध्यम संज्ञानात्मक जोखिम",
    risk_tier_elevated: "उच्च संज्ञानात्मक जोखिम",

    // Report Sections & Headers
    rep_header_title: "संज्ञानात्मक स्वास्थ्य पासपोर्ट",
    rep_header_subtitle: "व्यापक मल्टीमॉडल डिजिटल फेनोटाइपिंग रिपोर्ट",
    rep_subject_name: "उपयोगकर्ता का नाम",
    rep_subject_id: "सत्र आईडी",
    rep_subject_age: "आयु",
    rep_subject_date: "परीक्षण तिथि",
    rep_overall_score: "समग्र संज्ञानात्मक स्कोर",
    rep_sec1_title: "1. मुख्य बायोमार्कर और परीक्षण मैट्रिक्स",
    rep_sec2_title: "2. विज़ुअल एनालिटिक्स और रडार प्रोफ़ाइल",
    rep_sec3_title: "3. आयु-आधारित संदर्भ तुलना और गति बेंचमार्क",
    rep_sec4_title: "4. चेहरे की गति और भाव विश्लेषण",
    rep_sec5_title: "5. ध्वनि और आवाज बायोमार्कर",
    rep_sec6_title: "6. सत्र का रिकॉर्ड किया गया वीडियो",
    rep_sec8_title: "8. क्लिनिकल AI सारांश और व्याख्या",
    rep_sec9_title: "9. संज्ञानात्मक कल्याण संबंधी सुझाव",
    rep_disclaimer_title: "अनुसंधान और गैर-नैदानिक अस्वीकरण",
    rep_disclaimer_body: "यह मूल्यांकन केवल अनुसंधान और शैक्षिक उद्देश्यों के लिए एक एल्गोरिद्मिक स्क्रीनिंग परिणाम है। यह कोई चिकित्सीय निदान नहीं है और डिमेंशिया या अन्य न्यूरोलॉजिकल विकारों का निदान नहीं कर सकता। चिकित्सीय सलाह के लिए हमेशा योग्य न्यूरोलॉजिस्ट से संपर्क करें।",

    // Report Table Column Headers
    col_domain: "संज्ञानात्मक क्षेत्र",
    col_measured: "मापा गया परिणाम",
    col_baseline: "आयु समूह संदर्भ",
    col_status: "प्रदर्शन स्तर",

    // Action Buttons
    btn_download_pdf: "पूर्ण PDF रिपोर्ट डाउनलोड करें",
    btn_back_dash: "डैशबोर्ड पर लौटें",
    btn_view_history: "पिछला इतिहास देखें",

    // History Table
    hist_title: "ऐतिहासिक मूल्यांकन रिकॉर्ड",
    hist_date: "तिथि और समय",
    hist_memory: "स्मृति",
    hist_pattern: "पैटर्न",
    hist_rx: "प्रतिक्रिया समय",
    hist_vitality: "स्कोर",
    hist_prob: "ML संभावना",
    hist_risk: "जोखिम स्तर",
    hist_status: "परिणाम",
    hist_no_records: "इस उपयोगकर्ता के लिए कोई रिकॉर्ड नहीं मिला.",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "धन्यवाद। हमारी बातचीत पूरी हो गई है। अब हम एक संक्षिप्त स्मृति गतिविधि करेंगे। मैं आपको कुछ शब्द दिखाऊंगा जिन्हें आपको याद रखना है। बिल्कुल जल्दबाजी न करें, बस अपना सर्वश्रेष्ठ प्रयास करें।",
    trans_game_word: "बहुत अच्छा। पहली स्मृति गतिविधि पूरी हो गई है। अगला, हम एक और संक्षिप्त स्मृति परीक्षण करेंगे। मैं शुरू करने से पहले समझाता हूँ। मैं आपको याद रखने के लिए कुछ शब्द दिखाऊँगा, फिर एक बड़ी सूची से उन्हें चुनना होगा।",
    trans_game_pattern: "बहुत अच्छा। वह गतिविधि पूरी हो गई है। अब ज्यामितीय पैटर्न पहचान परीक्षण करते हैं। प्रत्येक अनुक्रम, घूर्णन और मैट्रिक्स परिवर्तन को ध्यान से देखें और सही आकार चुनें।",
    trans_game_reaction: "बहुत अच्छा। वह गतिविधि पूरी हो गई है। अगला, हम एक त्वरित प्रतिक्रिया गतिविधि करेंगे। बटन के हरे होते ही तुरंत क्लिक करें।",
    trans_game_clock: "बहुत अच्छा। वह गतिविधि पूरी हो गई है। अब एक ड्राइंग गतिविधि करेंगे। एक घड़ी का डायल बनाएं और समय 11:10 निर्धारित करें।",
    trans_delayed_recall: "बहुत अच्छा। वह गतिविधि पूरी हो गई है। हमारी अंतिम गतिविधि के रूप में, कृपया उन शब्दों को याद करें जो आपने पहले याद किए थे।",
    trans_report: "बहुत-बहुत धन्यवाद! सभी गतिविधियाँ पूरी हो चुकी हैं। मैं अब आपकी विस्तृत रिपोर्ट तैयार कर रहा हूँ।",
    memory_delayed_title: "विलंबित स्मरण परीक्षण",
    memory_delayed_desc: "पहले मैंने आपको तीन शब्द याद रखने को कहा था। आपको कौन से याद हैं?",
    clock_analyzing: "चित्र का विश्लेषण किया जा रहा है...",
    time_remaining: "शेष समय",
    pattern_option: "विकल्प",
    domain_memory: "स्मृति",
    domain_pattern: "पैटर्न तर्क",
    domain_visuospatial: "दृश्य-स्थानिक",
    domain_reflex: "प्रतिक्रिया गति",
    domain_fluency: "भाषा प्रवाह"
  }
};

// Centralized Assessment Test Data Dictionary (Language-Aware Content)
const MEMORY_WORDS_DATA = {
  en: ["APPLE", "TABLE", "PENNY"],
  ta: ["ஆப்பிள்", "மேசை", "நாணயம்"],
  hi: ["सेब", "मेज", "सिक्का"]
};

const WORKING_MEMORY_WORDS_DATA = {
  en: [
    "APPLE", "RIVER", "CHAIR", "BREAD", "HOUSE", "TABLE", "GARDEN", "BOOK", "WATER", "HORSE",
    "SHIRT", "WINDOW", "ORANGE", "FLOWER", "PILLOW", "BRIDGE", "CANDLE", "FOREST", "TRAIN", "CLOCK",
    "MIRROR", "SILVER", "DOCTOR", "GUITAR", "BUTTER", "MARKET", "OCEAN", "VILLAGE", "CASTLE", "BOTTLE"
  ],
  ta: [
    "ஆப்பிள்", "ஆறு", "நாற்காலி", "ரொட்டி", "வீடு", "மேசை", "தோட்டம்", "புத்தகம்", "தண்ணீர்", "குதிரை",
    "சட்டை", "சன்னல்", "ஆரஞ்சு", "மலர்", "தலையணை", "பாலம்", "மெழுகுவர்த்தி", "காடு", "ரயில்", "கடிகாரம்",
    "கண்ணாடி", "வெள்ளி", "மருத்துவர்", "கிட்டார்", "வெண்ணெய்", "சந்தை", "கடல்", "கிராமம்", "கோட்டை", "பாட்டில்"
  ],
  hi: [
    "सेब", "नदी", "कुर्सी", "रोटी", "घर", "मेज", "बगीचा", "किताब", "पानी", "घोड़ा",
    "कमीज", "खिड़की", "संतरा", "फूल", "तकिया", "पुल", "मोमबत्ती", "जंगल", "ट्रेन", "घड़ी",
    "दर्पण", "चांदी", "डॉक्टर", "गिटार", "मक्खन", "बाजार", "समुद्र", "गांव", "किला", "बोतल"
  ]
};

const PATTERN_QUESTIONS_LOCALIZED = [
  {
    en: { difficulty: "Level 1: Alternation", instruction: "Identify the alternating shape pattern and select the next shape:" },
    ta: { difficulty: "நிலை 1: மாறுபடும் வரிசை", instruction: "வடிவ வரிசை அமைப்பைக் கண்டறிந்து அடுத்த வடிவத்தைத் தேர்ந்தெடுக்கவும்:" },
    hi: { difficulty: "स्तर 1: प्रत्यावर्तन", instruction: "बारी-बारी से आने वाले आकार पैटर्न को पहचानें और अगला आकार चुनें:" }
  },
  {
    en: { difficulty: "Level 1: Rotational Step", instruction: "Observe the 90° clockwise rotation and determine the next orientation:" },
    ta: { difficulty: "நிலை 1: சுழற்சி படி", instruction: "90° கடிகார சுழற்சியைக் கவனித்து அடுத்த திசையைத் தீர்மானிக்கவும்:" },
    hi: { difficulty: "स्तर 1: घूर्णी चरण", instruction: "90° दक्षिणावर्त घुमाव का निरीक्षण करें और अगली दिशा निर्धारित करें:" }
  },
  {
    en: { difficulty: "Level 2: Vertex Count", instruction: "Identify the polygon vertex progression (+1 side each step):" },
    ta: { difficulty: "நிலை 2: பக்கங்களின் எண்ணிக்கை", instruction: "ஒவ்வொரு படியிலும் ஒரு பக்கம் அதிகரிக்கும் பலகோண வரிசையைக் கண்டறியவும்:" },
    hi: { difficulty: "स्तर 2: भुजाओं की संख्या", instruction: "प्रत्येक चरण में एक भुजा बढ़ने वाले बहुभुज पैटर्न को पहचानें:" }
  },
  {
    en: { difficulty: "Level 2: Dual Alternation", instruction: "Analyze the repeating 3-element shape and color cycle:" },
    ta: { difficulty: "நிலை 2: இரட்டை மாறுபாடு", instruction: "மீண்டும் மீண்டும் வரும் 3-கூறு வடிவம் மற்றும் வண்ண சுழற்சியை பகுப்பாய்வு செய்யவும்:" },
    hi: { difficulty: "स्तर 2: दोहरी पुनरावृत्ति", instruction: "दोहराए जाने वाले 3-घटक आकार और रंग चक्र का विश्लेषण करें:" }
  },
  {
    en: { difficulty: "Level 2: Internal Vector", instruction: "Observe the internal component count progression:" },
    ta: { difficulty: "நிலை 2: உள் புள்ளிகள் வரிசை", instruction: "வடிவத்தின் உள்ளே இருக்கும் புள்ளிகளின் எண்ணிக்கை அதிகரிப்பைக் கவனியுங்கள்:" },
    hi: { difficulty: "स्तर 2: आंतरिक बिंदु क्रम", instruction: "आकार के अंदर बिंदुओं की बढ़ती संख्या के क्रम को देखें:" }
  },
  {
    en: { difficulty: "Level 3: Angular Vector", instruction: "Follow the 45-degree rotational sequence with Diamond transformations:" },
    ta: { difficulty: "நிலை 3: கோண சுழற்சி", instruction: "45 டிகிரி சுழற்சி வரிசை மாற்றங்களைப் பின்பற்றி சரியானதைத் தேர்ந்தெடுக்கவும்:" },
    hi: { difficulty: "स्तर 3: कोणीय घुमाव", instruction: "45 डिग्री के घूर्णन क्रम का पालन करते हुए सही विकल्प चुनें:" }
  },
  {
    en: { difficulty: "Level 3: Matrix Analogy", instruction: "Row 1 pairs Circle with Triangle. Solve Row 2 analogy for Square:" },
    ta: { difficulty: "நிலை 3: அணி ஒப்புமை", instruction: "முதல் வரிசை வட்டத்தை முக்கோணத்துடன் இணைக்கிறது. சதுரத்திற்கான 2வது வரிசை ஒப்புமையைத் தீர்க்கவும்:" },
    hi: { difficulty: "स्तर 3: आव्यूह सादृश्य", instruction: "पहली पंक्ति वृत्त को त्रिभुज से जोड़ती है। वर्ग के लिए दूसरी पंक्ति की सादृश्यता हल करें:" }
  },
  {
    en: { difficulty: "Level 3: Spatial Orbit", instruction: "Observe the glowing node moving clockwise along the shape perimeter:" },
    ta: { difficulty: "நிலை 3: சுற்றுப்பாதை இயக்கம்", instruction: "வடிவத்தின் விளிம்பில் கடிகார திசையில் நகரும் ஒளிரும் புள்ளியைக் கவனியுங்கள்:" },
    hi: { difficulty: "स्तर 3: स्थानिक परिक्रमा", instruction: "आकार की परिधि पर दक्षिणावर्त दिशा में घूमते बिंदु का निरीक्षण करें:" }
  },
  {
    en: { difficulty: "Level 4: Arithmetic Logic", instruction: "Analyze the arithmetic vertex multiplier progression (3, 6, 9, ...):" },
    ta: { difficulty: "நிலை 4: எண்கணித தர்க்கம்", instruction: "எண்கணித பெருக்கல் வரிசையைப் பகுப்பாய்வு செய்து அடுத்ததைத் தேர்ந்தெடுக்கவும் (3, 6, 9, ...):" },
    hi: { difficulty: "स्तर 4: अंकगणितीय तर्क", instruction: "अंकगणितीय गुणन प्रगति (3, 6, 9, ...) का विश्लेषण करें और अगला चुनें:" }
  },
  {
    en: { difficulty: "Level 4: Nested Inversion", instruction: "Identify the nested geometric recursion rule (Outer becomes Inner):" },
    ta: { difficulty: "நிலை 4: உள் வடிவியல் மாற்றம்", instruction: "வெளிப்புற வடிவம் உட்புற வடிவமாக மாறும் விதியை அடையாளம் காணவும்:" },
    hi: { difficulty: "स्तर 4: आंतरिक आकार परिवर्तन", instruction: "बाहरी आकार आंतरिक आकार में बदलने के नियम को पहचानें:" }
  },
  {
    en: { difficulty: "Level 4: Feature Conjunction", instruction: "Deduce the feature conjunction (Hexagon Outline -> Hexagon Solid -> Star Outline -> ...):" },
    ta: { difficulty: "நிலை 4: இரட்டை அம்சம் இணைப்பு", instruction: "வடிவம் மற்றும் நிரப்புதல் மாற்றங்களின் விதியை ஊகிக்கவும்:" },
    hi: { difficulty: "स्तर 4: विशेषता संयोजन", instruction: "आकार और भराव (Outline -> Solid) के संयोजन नियम का निष्कर्ष निकालें:" }
  },
  {
    en: { difficulty: "Level 4: Compound Matrix", instruction: "Cross rotates 90° clockwise while adding 1 dot per transformation:" },
    ta: { difficulty: "நிலை 4: கூட்டு மாற்றம்", instruction: "குறுக்கு வடிவம் 90° சுழலும் போது ஒவ்வொரு மாற்றத்திலும் 1 புள்ளி சேர்க்கப்படுகிறது:" },
    hi: { difficulty: "स्तर 4: संयुक्त आव्यूह", instruction: "क्रॉस 90° घूमता है और प्रत्येक परिवर्तन में 1 बिंदु जुड़ता है:" }
  }
];

function getMemoryWords(lang = "en") {
  const l = (lang === "ta" || lang === "hi") ? lang : "en";
  return MEMORY_WORDS_DATA[l] || MEMORY_WORDS_DATA.en;
}

function getWorkingMemoryPool(lang = "en") {
  const l = (lang === "ta" || lang === "hi") ? lang : "en";
  return WORKING_MEMORY_WORDS_DATA[l] || WORKING_MEMORY_WORDS_DATA.en;
}

function getPatternQuestionLocalized(index, lang = "en") {
  const l = (lang === "ta" || lang === "hi") ? lang : "en";
  const item = PATTERN_QUESTIONS_LOCALIZED[index];
  if (item && item[l]) return item[l];
  if (item && item.en) return item.en;
  return { difficulty: "Pattern Analysis", instruction: "Select the shape that logically completes the sequence:" };
}

function validateMemoryRecallScore(text, lang = "en") {
  const t = (text || "").toLowerCase().trim();
  let score = 0;
  
  // Word 1: Apple / ஆப்பிள் / सेब
  if (t.includes("apple") || t.includes("ஆப்பிள்") || t.includes("ஆபில்") || t.includes("செப்") || t.includes("सेब") || t.includes("seb")) {
    score++;
  }
  
  // Word 2: Table / மேசை / मेज
  if (t.includes("table") || t.includes("மேசை") || t.includes("மேஜை") || t.includes("मेज") || t.includes("mej") || t.includes("टेबल")) {
    score++;
  }
  
  // Word 3: Penny / நாணயம் / सिक्का
  if (t.includes("penny") || t.includes("நாணயம்") || t.includes("காசு") || t.includes("சில்லறை") || t.includes("सिक्का") || t.includes("सिक्के") || t.includes("sikka") || t.includes("पेनी")) {
    score++;
  }
  
  return score;
}

/**
 * Normalize text removing punctuation, excessive spaces, and standardizing Unicode (NFC).
 */
function normalizeCognitiveText(text) {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFC")
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract recognized working memory words from spoken transcript matching against the target/distractor pool.
 */
function extractSpokenWorkingMemoryWords(transcript, targetPool, lang = "en") {
  if (!transcript || !Array.isArray(targetPool) || targetPool.length === 0) {
    return [];
  }
  
  const normTranscript = normalizeCognitiveText(transcript);
  const matched = [];

  for (const rawWord of targetPool) {
    if (!rawWord) continue;
    const normWord = normalizeCognitiveText(rawWord);
    if (!normWord) continue;

    // Check if the normalized transcript includes the word
    const regex = new RegExp(`(^|\\s|[.,!?])${normWord}($|\\s|[.,!?])`, 'i');
    if (regex.test(normTranscript) || normTranscript.includes(normWord)) {
      if (!matched.includes(rawWord)) {
        matched.push(rawWord);
      }
    }
  }

  return matched;
}

/**
 * Helper function to retrieve translated string by key with optional fallback.
 */
function t(key, lang = "en") {
  const currentLang = translations[lang] ? lang : "en";
  if (translations[currentLang] && translations[currentLang][key] !== undefined) {
    return translations[currentLang][key];
  }
  if (translations["en"] && translations["en"][key] !== undefined) {
    return translations["en"][key];
  }
  return key;
}

// Export for browser window and Node.js environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    translations,
    t,
    MEMORY_WORDS_DATA,
    WORKING_MEMORY_WORDS_DATA,
    PATTERN_QUESTIONS_LOCALIZED,
    getMemoryWords,
    getWorkingMemoryPool,
    getPatternQuestionLocalized,
    validateMemoryRecallScore,
    normalizeCognitiveText,
    extractSpokenWorkingMemoryWords
  };
} else {
  window.i18n = {
    translations,
    t,
    MEMORY_WORDS_DATA,
    WORKING_MEMORY_WORDS_DATA,
    PATTERN_QUESTIONS_LOCALIZED,
    getMemoryWords,
    getWorkingMemoryPool,
    getPatternQuestionLocalized,
    validateMemoryRecallScore,
    normalizeCognitiveText,
    extractSpokenWorkingMemoryWords
  };
}
