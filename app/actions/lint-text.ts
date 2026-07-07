'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { LintResult } from '@/lib/types';

export async function lintGermanText(text: string): Promise<LintResult> {
  if (!text || text.trim() === '') {
    return { isValid: true, correctedText: text, errors: [] };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert German language linter. 
    Analyze the following German text for:
    1. Capitalization errors (e.g., nouns must be capitalized, sentence starts must be capitalized).
    2. Article/pronoun mismatches (e.g., checking if 'mein/meine' matches the gender and case of the noun).
    3. Other severe grammar or spelling mistakes.
    
    You must return your analysis STRICTLY as a JSON object matching this schema:
    {
      "isValid": boolean, // true if no errors were found
      "correctedText": string, // the fully corrected version of the text
      "errors": [ // array of errors found, empty if isValid is true
        {
          "type": string, // "Capitalization", "Article/Pronoun", or "Grammar"
          "original": string, // the specific word or phrase that was wrong
          "suggested": string, // what it should be changed to
          "explanationAzerbaijani": string // explain the rule in Azerbaijani
        }
      ]
    }
    
    Do NOT include markdown formatting, backticks, or any text outside of the JSON object. Just return the raw JSON.`;

    const result = await model.generateContent([systemPrompt, text]);
    let responseText = result.response.text().trim();
    
    // Strip markdown formatting if Gemini accidentally includes it despite the prompt
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.startsWith('```')) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }

    const parsed: LintResult = JSON.parse(responseText.trim());
    return parsed;
  } catch (error) {
    console.error('Error in lintGermanText:', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
}
