/**
 * COGNYX Centralized Multilingual Translation System (i18n)
 * Supported Languages: English (en), Tamil (ta), Hindi (hi)
 */

const translations = {
  en: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "Cognitive Health Check-in & Digital Wellness",
    nav_dashboard: "Dashboard",
    nav_assessment: "Assessment",
    nav_report: "Summary Report",
    nav_history: "Previous Assessments",
    nav_logout: "Sign out",
    nav_telemetry_status: "System Ready",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "COGNYX Cognitive Health Sciences",

    // Auth Screen
    auth_title: "Cognitive Health Check-in",
    auth_subtitle: "Sign in to continue your cognitive health journey.",
    auth_user_label: "Username or patient ID",
    auth_user_placeholder: "Enter username or patient ID",
    auth_pass_label: "Password",
    auth_pass_placeholder: "••••••••",
    btn_login: "Sign in",
    btn_signup: "Create Account",
    auth_toggle_signup: "New user? Create an account",
    auth_toggle_login: "Already have an account? Sign in",
    auth_status_ready: "System Ready • Secure Session",

    // Dashboard
    dash_title: "Dashboard",
    dash_subtitle: "Welcome back,",
    dash_card_new_title: "Start Assessment",
    dash_card_new_desc: "Begin your cognitive check-in, including a guided conversation, quick reaction activity, memory exercises, shape patterns, and clock drawing.",
    dash_card_report_title: "View Latest Report",
    dash_card_report_desc: "Review your most recent Cognitive Health Summary, score breakdown, and printable PDF report.",
    dash_card_history_title: "View Previous Assessments",
    dash_card_history_desc: "Track your assessment history and view your progress over time.",
    dash_quick_stats: "Longitudinal Summary",
    dash_last_score: "Latest Score",
    dash_last_prob: "Screening Probability",
    dash_sessions_count: "Total Sessions",

    // Hardware & Sensor Setup
    setup_title: "Prepare Your Device",
    setup_subtitle: "To complete the assessment, please allow access to your camera and microphone.",
    setup_cam_title: "Camera",
    setup_cam_desc: "Helps follow gaze alignment and facial engagement during the check-in.",
    setup_mic_title: "Microphone",
    setup_mic_desc: "Allows you to speak your answers naturally during conversation and memory activities.",
    setup_calib_title: "Screen Focus Alignment",
    setup_calib_desc: "Briefly follow the dots on your screen so we can ensure proper viewing alignment.",
    btn_start_sensors: "Enable Camera & Microphone",
    btn_start_battery: "Start Assessment",
    sensor_ready: "Ready & Connected",
    sensor_inactive: "Not Connected / Skipped",

    // Phase 1: Guided Conversation (Chat)
    chat_header_title: "Guided Conversation",
    chat_header_subtitle: "A friendly conversation about how you're feeling, your daily routine, and recent memory.",
    chat_placeholder: "Type your answer or tap the microphone to speak...",
    btn_send: "Send",
    btn_mic: "Speak your answer",
    voice_listening: "Listening to your voice (English / en-IN)...",
    voice_not_supported: "Voice input is not supported in this browser.",
    voice_unavailable: "Selected English voice is not available in your browser.",
    mic_listening: "Listening to your voice...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "Quick Reaction Activity",
    reaction_desc: "Wait until the circle turns green, then tap as quickly as you can.",
    reaction_instruction: "Tap 'Start Activity' when you are ready. You will complete 3 rounds.",
    reaction_trial_counter: "Round",
    reaction_waiting: "Wait for green...",
    reaction_click_now: "TAP NOW!",
    reaction_too_early: "A little too early! Please wait until the circle turns green.",
    reaction_recorded: "Response Time",
    reaction_median: "Median of 3 Rounds",
    reaction_btn_start: "Start Activity",
    reaction_start: "Start Activity",
    reaction_btn_next: "Next Activity",

    // Phase 3: Memory Tasks
    memory_title: "Memory Activity",
    memory_step1_title: "Word Memorization",
    memory_step1_desc: "Please remember these three words. I will ask you to recall them later.",
    memory_step2_title: "Immediate Recall",
    memory_step2_desc: "Type or speak the three words you were asked to remember.",
    memory_delayed_title: "Delayed Recall",
    memory_delayed_desc: "Earlier, I asked you to remember three words. Which ones do you remember?",
    memory_input_placeholder: "Enter remembered words...",
    memory_btn_confirm: "Submit Answers",
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

    // Phase 4: Abstract Pattern Reasoning (Find Missing Shape)
    pattern_title: "Find the Missing Shape",
    pattern_desc: "Look at the shapes in the grid and choose the one that logically completes the pattern.",
    pattern_question_label: "Question",
    pattern_select_prompt: "Select the missing shape:",
    pattern_btn_submit: "Submit Answer",
    pattern_accuracy_label: "Pattern Score",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "Clock Drawing Activity",
    clock_desc: "Draw a circular clock face with all 12 hour numbers and set the hands to show 10 minutes past 11 (11:10).",
    clock_tool_pencil: "Draw",
    clock_tool_eraser: "Erase",
    clock_tool_clear: "Clear Canvas",
    clock_btn_clear: "Clear Canvas",
    clock_btn_finish: "Submit Drawing",
    clock_btn_submit: "Submit Drawing",

    // Processing & Synthesis Screen
    proc_title: "Preparing Your Summary",
    proc_subtitle: "Reviewing your responses and generating your personalized cognitive health summary...",
    proc_step1: "Reviewing conversational responses and pacing",
    proc_step2: "Evaluating response speed and memory accuracy",
    proc_step3: "Running cognitive screening model",
    proc_step4: "Synthesizing clear healthcare insights",
    proc_step5: "Finalizing your Cognitive Health Summary",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. Cognitive Screening Risk & Influencing Factors",
    rep_ml_prob_label: "Estimated Cognitive Impairment Risk:",
    rep_ml_risk_label: "Risk Level:",
    rep_ml_model_label: "Model:",
    rep_ml_factors_heading: "Major Assessment Factors Influencing Screening Result:",
    rep_ml_prob_unavailable: "Screening probability unavailable from current assessment data.",
    metric_unavailable: "Not available",
    insufficient_data: "Insufficient assessment data",
    assessment_incomplete: "Assessment incomplete",
    risk_low: "Low",
    risk_moderate: "Moderate",
    risk_elevated: "Elevated",
    risk_unavailable: "Unavailable",
    risk_tier_low: "Low Screening Risk",
    risk_tier_moderate: "Moderate Screening Risk",
    risk_tier_elevated: "Elevated Screening Risk",
    rep_incomplete_data: "Insufficient assessment data to calculate composite screening score.",
    tier_optimal: "Optimal Cognitive Vitality",
    tier_preserved: "Preserved Cognitive Function",
    tier_variance: "Cognitive Screening Variance",
    rep_ml_diag_unavailable: "Reliable screening probability unavailable.",

    // Report Sections & Headers
    rep_header_badge: "Cognitive Health Summary",
    rep_header_title: "Cognitive Health Summary",
    rep_header_subtitle: "Comprehensive Cognitive Screening & Wellness Overview",
    rep_subject_name: "Patient / Subject Name",
    rep_subject_id: "Session ID",
    rep_subject_age: "Age",
    rep_subject_date: "Assessment Date",
    rep_overall_score: "Overall Screening Score",
    rep_sec1_title: "1. Core Assessment Results Matrix",
    rep_sec2_title: "2. Visual Analytics & Cognitive Profile",
    rep_sec3_title: "3. Age-Based Reference Comparison & Speed Benchmarks",
    rep_sec4_title: "4. Visual Focus & Engagement",
    rep_sec5_title: "5. Speech & Communication Pacing",
    rep_sec6_title: "6. Session Video Review",
    rep_sec8_title: "8. Clinical Observations & Discussion Points",
    rep_sec9_title: "9. Suggestions for Cognitive Wellness",
    rep_disclaimer_title: "Important Healthcare Disclaimer",
    rep_disclaimer_body: "This assessment provides an algorithmic screening estimate generated for research, wellness, and educational purposes. It is not a medical diagnosis and cannot diagnose dementia, Alzheimer's disease, or any neurological condition. If you have concerns about your memory or thinking, please consult a qualified healthcare professional.",

    // Report Table Column Headers
    col_domain: "Cognitive Domain",
    col_measured: "Measured Result",
    col_baseline: "Age-Group Reference",
    col_status: "Performance Tier",

    // Action Buttons
    btn_download_pdf: "Download PDF Report",
    btn_back_dash: "Back to Dashboard",
    btn_view_history: "View Previous Assessments",

    // History Table
    hist_title: "Previous Assessment Records",
    hist_date: "Date & Time",
    hist_memory: "Memory",
    hist_pattern: "Pattern",
    hist_rx: "Reaction Time",
    hist_vitality: "Screening Score",
    hist_prob: "ML Probability",
    hist_risk: "Risk Level",
    hist_status: "Screening Result",
    hist_no_records: "No recorded assessments found for this user.",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "Thank you. We've finished our conversation. Now we'll try a short memory activity. I'll show you three words to remember. Take your time.",
    trans_game_word: "Well done! Next is a quick word memory activity. You will see 5 words on screen to remember, followed by a larger list to choose from.",
    trans_game_pattern: "Well done! Next, let's try finding missing shapes. Look at each shape pattern and choose the one that fits.",
    trans_game_reaction: "Well done! Next is a quick reaction activity. Tap the screen as soon as the circle turns green.",
    trans_game_clock: "Well done! Now we'll try a drawing activity. Please draw a round clock face with all 12 numbers and set the time to 11:10.",
    trans_delayed_recall: "Well done! For our final activity, please recall the three words you were asked to remember earlier.",
    trans_report: "Thank you! All activities are complete. We are now preparing your Cognitive Health Summary.",
    clock_analyzing: "Reviewing your drawing...",
    time_remaining: "Time remaining",
    pattern_option: "Option",
    domain_memory: "Memory",
    domain_pattern: "Pattern Logic",
    domain_visuospatial: "Visuospatial",
    domain_reflex: "Reaction Speed",
    domain_fluency: "Speech Fluency"
  },

  ta: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "அறிவாற்றல் நலம் அறிதல் மற்றும் நலச் சுருக்கம்",
    nav_dashboard: "முகப்பு",
    nav_assessment: "பரிசோதனை",
    nav_report: "சுருக்க அறிக்கை",
    nav_history: "முந்தைய பரிசோதனைகள்",
    nav_logout: "வெளியேறு",
    nav_telemetry_status: "அமைப்பு தயார்",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "COGNYX அறிவாற்றல் நல அறிவியல்",

    // Auth Screen
    auth_title: "அறிவாற்றல் நலம் அறிதல்",
    auth_subtitle: "உங்கள் அறிவாற்றல் நலப் பயணத்தைத் தொடர உள்நுழையவும்.",
    auth_user_label: "பயனர்பெயர் அல்லது நோயாளி எண்",
    auth_user_placeholder: "பயனர்பெயரை உள்ளிடவும்",
    auth_pass_label: "கடவுச்சொல்",
    auth_pass_placeholder: "••••••••",
    btn_login: "உள்நுழைக",
    btn_signup: "கணக்கை உருவாக்குக",
    auth_toggle_signup: "புதிய பயனரா? கணக்கை உருவாக்கவும்",
    auth_toggle_login: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
    auth_status_ready: "அமைப்பு தயார் • பாதுகாப்பான அமர்வு",

    // Dashboard
    dash_title: "முகப்பு",
    dash_subtitle: "மீண்டும் வருக,",
    dash_card_new_title: "பரிசோதனையைத் தொடங்கு",
    dash_card_new_desc: "வழிகாட்டப்பட்ட உரையாடல், விரைவு எதிர்வினை, நினைவாற்றல், வடிவ முறை மற்றும் கடிகாரம் வரைதல் அடங்கிய பரிசோதனையைத் தொடங்குங்கள்.",
    dash_card_report_title: "சமீபத்திய அறிக்கை",
    dash_card_report_desc: "உங்கள் சமீபத்திய அறிவாற்றல் நலச் சுருக்கம், மதிப்பெண் விவரங்கள் மற்றும் PDF பதிவிறக்கத்தைப் பெறுங்கள்.",
    dash_card_history_title: "முந்தைய பரிசோதனைகள்",
    dash_card_history_desc: "உங்கள் முந்தைய பரிசோதனைப் பதிவுகள் மற்றும் முன்னேற்றத்தைக் காண்க.",
    dash_quick_stats: "நீண்டகால சுருக்கம்",
    dash_last_score: "கடைசி மதிப்பெண்",
    dash_last_prob: "பரிசோதனை நிகழ்தகவு",
    dash_sessions_count: "மொத்த அமர்வுகள்",

    // Hardware & Sensor Setup
    setup_title: "உங்கள் சாதனத்தைத் தயார் செய்க",
    setup_subtitle: "பரிசோதனையை முடிக்க, கேமரா மற்றும் மைக்ரோஃபோன் அணுகலை அனுமதிக்கவும்.",
    setup_cam_title: "கேமரா",
    setup_cam_desc: "பரிசோதனையின் போது பார்வை மற்றும் முக அசைவுகளைக் கவனிக்க உதவுகிறது.",
    setup_mic_title: "மைக்ரோஃபோன்",
    setup_mic_desc: "உரையாடல் மற்றும் நினைவாற்றல் பயிற்சிகளில் உங்கள் பதில்களை இயல்பாகப் பேச உதவுகிறது.",
    setup_calib_title: "திரைப் பார்வை சீரமைப்பு",
    setup_calib_desc: "திரையில் தோன்றும் புள்ளிகளைச் சிறிது நேரம் கவனித்து பார்வையைச் சீரமைக்கவும்.",
    btn_start_sensors: "கேமரா & மைக்கை இயக்குக",
    btn_start_battery: "பரிசோதனையைத் தொடங்கு",
    sensor_ready: "இணைக்கப்பட்டது • தயார்",
    sensor_inactive: "இணைக்கப்படவில்லை / தவிர்க்கப்பட்டது",

    // Phase 1: Guided Conversation (Chat)
    chat_header_title: "வழிகாட்டப்பட்ட உரையாடல்",
    chat_header_subtitle: "உங்கள் நலம், அன்றாட வழக்கம் மற்றும் சமீபத்திய நினைவுகள் குறித்த நட்பான உரையாடல்.",
    chat_placeholder: "பதிலை தட்டச்சு செய்யவும் அல்லது மைக்கை அழுத்திப் பேசவும்...",
    btn_send: "அனுப்புக",
    btn_mic: "பதிலைப் பேசுங்கள்",
    voice_listening: "உங்கள் குரல் கேட்கப்படுகிறது (தமிழ் / ta-IN)...",
    voice_not_supported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.",
    voice_unavailable: "தமிழ் குரல் உங்கள் உலாவியில் கிடைக்கவில்லை.",
    mic_listening: "உங்கள் குரல் கேட்கப்படுகிறது...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "விரைவு எதிர்வினைப் பயிற்சி",
    reaction_desc: "வட்டம் பச்சையாக மாறியவுடன், கூடிய விரைவில் திரையைத் தொடவும்.",
    reaction_instruction: "தயாராக இருக்கும்போது 'பயிற்சியைத் தொடங்கு' என்பதைத் தட்டவும். மொத்தம் 3 சுற்றுகள்.",
    reaction_trial_counter: "சுற்று",
    reaction_waiting: "பச்சை நிறத்திற்கு காத்திருக்கவும்...",
    reaction_click_now: "இப்போது தொடவும்!",
    reaction_too_early: "மிக விரைவில் தொட்டுவிட்டீர்கள்! வட்டம் பச்சையாக மாறும் வரை காத்திருக்கவும்.",
    reaction_recorded: "பதில் நேரம்",
    reaction_median: "3 சுற்றுகளின் சராசரி",
    reaction_btn_start: "பயிற்சியைத் தொடங்கு",
    reaction_start: "பயிற்சியைத் தொடங்கு",
    reaction_btn_next: "அடுத்த பயிற்சி",

    // Phase 3: Memory Tasks
    memory_title: "நினைவாற்றல் பயிற்சி",
    memory_step1_title: "சொற்களை நினைவில் நிறுத்துதல்",
    memory_step1_desc: "இந்த மூன்று சொற்களையும் நினைவில் வைத்துக் கொள்ளுங்கள். பின்னர் இவற்றைக் கேட்பேன்.",
    memory_step2_title: "உடனடி நினைவு கூறுதல்",
    memory_step2_desc: "நினைவில் வைக்கச் சொன்ன மூன்று சொற்களையும் தட்டச்சு செய்யவும் அல்லது பேசவும்.",
    memory_delayed_title: "தாமதமான நினைவு கூறுதல்",
    memory_delayed_desc: "முன்னதாக நான் மூன்று சொற்களை நினைவில் வைக்கச் சொன்னேன். அவற்றில் எவை உங்களுக்கு நினைவிருக்கிறது?",
    memory_input_placeholder: "நினைவிருக்கும் சொற்களை உள்ளிடவும்...",
    memory_btn_confirm: "பதில்களைச் சமர்ப்பிக்கவும்",
    memory_score_label: "நினைவுத் துல்லியம்",
    memory_mic_btn: "சொற்களைப் பேசுங்கள் (குரல் உள்ளீடு)",
    memory_mic_listening: "கேட்கப்படுகிறது... நினைவிருக்கும் சொற்களைப் பேசுங்கள்",
    memory_mic_recognized: "அடையாளம் காணப்பட்ட சொற்கள்:",
    memory_mic_denied: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது. கீழே உள்ள பட்டியலிலிருந்து சொற்களைத் தேர்ந்தெடுக்கவும்.",
    memory_grid_desc: "நினைவாற்றல் வரிசையில் காட்டப்பட்ட 5 சொற்களைத் தேர்ந்தெடுக்கவும் அல்லது பேசவும்:",
    memory_btn_start_memorize: "நினைவில் நிறுத்தத் தொடங்கு",
    memory_btn_skip_to_recall: "நான் தயார் / நினைவுகூரத் தொடங்கு",
    memory_timer_prompt: "இந்த 5 சொற்களை நினைவில் வையுங்கள். நினைவு கூறுதல் விரைவில் தொடங்கும்.",
    memory_memorize_countdown: "சொற்களை நினைவில் வையுங்கள்",

    // Phase 4: Abstract Pattern Reasoning (Find Missing Shape)
    pattern_title: "விடுபட்ட வடிவத்தைக் கண்டறிதல்",
    pattern_desc: "கட்டத்தில் உள்ள வடிவங்களைக் கவனித்து, வரிசையை நிறைவு செய்யும் சரியான வடிவத்தைத் தேர்ந்தெடுக்கவும்.",
    pattern_question_label: "கேள்வி",
    pattern_select_prompt: "விடுபட்ட வடிவத்தைத் தேர்ந்தெடுக்கவும்:",
    pattern_btn_submit: "பதிலைச் சமர்ப்பிக்கவும்",
    pattern_accuracy_label: "வடிவ மதிப்பெண்",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "கடிகாரம் வரைதல் பயிற்சி",
    clock_desc: "அனைத்து 12 எண்களுடன் ஒரு வட்டக் கடிகாரத்தை வரைந்து, 11 மணி 10 நிமிடத்தைக் காட்ட முட்களை அமைக்கவும்.",
    clock_tool_pencil: "வரைக",
    clock_tool_eraser: "அழிக்க",
    clock_tool_clear: "அழிக்கவும்",
    clock_btn_clear: "அழிக்கவும்",
    clock_btn_finish: "வரைபடத்தைச் சமர்ப்பிக்கவும்",
    clock_btn_submit: "வரைபடத்தைச் சமர்ப்பிக்கவும்",

    // Processing & Synthesis Screen
    proc_title: "உங்கள் சுருக்கம் தயாராகிறது",
    proc_subtitle: "உங்கள் பதில்களை ஆராய்ந்து தனிப்பயனாக்கப்பட்ட அறிவாற்றல் நலச் சுருக்கத்தை உருவாக்குகிறது...",
    proc_step1: "உரையாடல் பதில்கள் மற்றும் வேகத்தை மதிப்பிடுதல்",
    proc_step2: "எதிர்வினை வேகம் மற்றும் நினைவாற்றலை மதிப்பீடு செய்தல்",
    proc_step3: "அறிவாற்றல் பரிசோதனை மாதிரியை இயக்குதல்",
    proc_step4: "தெளிவான நலவாழ்வு ஆலோசனைகளைத் தொகுத்தல்",
    proc_step5: "அறிவாற்றல் நலச் சுருக்கத்தை இறுதி செய்தல்",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. அறிவாற்றல் பரிசோதனை அபாய நிலை & பங்களிக்கும் காரணிகள்",
    rep_ml_prob_label: "மதிப்பிடப்பட்ட அறிவாற்றல் பாதிப்பு அபாயம்:",
    rep_ml_risk_label: "அபாய நிலை:",
    rep_ml_model_label: "பரிசோதனை மாதிரி:",
    rep_ml_factors_heading: "பரிசோதனை முடிவை பாதிக்கும் முக்கிய காரணிகள்:",
    rep_ml_prob_unavailable: "தற்போதைய தரவுகளிலிருந்து நம்பகமான பரிசோதனை நிகழ்தகவு கிடைக்கவில்லை.",
    metric_unavailable: "கிடைக்கவில்லை",
    insufficient_data: "போதிய பரிசோதனைத் தரவு இல்லை",
    assessment_incomplete: "பரிசோதனை முழுமையடையவில்லை",
    risk_low: "குறைந்த அபாயம்",
    risk_moderate: "மிதமான அபாயம்",
    risk_elevated: "உயர்ந்த அபாயம்",
    risk_unavailable: "கிடைக்கவில்லை",
    risk_tier_low: "குறைந்த பரிசோதனை அபாயம்",
    risk_tier_moderate: "மிதமான பரிசோதனை அபாயம்",
    risk_tier_elevated: "உயர்ந்த பரிசோதனை அபாயம்",
    rep_incomplete_data: "மதிப்பீட்டுத் தரவுகள் போதுமானதாக இல்லை, ஒருங்கிணைந்த மதிப்பெண்ணைக் கணக்கிட இயலவில்லை.",
    tier_optimal: "உகந்த அறிவாற்றல் நலம்",
    tier_preserved: "பாதுகாக்கப்பட்ட அறிவாற்றல் செயல்பாடு",
    tier_variance: "அறிவாற்றல் பரிசோதனை வேறுபாடு",
    rep_ml_diag_unavailable: "நம்பகமான கணிப்பு தற்போது கிடைக்கவில்லை.",

    // Report Sections & Headers
    rep_header_badge: "அறிவாற்றல் நலச் சுருக்கம்",
    rep_header_title: "அறிவாற்றல் நலச் சுருக்கம்",
    rep_header_subtitle: "முழுமையான அறிவாற்றல் பரிசோதனை மற்றும் நலக் கண்ணோட்டம்",
    rep_subject_name: "பயனர் / நோயாளி பெயர்",
    rep_subject_id: "அமர்வு எண்",
    rep_subject_age: "வயது",
    rep_subject_date: "பரிசோதனை தேதி",
    rep_overall_score: "ஒட்டுமொத்த பரிசோதனை மதிப்பெண்",
    rep_sec1_title: "1. முக்கியப் பயிற்சி முடிவுகளின் அட்டவணை",
    rep_sec2_title: "2. காட்சி வரைபடம் & அறிவாற்றல் சுயவிவரம்",
    rep_sec3_title: "3. வயது அடிப்படையிலான ஒப்பீடு & வேக அளவீடுகள்",
    rep_sec4_title: "4. பார்வைக் கவனம் & பங்கேற்பு",
    rep_sec5_title: "5. பேச்சு வேகம் & தகவல் தொடர்பு",
    rep_sec6_title: "6. அமர்வு வீடியோ மறுபார்வை",
    rep_sec8_title: "8. மருத்துவக் கண்காணிப்புகள் & கலந்தாய்வுக் குறிப்புகள்",
    rep_sec9_title: "9. அறிவாற்றல் நலவாழ்வுக்கான பரிந்துரைகள்",
    rep_disclaimer_title: "முக்கிய மருத்துவ வழிகாட்டல் குறிப்பு",
    rep_disclaimer_body: "இந்த மதிப்பீடு தகவல், நலம் மற்றும் கல்வி நோக்கங்களுக்காக உருவாக்கப்பட்ட ஓர் வழிமுறை அடிப்படையிலான பரிசோதனை மதிப்பீடாகும். இது மருத்துவ நோயறிதல் அல்ல. டிமென்ஷியா அல்லது அல்சைமர் போன்ற நோய்களை இது உறுதிப்படுத்த முடியாது. உங்கள் நினைவாற்றல் குறித்து கவலைகள் இருந்தால், தகுதியான மருத்துவரை அணுகவும்.",

    // Report Table Column Headers
    col_domain: "அறிவாற்றல் பிரிவு",
    col_measured: "அளவிடப்பட்ட முடிவு",
    col_baseline: "வயது வரம்பு குறிப்பு",
    col_status: "செயல்திறன் நிலை",

    // Action Buttons
    btn_download_pdf: "PDF அறிக்கையைப் பதிவிறக்குக",
    btn_back_dash: "முகப்பிற்குத் திரும்பு",
    btn_view_history: "முந்தைய பரிசோதனைகளைக் காண்க",

    // History Table
    hist_title: "முந்தைய பரிசோதனைப் பதிவுகள்",
    hist_date: "தேதி & நேரம்",
    hist_memory: "நினைவாற்றல்",
    hist_pattern: "வடிவம்",
    hist_rx: "எதிர்வினை நேரம்",
    hist_vitality: "பரிசோதனை மதிப்பெண்",
    hist_prob: "ML நிகழ்தகவு",
    hist_risk: "அபாய நிலை",
    hist_status: "பரிசோதனை முடிவு",
    hist_no_records: "இப்பயனருக்கு முந்தைய பதிவுகள் எதுவும் கிடைக்கவில்லை.",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "நன்றி. நமது உரையாடல் முடிந்தது. இப்போது ஒரு சிறிய நினைவாற்றல் பயிற்சியைச் செய்வோம். நினைவில் வைக்க மூன்று சொற்களைக் காண்பிக்கிறேன். நிதானமாக நினைவில் வையுங்கள்.",
    trans_game_word: "அருமை! அடுத்து ஒரு சொல் நினைவாற்றல் பயிற்சி. திரையில் 5 சொற்கள் தோன்றும், பின்னர் ஒரு பெரிய பட்டியலிலிருந்து அவற்றைத் தேர்ந்தெடுக்க வேண்டும்.",
    trans_game_pattern: "அருமை! அடுத்து விடுபட்ட வடிவங்களைக் கண்டறியும் பயிற்சி. வடிவ வரிசையைக் கவனித்து, பொருந்தும் வடிவத்தைத் தேர்ந்தெடுக்கவும்.",
    trans_game_reaction: "அருமை! அடுத்து ஒரு விரைவு எதிர்வினைப் பயிற்சி. வட்டம் பச்சையாக மாறியவுடன் திரையைத் தொடவும்.",
    trans_game_clock: "அருமை! இப்போது ஒரு வரைதல் பயிற்சி. 12 எண்களுடன் ஒரு வட்டக் கடிகாரத்தை வரைந்து, 11 மணி 10 நிமிடத்தைக் காட்ட முட்களை அமைக்கவும்.",
    trans_delayed_recall: "அருமை! நமது இறுதிப் பயிற்சியாக, முன்னதாக நினைவில் வைக்கச் சொன்ன மூன்று சொற்களை நினைவுகூரவும்.",
    trans_report: "நன்றி! அனைத்துப் பயிற்சிகளும் முடிவடைந்தன. உங்கள் அறிவாற்றல் நலச் சுருக்கம் தயாராகிறது.",
    clock_analyzing: "உங்கள் வரைபடம் மதிப்பாய்வு செய்யப்படுகிறது...",
    time_remaining: "மீதமுள்ள நேரம்",
    pattern_option: "விருப்பம்",
    domain_memory: "நினைவாற்றல்",
    domain_pattern: "வடிவத் தர்க்கம்",
    domain_visuospatial: "காட்சி-வெளித் திறன்",
    domain_reflex: "எதிர்வினை வேகம்",
    domain_fluency: "பேச்சுப் புழக்கம்"
  },

  hi: {
    // Navigation & Global
    brand_name: "COGNYX",
    system_tagline: "संज्ञानात्मक स्वास्थ्य जाँच और डिजिटल वेलनेस",
    nav_dashboard: "डैशबोर्ड",
    nav_assessment: "मूल्यांकन",
    nav_report: "सारांश रिपोर्ट",
    nav_history: "पिछले मूल्यांकन",
    nav_logout: "साइन आउट",
    nav_telemetry_status: "सिस्टम तैयार",
    lang_en: "English",
    lang_ta: "தமிழ்",
    lang_hi: "हिन्दी",
    powered_by: "COGNYX संज्ञानात्मक स्वास्थ्य विज्ञान",

    // Auth Screen
    auth_title: "संज्ञानात्मक स्वास्थ्य जाँच",
    auth_subtitle: "अपनी संज्ञानात्मक स्वास्थ्य यात्रा जारी रखने के लिए साइन इन करें।",
    auth_user_label: "यूजरनेम या मरीज आईडी",
    auth_user_placeholder: "यूजरनेम या मरीज आईडी दर्ज करें",
    auth_pass_label: "पासवर्ड",
    auth_pass_placeholder: "••••••••",
    btn_login: "साइन इन करें",
    btn_signup: "खाता बनाएं",
    auth_toggle_signup: "नए उपयोगकर्ता? खाता बनाएं",
    auth_toggle_login: "पहले से खाता है? साइन इन करें",
    auth_status_ready: "सिस्टम तैयार • सुरक्षित सत्र",

    // Dashboard
    dash_title: "डैशबोर्ड",
    dash_subtitle: "वापसी पर स्वागत है,",
    dash_card_new_title: "मूल्यांकन शुरू करें",
    dash_card_new_desc: "मार्गदर्शित बातचीत, त्वरित प्रतिक्रिया, स्मृति अभ्यास, आकार पैटर्न और घड़ी निर्माण सहित संपूर्ण जाँच शुरू करें।",
    dash_card_report_title: "नवीनतम रिपोर्ट देखें",
    dash_card_report_desc: "अपना नवीनतम संज्ञानात्मक स्वास्थ्य सारांश, स्कोर विवरण और प्रिंट करने योग्य पीडीएफ रिपोर्ट देखें।",
    dash_card_history_title: "पिछले मूल्यांकन देखें",
    dash_card_history_desc: "अपने पिछले मूल्यांकन रिकॉर्ड ट्रैक करें और समय के साथ अपनी प्रगति देखें।",
    dash_quick_stats: "दीर्घकालिक सारांश",
    dash_last_score: "नवीनतम स्कोर",
    dash_last_prob: "स्क्रीनिंग संभावना",
    dash_sessions_count: "कुल सत्र",

    // Hardware & Sensor Setup
    setup_title: "अपना डिवाइस तैयार करें",
    setup_subtitle: "मूल्यांकन पूरा करने के लिए कृपया कैमरा और माइक्रोफ़ोन की अनुमति दें।",
    setup_cam_title: "कैमरा",
    setup_cam_desc: "जाँच के दौरान दृष्टि संरेखण और चेहरे के भावों को समझने में मदद करता है।",
    setup_mic_title: "माइक्रोफ़ोन",
    setup_mic_desc: "बातचीत और स्मृति गतिविधियों के दौरान अपने उत्तर स्वाभाविक रूप से बोलने में मदद करता है।",
    setup_calib_title: "स्क्रीन फोकस संरेखण",
    setup_calib_desc: "उचित दृश्य संरेखण सुनिश्चित करने के लिए स्क्रीन पर दिए गए बिंदुओं को थोड़ी देर देखें।",
    btn_start_sensors: "कैमरा और माइक सक्षम करें",
    btn_start_battery: "मूल्यांकन शुरू करें",
    sensor_ready: "तैयार और कनेक्टेड",
    sensor_inactive: "कनेक्ट नहीं / छोड़ दिया गया",

    // Phase 1: Guided Conversation (Chat)
    chat_header_title: "मार्गदर्शित बातचीत",
    chat_header_subtitle: "आप कैसा महसूस कर रहे हैं, आपकी दिनचर्या और हाल की याददाश्त के बारे में एक दोस्ताना बातचीत।",
    chat_placeholder: "अपना उत्तर लिखें या बोलने के लिए माइक पर टैप करें...",
    btn_send: "भेजें",
    btn_mic: "अपना उत्तर बोलें",
    voice_listening: "आपकी आवाज़ सुनी जा रही है (हिन्दी / hi-IN)...",
    voice_not_supported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।",
    voice_unavailable: "आपके ब्राउज़र में हिंदी आवाज़ उपलब्ध नहीं है।",
    mic_listening: "आपकी आवाज़ सुनी जा रही है...",

    // Phase 2: Sensorimotor Reaction Time (Green Target)
    reaction_title: "त्वरित प्रतिक्रिया गतिविधि",
    reaction_desc: "जब वृत्त हरा हो जाए, तो जितनी जल्दी हो सके स्क्रीन पर टैप करें।",
    reaction_instruction: "तैयार होने पर 'गतिविधि शुरू करें' पर टैप करें। आप कुल 3 राउंड पूरे करेंगे।",
    reaction_trial_counter: "राउंड",
    reaction_waiting: "हरे रंग की प्रतीक्षा करें...",
    reaction_click_now: "अभी टैप करें!",
    reaction_too_early: "बहुत जल्दी टैप किया! वृत्त के हरे होने तक प्रतीक्षा करें।",
    reaction_recorded: "प्रतिक्रिया समय",
    reaction_median: "3 राउंड का मध्यमान",
    reaction_btn_start: "गतिविधि शुरू करें",
    reaction_start: "गतिविधि शुरू करें",
    reaction_btn_next: "अगली गतिविधि",

    // Phase 3: Memory Tasks
    memory_title: "स्मृति गतिविधि",
    memory_step1_title: "शब्द याद रखना",
    memory_step1_desc: "कृपया इन तीन शब्दों को याद रखें। मैं आपसे इन्हें बाद में पूछूँगा।",
    memory_step2_title: "तत्काल स्मरण",
    memory_step2_desc: "याद रखने के लिए कहे गए तीन शब्दों को लिखें या बोलें।",
    memory_delayed_title: "विलंबित स्मरण",
    memory_delayed_desc: "पहले मैंने आपको तीन शब्द याद रखने के लिए कहा था। आपको उनमें से कौन से याद हैं?",
    memory_input_placeholder: "याद रखे गए शब्द दर्ज करें...",
    memory_btn_confirm: "उत्तर सबमिट करें",
    memory_score_label: "स्मरण सटीकता",
    memory_mic_btn: "शब्द बोलें (आवाज इनपुट)",
    memory_mic_listening: "सुना जा रहा है... याद रखे शब्द बोलें",
    memory_mic_recognized: "पहचाने गए शब्द:",
    memory_mic_denied: "माइक्रोफ़ोन अनुमति नहीं मिली। कृपया नीचे दी गई ग्रिड से शब्द चुनें।",
    memory_grid_desc: "स्मृति अनुक्रम के दौरान दिखाए गए 5 शब्दों को चुनें या बोलें:",
    memory_btn_start_memorize: "याद रखना शुरू करें",
    memory_btn_skip_to_recall: "मैं तैयार हूँ / स्मरण शुरू करें",
    memory_timer_prompt: "इन 5 शब्दों को याद रखें। स्मरण जल्द शुरू होगा।",
    memory_memorize_countdown: "इन शब्दों को याद रखें",

    // Phase 4: Abstract Pattern Reasoning (Find Missing Shape)
    pattern_title: "लापता आकार ढूंढें",
    pattern_desc: "ग्रिड में आकारों को देखें और उस आकार को चुनें जो पैटर्न को तार्किक रूप से पूरा करता है।",
    pattern_question_label: "प्रश्न",
    pattern_select_prompt: "लापता आकार चुनें:",
    pattern_btn_submit: "उत्तर सबमिट करें",
    pattern_accuracy_label: "पैटर्न स्कोर",

    // Phase 5: Clock Drawing Test (CDT)
    clock_title: "घड़ी निर्माण गतिविधि",
    clock_desc: "सभी 12 संख्याओं के साथ एक गोल घड़ी बनाएं और 11 बजकर 10 मिनट (11:10) दिखाने के लिए सुइयां बनाएं।",
    clock_tool_pencil: "बनाएं",
    clock_tool_eraser: "मिटाएं",
    clock_tool_clear: "कैनवास साफ़ करें",
    clock_btn_clear: "कैनवास साफ़ करें",
    clock_btn_finish: "ड्राइंग सबमिट करें",
    clock_btn_submit: "ड्राइंग सबमिट करें",

    // Processing & Synthesis Screen
    proc_title: "आपका सारांश तैयार किया जा रहा है",
    proc_subtitle: "आपके उत्तरों की समीक्षा कर आपका व्यक्तिगत संज्ञानात्मक स्वास्थ्य सारांश तैयार किया जा रहा है...",
    proc_step1: "बातचीत की प्रतिक्रियाओं और गति की समीक्षा",
    proc_step2: "प्रतिक्रिया गति और स्मृति सटीकता का मूल्यांकन",
    proc_step3: "संज्ञानात्मक स्क्रीनिंग मॉडल का संचालन",
    proc_step4: "स्पष्ट स्वास्थ्य अंतर्दृष्टि तैयार करना",
    proc_step5: "संज्ञानात्मक स्वास्थ्य सारांश को अंतिम रूप देना",

    // Section 7: ML Probability & Risk Level
    rep_sec7_title: "7. संज्ञानात्मक स्क्रीनिंग जोखिम और प्रभावकारी कारक",
    rep_ml_prob_label: "अनुमानित संज्ञानात्मक हानि जोखिम:",
    rep_ml_risk_label: "जोखिम स्तर:",
    rep_ml_model_label: "मॉडल:",
    rep_ml_factors_heading: "स्क्रीनिंग परिणाम को प्रभावित करने वाले मुख्य कारक:",
    rep_ml_prob_unavailable: "वर्तमान मूल्यांकन डेटा से स्क्रीनिंग संभावना उपलब्ध नहीं है।",
    metric_unavailable: "उपलब्ध नहीं",
    insufficient_data: "अपर्याप्त मूल्यांकन डेटा",
    assessment_incomplete: "मूल्यांकन अधूरा",
    risk_low: "कम जोखिम",
    risk_moderate: "मध्यम जोखिम",
    risk_elevated: "बढ़ा हुआ जोखिम",
    risk_unavailable: "अनुपलब्ध",
    risk_tier_low: "कम स्क्रीनिंग जोखिम",
    risk_tier_moderate: "मध्यम स्क्रीनिंग जोखिम",
    risk_tier_elevated: "बढ़ा हुआ स्क्रीनिंग जोखिम",
    rep_incomplete_data: "समग्र स्कोर की गणना के लिए पर्याप्त मूल्यांकन डेटा उपलब्ध नहीं है।",
    tier_optimal: "सर्वोत्कृष्ट संज्ञानात्मक स्वास्थ्य",
    tier_preserved: "सुरक्षित संज्ञानात्मक कार्यक्षमता",
    tier_variance: "संज्ञानात्मक स्क्रीनिंग भिन्नता",
    rep_ml_diag_unavailable: "विश्वसनीय स्क्रीनिंग संभावना वर्तमान में उपलब्ध नहीं है।",

    // Report Sections & Headers
    rep_header_badge: "संज्ञानात्मक स्वास्थ्य सारांश",
    rep_header_title: "संज्ञानात्मक स्वास्थ्य सारांश",
    rep_header_subtitle: "व्यापक संज्ञानात्मक जाँच और वेलनेस अवलोकन",
    rep_subject_name: "मरीज / उपयोगकर्ता नाम",
    rep_subject_id: "सत्र आईडी",
    rep_subject_age: "उम्र",
    rep_subject_date: "मूल्यांकन तिथि",
    rep_overall_score: "समग्र स्क्रीनिंग स्कोर",
    rep_sec1_title: "1. मुख्य मूल्यांकन परिणाम तालिका",
    rep_sec2_title: "2. दृश्य विश्लेषण और संज्ञानात्मक प्रोफ़ाइल",
    rep_sec3_title: "3. आयु-आधारित तुलना और गति मानक",
    rep_sec4_title: "4. दृश्य ध्यान और संलग्नता",
    rep_sec5_title: "5. बोलने की गति और संचार प्रवाह",
    rep_sec6_title: "6. सत्र वीडियो समीक्षा",
    rep_sec8_title: "8. अवलोकन और चर्चा बिंदु",
    rep_sec9_title: "9. संज्ञानात्मक स्वास्थ्य के लिए सुझाव",
    rep_disclaimer_title: "महत्वपूर्ण स्वास्थ्य अस्वीकरण",
    rep_disclaimer_body: "यह मूल्यांकन केवल स्वास्थ्य, सूचनात्मक और अनुसंधान उद्देश्यों के लिए तैयार किया गया एक एल्गोरिद्मिक स्क्रीनिंग अनुमान है। यह कोई चिकित्सीय निदान नहीं है और डिमेंशिया, अल्जाइमर या किसी न्यूरोलॉजिकल स्थिति का निदान नहीं कर सकता। यदि आपको अपनी याददाश्त या सोच के बारे में चिंता है, तो कृपया योग्य स्वास्थ्य विशेषज्ञ से परामर्श लें।",

    // Report Table Column Headers
    col_domain: "संज्ञानात्मक क्षेत्र",
    col_measured: "मापा गया परिणाम",
    col_baseline: "आयु समूह संदर्भ",
    col_status: "प्रदर्शन स्तर",

    // Action Buttons
    btn_download_pdf: "पीडीएफ रिपोर्ट डाउनलोड करें",
    btn_back_dash: "डैशबोर्ड पर वापस जाएं",
    btn_view_history: "पिछले मूल्यांकन देखें",

    // History Table
    hist_title: "पिछले मूल्यांकन रिकॉर्ड",
    hist_date: "दिनांक और समय",
    hist_memory: "स्मृति",
    hist_pattern: "पैटर्न",
    hist_rx: "प्रतिक्रिया समय",
    hist_vitality: "स्क्रीनिंग स्कोर",
    hist_prob: "ML संभावना",
    hist_risk: "जोखिम स्तर",
    hist_status: "स्क्रीनिंग परिणाम",
    hist_no_records: "इस उपयोगकर्ता के लिए कोई रिकॉर्ड नहीं मिला।",

    // Assessment Transitions & Game Strings
    trans_memory_reg: "धन्यवाद। हमारी बातचीत पूरी हो गई है। अब हम एक छोटी स्मृति गतिविधि करेंगे। मैं आपको याद रखने के लिए तीन शब्द दिखाऊँगा। आराम से याद रखें।",
    trans_game_word: "बहुत बढ़िया! अगली एक शब्द मिलान गतिविधि है। आप स्क्रीन पर याद रखने के लिए 5 शब्द देखेंगे, और फिर एक बड़ी सूची से उन्हें चुनेंगे।",
    trans_game_pattern: "बहुत बढ़िया! अब लापता आकार खोजने का अभ्यास करते हैं। प्रत्येक आकार पैटर्न को देखें और सही आकार चुनें।",
    trans_game_reaction: "बहुत बढ़िया! अगली एक त्वरित प्रतिक्रिया गतिविधि है। जैसे ही वृत्त हरा हो, स्क्रीन पर टैप करें।",
    trans_game_clock: "बहुत बढ़िया! अब हम एक ड्राइंग गतिविधि करेंगे। कृपया 12 संख्याओं के साथ एक गोल घड़ी बनाएं और 11 बजकर 10 मिनट का समय दिखाएं।",
    trans_delayed_recall: "बहुत बढ़िया! हमारी अंतिम गतिविधि के रूप में, कृपया उन तीन शब्दों को याद करें जो आपको पहले याद रखने के लिए कहा गया था।",
    trans_report: "धन्यवाद! सभी गतिविधियाँ पूरी हो चुकी हैं। अब आपका संज्ञानात्मक स्वास्थ्य सारांश तैयार किया जा रहा है।",
    clock_analyzing: "आपकी ड्राइंग की समीक्षा की जा रही है...",
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
  if (!key) return "";
  const currentLang = translations[lang] ? lang : "en";
  if (translations[currentLang] && translations[currentLang][key] !== undefined) {
    return translations[currentLang][key];
  }
  if (translations["en"] && translations["en"][key] !== undefined) {
    return translations["en"][key];
  }

  // Canonical aliases for backward and cross-module compatibility
  const keyAliases = {
    clock_btn_clear: "clock_tool_clear",
    clock_tool_clear: "clock_btn_clear",
    clock_btn_submit: "clock_btn_finish",
    clock_btn_finish: "clock_btn_submit",
    reaction_start: "reaction_btn_start",
    reaction_btn_start: "reaction_start"
  };
  const alias = keyAliases[key];
  if (alias) {
    if (translations[currentLang] && translations[currentLang][alias] !== undefined) {
      return translations[currentLang][alias];
    }
    if (translations["en"] && translations["en"][alias] !== undefined) {
      return translations["en"][alias];
    }
  }

  // Developer / QA audit warning
  if (typeof console !== "undefined" && console.warn) {
    console.warn(`[i18n] Missing translation key: "${key}" (lang: "${lang}")`);
  }

  // Safe user-facing fallback: strip prefixes and format readable text
  return key
    .replace(/^(btn|nav|dash|auth|rep|proc|setup|trans|col|hist|domain|risk|memory|pattern|clock|reaction)_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
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
  window.translations = translations;
  window.t = t;
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
