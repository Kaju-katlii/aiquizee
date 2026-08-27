import { GoogleGenAI, Type } from '@google/genai';
import { QuizQuestion } from '../types';

// Client-side API key retrieval with local storage support
export function getStoredApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('quiz_gemini_api_key');
    if (saved && saved.trim()) return saved.trim();
  }
  const envKey = (process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '') as string;
  return envKey ? envKey.trim() : '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('quiz_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('quiz_gemini_api_key');
    }
  }
}

export async function generateQuizQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5,
  apiKeyOverride?: string
): Promise<QuizQuestion[]> {
  const apiKey = (apiKeyOverride || getStoredApiKey()).trim();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_REQUIRED');
  }

  const ai = new GoogleGenAI({ apiKey });
  const sanitizedCount = Math.min(Math.max(Number(count) || 5, 3), 10);

  const prompt = `Generate an interactive multiple-choice quiz about "${topic.trim()}".
Difficulty level: ${difficulty}.
Number of questions: exactly ${sanitizedCount}.
Make each question clear, accurate, engaging, and provide 4 distinct options labeled A, B, C, D along with the correct answer key and a 1-sentence helpful explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert quiz designer and educator. Return accurate, captivating multiple-choice questions with distinct options.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The question prompt',
              },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING, description: 'Option A text' },
                  B: { type: Type.STRING, description: 'Option B text' },
                  C: { type: Type.STRING, description: 'Option C text' },
                  D: { type: Type.STRING, description: 'Option D text' },
                },
                required: ['A', 'B', 'C', 'D'],
              },
              answer: {
                type: Type.STRING,
                description: 'The single correct option letter: A, B, C, or D',
              },
              explanation: {
                type: Type.STRING,
                description: 'Short explanation of why this answer is correct',
              },
            },
            required: ['question', 'options', 'answer'],
          },
        },
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    let parsedQuestions: any[];
    try {
      parsedQuestions = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        parsedQuestions = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse quiz response format.');
      }
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error('Invalid questions structure received.');
    }

    return parsedQuestions.map((q) => {
      let ans = String(q.answer || 'A').toUpperCase().trim();
      if (!['A', 'B', 'C', 'D'].includes(ans)) {
        ans = 'A';
      }
      return {
        question: q.question || 'Untitled question',
        options: {
          A: q.options?.A || 'Option A',
          B: q.options?.B || 'Option B',
          C: q.options?.C || 'Option C',
          D: q.options?.D || 'Option D',
        },
        answer: ans as 'A' | 'B' | 'C' | 'D',
        explanation: q.explanation || '',
      };
    });
  } catch (err: any) {
    // If model name error, retry with direct REST fallback to gemini-2.5-flash
    console.warn('GoogleGenAI SDK call error, trying direct REST call...', err);
    return fetchDirectGemini(topic, difficulty, sanitizedCount, apiKey);
  }
}

async function fetchDirectGemini(
  topic: string,
  difficulty: string,
  count: number,
  apiKey: string
): Promise<QuizQuestion[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const promptText = `Generate a ${count}-question multiple choice quiz on "${topic}". Difficulty: ${difficulty}.
Return ONLY valid JSON matching this structure:
[
  {
    "question": "question text",
    "options": { "A": "option 1", "B": "option 2", "C": "option 3", "D": "option 4" },
    "answer": "A",
    "explanation": "why this is correct"
  }
]`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Gemini API returned error ${res.status}: ${res.statusText}`
    );
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No content returned from Gemini.');

  const parsed = JSON.parse(rawText);
  return parsed.map((q: any) => ({
    question: q.question,
    options: {
      A: q.options?.A || 'Option A',
      B: q.options?.B || 'Option B',
      C: q.options?.C || 'Option C',
      D: q.options?.D || 'Option D',
    },
    answer: (q.answer?.toUpperCase() || 'A') as 'A' | 'B' | 'C' | 'D',
    explanation: q.explanation || '',
  }));
}
