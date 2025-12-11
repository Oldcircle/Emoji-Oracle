import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GameTopic, Language, PuzzleData, ModelConfig } from '../types';

// Standardized Puzzle Schema Definition
const PUZZLE_SCHEMA_OBJ = {
  type: 'object',
  properties: {
    emojis: {
      type: 'string',
      description: 'A sequence of 2-5 emojis representing the answer.',
    },
    answer: {
      type: 'string',
      description: 'The primary correct answer text.',
    },
    acceptable_answers: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of other acceptable synonyms or variations for the answer.',
    },
    hint: {
      type: 'string',
      description: 'A helpful text hint that does not give away the answer directly.',
    },
  },
  required: ['emojis', 'answer', 'acceptable_answers', 'hint'],
};

// Gemini SDK specific schema
const GEMINI_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    emojis: { type: Type.STRING, description: 'A sequence of 2-5 emojis.' },
    answer: { type: Type.STRING, description: 'The primary answer.' },
    acceptable_answers: { type: Type.ARRAY, items: { type: Type.STRING } },
    hint: { type: Type.STRING, description: 'A hint.' },
  },
  required: ['emojis', 'answer', 'acceptable_answers', 'hint'],
};

export const generatePuzzle = async (
  topic: GameTopic,
  language: Language,
  temperature: number,
  config: ModelConfig
): Promise<PuzzleData> => {
  const langName = language === Language.EN ? 'English' : 'Chinese (Simplified)';
  const randomSeed = Math.floor(Math.random() * 1000000);
  const effectiveTemperature = Math.max(temperature, 0.7); // Avoid too low temp for games

  const systemPrompt = `You are a creative game master.
  Generate a unique emoji puzzle.
  Topic: "${topic}"
  Target Language: ${langName}
  Random Seed: ${randomSeed}

  Strategies:
  1. Roll internally for sub-genre and difficulty (Easy/Medium/Hard).
  2. Pick an entity that is NOT a cliché.
  3. Output JSON.
  
  Format: JSON matching { emojis, answer, acceptable_answers, hint }.
  Diversity Rule: Do NOT repeat recent outputs.`;

  try {
    // 1. Google Gemini Strategy
    if (config.provider === 'google') {
      const apiKey = config.apiKey || process.env.API_KEY;
      if (!apiKey) throw new Error('No API Key for Gemini');
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: config.modelName,
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_SCHEMA,
          temperature: effectiveTemperature,
        },
      });
      if (response.text) return JSON.parse(response.text) as PuzzleData;
    } 
    
    // 2. OpenAI / DeepSeek / Groq / Ollama Strategy (Chat Completions)
    else if (['openai', 'deepseek', 'ollama', 'groq'].includes(config.provider)) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const body = {
        model: config.modelName,
        messages: [
          { role: 'system', content: systemPrompt + " Return ONLY valid JSON." },
          { role: 'user', content: "Generate a new puzzle now." }
        ],
        temperature: effectiveTemperature,
        // Helper: enable JSON mode if supported (common in newer OpenAI/DeepSeek/Ollama)
        response_format: { type: 'json_object' }
      };

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error ${response.status}: ${err}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return JSON.parse(content) as PuzzleData;
    }

    // 3. Anthropic Claude Strategy
    else if (config.provider === 'anthropic') {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey || '',
        'anthropic-version': '2023-06-01'
      };
      
      // Note: Anthropic often requires a proxy from browser due to CORS.
      // Assuming user has a working endpoint or proxy.
      
      const response = await fetch(`${config.baseUrl}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.modelName,
          max_tokens: 1024,
          system: systemPrompt + " Return ONLY valid JSON.",
          messages: [{ role: 'user', content: "Generate puzzle." }],
          temperature: effectiveTemperature,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Anthropic Error ${response.status}: ${err}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      if (content) return JSON.parse(content) as PuzzleData;
    }

    throw new Error('No valid response from model');

  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      emojis: '⚠️🤖',
      answer: 'Error',
      acceptable_answers: [],
      hint: `Model error: ${(error as Error).message}. Check settings.`,
    };
  }
};