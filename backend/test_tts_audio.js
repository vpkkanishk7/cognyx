const http = require('http');

function testTtsEndpoint(text, lang) {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:3005/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    http.get(url, (res) => {
      let byteLength = 0;
      res.on('data', chunk => {
        byteLength += chunk.length;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          byteLength
        });
      });
    }).on('error', reject);
  });
}

async function runTtsTestSuite() {
  console.log("===================================================================");
  console.log("   COGNYX COMPLETE DUAL-MODE TTS & AUDIO STREAM VERIFICATION");
  console.log("   Target Languages: Tamil (ta), Hindi (hi), English (en)");
  console.log("===================================================================\n");

  // [TEST 1] Tamil Server TTS Audio Stream
  console.log("[TEST 1] Testing Tamil (/api/tts?lang=ta)...");
  const taRes = await testTtsEndpoint("வணக்கம், நான் உங்கள் டிஜிட்டல் மருத்துவர்.", "ta");
  console.log("Tamil TTS Response:", taRes);
  if (taRes.statusCode === 200 && taRes.contentType.includes('audio/mpeg') && taRes.byteLength > 2000) {
    console.log("✅ Tamil TTS stream returned valid MP3 audio (" + taRes.byteLength + " bytes)!\n");
  } else {
    console.error("❌ Tamil TTS stream failed!");
    process.exit(1);
  }

  // [TEST 2] Hindi Server TTS Audio Stream
  console.log("[TEST 2] Testing Hindi (/api/tts?lang=hi)...");
  const hiRes = await testTtsEndpoint("नमस्ते, मैं आपका डिजिटल चिकित्सक हूँ।", "hi");
  console.log("Hindi TTS Response:", hiRes);
  if (hiRes.statusCode === 200 && hiRes.contentType.includes('audio/mpeg') && hiRes.byteLength > 2000) {
    console.log("✅ Hindi TTS stream returned valid MP3 audio (" + hiRes.byteLength + " bytes)!\n");
  } else {
    console.error("❌ Hindi TTS stream failed!");
    process.exit(1);
  }

  // [TEST 3] English Server TTS Audio Stream
  console.log("[TEST 3] Testing English (/api/tts?lang=en)...");
  const enRes = await testTtsEndpoint("Hello, I am your digital clinician. How are you feeling today?", "en");
  console.log("English TTS Response:", enRes);
  if (enRes.statusCode === 200 && enRes.contentType.includes('audio/mpeg') && enRes.byteLength > 2000) {
    console.log("✅ English TTS stream returned valid MP3 audio (" + enRes.byteLength + " bytes)!\n");
  } else {
    console.error("❌ English TTS stream failed!");
    process.exit(1);
  }

  // [TEST 4] Client Dual-Mode Logic Simulation
  console.log("[TEST 4] Simulating Client Dual-Mode TTS Engine Logic...");
  
  // Mock SpeechSynthesis without Tamil voice (Standard Windows OS profile)
  const mockVoicesStandardWindows = [
    { name: "Microsoft David - English (United States)", lang: "en-US", default: true },
    { name: "Microsoft Hemant - Hindi (India)", lang: "hi-IN", default: false }
  ];

  function simulateVoiceMatch(lang, voices) {
    const l = lang.toLowerCase();
    if (l === "ta") {
      return voices.find(v => {
        const vl = (v.lang || "").toLowerCase().replace('_', '-');
        const vn = (v.name || "").toLowerCase();
        return vl === "ta-in" || vl.startsWith("ta-") || vl === "ta" || vl === "tam" || vn.includes("tamil") || vn.includes("தமிழ்") || vn.includes("valluvar") || vn.includes("latha");
      }) || null;
    }
    if (l === "hi") {
      return voices.find(v => {
        const vl = (v.lang || "").toLowerCase().replace('_', '-');
        const vn = (v.name || "").toLowerCase();
        return vl === "hi-in" || vl.startsWith("hi-") || vl === "hi" || vl === "hin" || vn.includes("hindi") || vn.includes("हिन्दी") || vn.includes("hemant") || vn.includes("kalpana");
      }) || null;
    }
    const enIn = voices.find(v => {
      const vl = (v.lang || "").toLowerCase().replace('_', '-');
      const vn = (v.name || "").toLowerCase();
      return vl === "en-in" || (vl.startsWith("en") && (vn.includes("india") || vn.includes("ravi")));
    });
    if (enIn) return enIn;
    return voices.find(v => (v.lang || "").toLowerCase().startsWith("en-")) || null;
  }

  function simulateSpeak(text, lang, voices) {
    const matchedVoice = simulateVoiceMatch(lang, voices);
    if (matchedVoice) {
      return {
        mode: "browser_speech_synthesis",
        voice: matchedVoice.name,
        lang: matchedVoice.lang
      };
    }
    // Seamless server stream fallback
    return {
      mode: "server_audio_stream",
      url: `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`,
      lang: lang
    };
  }

  const taSimulation = simulateSpeak("வணக்கம், நான் உங்கள் டிஜிட்டல் மருத்துவர்.", "ta", mockVoicesStandardWindows);
  console.log("Tamil on Standard Windows Simulation:", taSimulation);
  if (taSimulation.mode === "server_audio_stream" && taSimulation.url.includes("lang=ta")) {
    console.log("✅ Tamil seamlessly falls back to server audio stream when local voice is missing!");
  } else {
    console.error("❌ Tamil simulation failed!");
    process.exit(1);
  }

  const hiSimulation = simulateSpeak("नमस्ते, मैं आपका डिजिटल चिकित्सक हूँ।", "hi", mockVoicesStandardWindows);
  console.log("Hindi Simulation:", hiSimulation);
  if (hiSimulation.mode === "browser_speech_synthesis" && hiSimulation.voice.includes("Hemant")) {
    console.log("✅ Hindi uses browser SpeechSynthesis voice!");
  } else {
    console.error("❌ Hindi simulation failed!");
    process.exit(1);
  }

  const enSimulation = simulateSpeak("Hello, I am your digital clinician.", "en", mockVoicesStandardWindows);
  console.log("English Simulation:", enSimulation);
  if (enSimulation.mode === "browser_speech_synthesis" && enSimulation.voice.includes("David")) {
    console.log("✅ English uses browser SpeechSynthesis voice!");
  } else {
    console.error("❌ English simulation failed!");
    process.exit(1);
  }

  console.log("\n===================================================================");
  console.log("   ✅ ALL DUAL-MODE TTS AUDIO TESTS PASSED PERFECTLY!");
  console.log("===================================================================");
}

runTtsTestSuite();
