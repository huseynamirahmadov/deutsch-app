'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationResult, TranslationDirection } from '@/lib/types';

export async function translateText(
  text: string,
  direction: TranslationDirection
): Promise<TranslationResult> {
  if (!text || text.trim() === '') {
    return {
      translatedText: '',
      detectedLanguage: '',
      vocabularyBreakdown: [],
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured.');
  }

  const sourceLang = direction === 'az-to-de' ? 'Azerbaijani' : 'German';
  const targetLang = direction === 'az-to-de' ? 'German' : 'Azerbaijani';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are a professional ${sourceLang}-to-${targetLang} translator.
    Translate the following ${sourceLang} text into ${targetLang} with natural, fluent phrasing.

    You must also extract 2-3 key vocabulary words or idioms from the SOURCE text.
    For each word, explain its grammatical role or meaning briefly in Azerbaijani to assist language learners.

    Return your response STRICTLY as a raw JSON object matching this exact schema:
    {
      "translatedText": "string — the translated text in ${targetLang}",
      "detectedLanguage": "string — the detected source language name, e.g. '${sourceLang}'",
      "vocabularyBreakdown": [
        {
          "word": "string — the key word or idiom from the source text",
          "meaning": "string — its meaning in ${targetLang}",
          "notes": "string — a brief grammatical note or explanation in Azerbaijani"
        }
      ]
    }

    CRITICAL RULES:
    - Do NOT include markdown formatting, backticks, or any text outside of the JSON object.
    - Return ONLY the raw JSON.
    - The "vocabularyBreakdown" array must have exactly 2 to 3 items.
    - All "notes" values MUST be written in Azerbaijani.`;

    const result = await model.generateContent([systemPrompt, text]);
    let responseText = result.response.text().trim();

    // Strip markdown formatting if Gemini accidentally includes it
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.startsWith('```')) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }

    const parsed: TranslationResult = JSON.parse(responseText.trim());
    return parsed;
  } catch (error) {
    console.error('Error in translateText:', error);
    throw new Error('Failed to translate text. Please try again.');
  }
}
