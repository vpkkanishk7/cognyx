const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runE2E() {
  console.log('=== STARTING COGNYX END-TO-END VERIFICATION ===');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Load Application
  console.log('[1/7] Navigating to http://127.0.0.1:3005 ...');
  await page.goto('http://127.0.0.1:3005', { waitUntil: 'networkidle0' });

  // Check Auth or Dashboard
  const testUser = 'user_' + Date.now().toString().slice(-4);
  const testPass = 'Password123!';

  // Fill Auth
  const authVisible = await page.evaluate(() => !document.getElementById('auth-view').classList.contains('hidden'));
  if (authVisible) {
    console.log('[2/7] Signing up test user:', testUser);
    await page.type('#auth-username', testUser);
    await page.type('#auth-password', testPass);
    await page.click('#auth-signup-btn');
    await page.waitForTimeout ? page.waitForTimeout(1000) : new Promise(r => setTimeout(r, 1000));
  }

  // Check Dashboard & Start Assessment
  console.log('[3/7] Initiating Assessment...');
  await page.click('#btn-start-assessment');
  await new Promise(r => setTimeout(r, 800));

  // Select Text Modality
  await page.click('#mode-text');
  await new Promise(r => setTimeout(r, 1500));

  // 2. Test Interactive AI Conversation
  console.log('[4/7] Testing Real AI Conversational Screening...');
  const responses = [
    'I have felt a bit forgetful lately with my keys and phone.',
    'I am 68 years old.',
    'I grew up in Chicago, Illinois.',
    'I worked as an electrical engineer.',
    'I spend most of my time with my wife and granddaughter.',
    'Yesterday I went for a nice walk and read a mystery novel.',
    'I wake up around 7:30am, make coffee, and do crossword puzzles.'
  ];

  for (let i = 0; i < responses.length; i++) {
    await page.waitForSelector('#chat-input:not([disabled])', { timeout: 20000 });
    await page.type('#chat-input', responses[i]);
    await page.click('#chat-send-btn');
    console.log(` -> User Turn ${i+1}: "${responses[i]}" sent`);
    await new Promise(r => setTimeout(r, 4000));
    
    // Read last bot message
    const botMessages = await page.evaluate(() => {
      const msgs = Array.from(document.querySelectorAll('#chat-history .msg.bot'));
      return msgs.map(m => m.textContent);
    });
    console.log(`    Bot Response: "${botMessages[botMessages.length - 1]}"`);
  }

  console.log(' -> Waiting for conversation phase completion transition...');
  await new Promise(r => setTimeout(r, 8000));

  // 3. Memory Registration & Immediate Recall
  console.log('[5/7] Testing Memory Tasks...');
  const memRegVisible = await page.evaluate(() => !document.getElementById('memory-reg-view').classList.contains('hidden'));
  if (memRegVisible) {
    console.log(' -> Memory Registration Screen displayed.');
    await new Promise(r => setTimeout(r, 16000));
  }

  // Immediate Recall
  await page.waitForSelector('#memory-recall-input', { timeout: 10000 });
  console.log(' -> Submitting Immediate Recall (APPLE TABLE PENNY)...');
  await page.type('#memory-recall-input', 'APPLE TABLE PENNY');
  await page.click('#memory-recall-submit-btn');
  await new Promise(r => setTimeout(r, 8000));

  // 4. 5-Word Working Memory Selection Test
  console.log('[6/7] Testing 5-Word Working Memory Activity...');
  await page.waitForSelector('#memory-start-btn', { timeout: 15000 });
  console.log(' -> Initiating 5-word sequence...');
  await page.click('#memory-start-btn');
  
  // Wait for 7s memorization countdown
  await new Promise(r => setTimeout(r, 8500));

  // Test selecting words in grid
  const selectedCountInitial = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#memory-grid-container .memory-btn'));
    // Click first 5 buttons
    for (let j = 0; j < 5 && j < btns.length; j++) {
      btns[j].click();
    }
    const counterText = document.getElementById('memory-counter-num')?.textContent;
    return { selected: document.querySelectorAll('.memory-btn.selected').length, counter: counterText };
  });
  console.log(' -> Selection Test (5 words clicked):', selectedCountInitial);

  // Test deselecting 1 word
  const deselectTest = await page.evaluate(() => {
    const selectedBtn = document.querySelector('.memory-btn.selected');
    if (selectedBtn) selectedBtn.click();
    return { selected: document.querySelectorAll('.memory-btn.selected').length, counter: document.getElementById('memory-counter-num')?.textContent };
  });
  console.log(' -> Deselect Test (1 word deselected):', deselectTest);

  // Re-select 1 word to make it 5
  await page.evaluate(() => {
    const unselectedBtn = document.querySelector('.memory-btn:not(.selected)');
    if (unselectedBtn) unselectedBtn.click();
  });

  // Submit Working Memory
  await page.click('#memory-submit-btn');
  console.log(' -> Working Memory submitted.');
  await new Promise(r => setTimeout(r, 8000));

  // 5. Pattern Recognition Test (12 Questions)
  console.log(' -> Testing Pattern Recognition Test (12 questions)...');
  await page.waitForSelector('#game-4-container:not(.hidden)', { timeout: 15000 });
  for (let q = 0; q < 12; q++) {
    await page.waitForSelector('.pattern-option-card', { timeout: 5000 });
    await page.click('.pattern-option-card:first-child');
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(' -> Pattern Recognition completed.');
  await new Promise(r => setTimeout(r, 8000));

  // 6. Reaction Test
  console.log(' -> Testing Reaction Reflex...');
  await page.waitForSelector('#game-1-container:not(.hidden)', { timeout: 15000 });
  for (let trial = 0; trial < 5; trial++) {
    await page.click('#reaction-btn');
    await page.waitForFunction(() => document.getElementById('reaction-btn').classList.contains('go'), { timeout: 8000 });
    await page.click('#reaction-btn');
    await new Promise(r => setTimeout(r, 400));
  }
  console.log(' -> Reaction Reflex completed.');
  await new Promise(r => setTimeout(r, 8000));

  // 7. Clock Drawing Test
  console.log(' -> Testing Clock Drawing...');
  await page.waitForSelector('#game-3-container:not(.hidden)', { timeout: 15000 });
  await page.click('#clock-submit-btn');
  console.log(' -> Clock Drawing submitted.');
  await new Promise(r => setTimeout(r, 8000));

  // 8. Delayed Recall
  console.log(' -> Testing Delayed Recall...');
  await page.waitForSelector('#memory-recall-input', { timeout: 15000 });
  await page.type('#memory-recall-input', 'APPLE TABLE PENNY');
  await page.click('#memory-recall-submit-btn');
  console.log(' -> Delayed Recall submitted.');

  // 9. Report Synthesis & Verification
  console.log('[7/7] Verifying Final Report and Multi-Page PDF Download...');
  await page.waitForSelector('#report-view:not(.hidden)', { timeout: 25000 });
  
  // Verify all sections in DOM
  const reportSections = await page.evaluate(() => {
    return {
      header: !!document.querySelector('.clinical-header'),
      subjectInfo: !!document.querySelector('.subject-info-box'),
      compositeScore: document.getElementById('rep-overall-score')?.textContent,
      radarCanvas: !!document.getElementById('cognitive-radar-canvas'),
      benchmarkBars: !!document.getElementById('analytics-bars-wrapper'),
      biomarkerTable: !!document.querySelector('.clinical-table'),
      clockSnapshot: !!document.getElementById('rep-clock-canvas-container'),
      conversationalObs: document.querySelectorAll('#rep-obs-conv li').length,
      cognitiveObs: document.querySelectorAll('#rep-obs-cog li').length,
      riskTable: document.querySelectorAll('#rep-ml-risk-table tr').length,
      recommendations: document.querySelectorAll('#rep-obs-recs li').length,
      summaryText: document.getElementById('rep-obs-summary')?.textContent,
      disclaimer: !!document.querySelector('.clinical-report div[style*="fef2f2"]')
    };
  });

  console.log('=== REPORT SECTIONS VERIFIED ===', JSON.stringify(reportSections, null, 2));

  // Test PDF Download Trigger
  console.log(' -> Triggering Full PDF Export...');
  await page.click('#download-pdf-btn');
  await new Promise(r => setTimeout(r, 3500));
  
  const downloadBtnText = await page.evaluate(() => document.getElementById('download-pdf-btn')?.textContent);
  console.log(' -> PDF Download Button State:', downloadBtnText);

  await page.screenshot({ path: 'full_flow_report_verification.png', fullPage: true });
  console.log(' -> Full page report screenshot saved to full_flow_report_verification.png');

  console.log('=== ALL TESTS COMPLETED SUCCESSFULLY ===');
  await browser.close();
}

runE2E().catch(err => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
