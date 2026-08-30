const { generateCompletionWithFailover } = require('./llmRouter');

function robustJsonParse(str) {
    try { return JSON.parse(str); } catch(e) {}
    str = str.replace(/\\\json/gi, '').replace(/\\\/g, '').trim();
    str = str.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        try { return JSON.parse(str.substring(start, end + 1)); } catch(e) { return null; }
    }
    return null;
}
