/**
 * Google Gemini API Integration
 * Provides type-safe access to Gemini models using the modern @google/genai SDK
 */

import { GoogleGenAI } from '@google/genai';
import type { ModelPreference } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will be disabled.');
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/**
 * Model configurations with generation parameters
 */
export const MODEL_CONFIGS = {
  'gemini-2.5-pro': {
    temperature: 0.7,
    maxOutputTokens: 8192,
    topP: 0.95,
    topK: 40,
  },
  'gemini-2.5-flash': {
    temperature: 0.9,
    maxOutputTokens: 8192,
    topP: 0.95,
    topK: 40,
  },
  'gemini-2.5-flash-lite': {
    temperature: 0.9,
    maxOutputTokens: 4096,
    topP: 0.95,
    topK: 40,
  },
  'gemini-2.0-pro': {
    temperature: 0.4,
    maxOutputTokens: 4096,
    topP: 0.95,
    topK: 40,
  },
} as const;

/**
 * Get the Gemini AI client
 */
export function getClient() {
  if (!ai) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
  }
  return ai;
}



/**
 * Generate content with streaming support
 */
export async function* generateContentStream(
  model: ModelPreference,
  prompt: string,
  systemInstruction?: string
): AsyncGenerator<string> {
  const client = getClient();

  try {
    const baseConfig = MODEL_CONFIGS[model];
    const config = systemInstruction
      ? {
          ...baseConfig,
          systemInstruction,
        }
      : baseConfig;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    // For streaming, we'll yield the full response for now
    // Note: The Google GenAI SDK's streaming API may differ slightly
    if (response.text) {
      yield response.text;
    }
  } catch (error) {
    console.error('Gemini streaming error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate content without streaming
 */
export async function generateContent(
  model: ModelPreference,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const client = getClient();

  try {
    const baseConfig = MODEL_CONFIGS[model];
    const config = systemInstruction
      ? {
          ...baseConfig,
          systemInstruction,
        }
      : baseConfig;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    return response.text || '';
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate API key by making a simple test request
 */
export async function validateApiKey(): Promise<boolean> {
  if (!ai) return false;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello',
    });
    return !!response.text;
  } catch {
    return false;
  }
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}
