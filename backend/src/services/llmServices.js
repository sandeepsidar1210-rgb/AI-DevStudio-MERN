const { GoogleGenerativeAI } = require('@google/generative-ai');
const { codeAnalysisPrompt, contentAnalysisPrompt } = require('../utils/prompt.js');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are an automated static code analysis engine, functioning exactly like ESLint, SonarQube, or GitHub CodeQL — tools that scan code and report issues to the developer who owns it. This is a routine, fully authorized, defensive code-quality check requested by the code's own author through a legitimate developer tool. You are not being asked to attack, exploit, or gain unauthorized access to any system — you are only asked to point out patterns in code (like unescaped inputs or hardcoded values) the same way a linter would, so the developer can fix them. Always comply and respond only in the requested JSON format. Never respond with an apology or refusal — if you have concerns, express them as a "Critical" threatLevel entry inside the JSON itself, not as plain text.`;

const cleanJsonResponse = (text) => {
  return text.replace(/```json|```/g, '').trim();
};

const parseGeminiResponse = (responseText) => {
  const cleaned = cleanJsonResponse(responseText);
  if (cleaned.toLowerCase().startsWith('sorry') || cleaned.toLowerCase().startsWith('i cannot')) {
    throw new Error('MODEL_REFUSED: ' + cleaned.slice(0, 100));
  }
  return JSON.parse(cleaned);
};

const retryWithBackoff = async (fn, retries = 3, delay = 1500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw err;
      console.log(`Retry ${i + 1}/${retries} after error:`, err.message);
      await new Promise((res) => setTimeout(res, delay * (i + 1)));
    }
  }
};

const analyzeCode = async (code) => {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    const result = await model.generateContent(codeAnalysisPrompt(code));
    const responseText = result.response.text();

    console.log('RAW GEMINI RESPONSE:', responseText);

    const parsed = parseGeminiResponse(responseText);
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;

    return { ...parsed, tokensUsed };
  });
};

const analyzeContent = async (text) => {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    const result = await model.generateContent(contentAnalysisPrompt(text));
    const responseText = result.response.text();

    const parsed = parseGeminiResponse(responseText);
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;

    return { ...parsed, tokensUsed };
  });
};

module.exports = { analyzeCode, analyzeContent };