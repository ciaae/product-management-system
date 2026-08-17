import OpenAI from 'openai';
import * as z from 'zod';
import { env } from '../config/env.js';
import { AiServiceError } from '../lib/errors.js';
import { normalizeTags } from '../lib/tagUtils.js';

const aiTagArraySchema: any = z.array(z.string()).transform((value: string[]) => normalizeTags(value).slice(0, 5));

export function generateFallbackTags(name: string, description: string): string[] {
  const fillerWords = new Set([
    'with',
    'and',
    'for',
    'the',
    'this',
    'that',
    'from',
    'into',
    'your',
    'have',
    'been',
    'about'
  ]);

  const sourceText = `${name} ${description}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sourceText) {
    return [];
  }

  const tokens = sourceText
    .split(' ')
    .filter((token) => token.length > 2)
    .filter((token) => !fillerWords.has(token))
    .filter((token, index, array) => array.indexOf(token) === index);

  return normalizeTags(tokens).slice(0, 5);
}

function parseAiTags(rawContent: string): string[] {
  if (!rawContent || rawContent.trim().length === 0) {
    throw new AiServiceError('AI returned an empty tag list');
  }

  const cleanContent = rawContent
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanContent);
  } catch {
    throw new AiServiceError('AI returned malformed JSON');
  }

  if (Array.isArray(parsed)) {
    return aiTagArraySchema.parse(parsed);
  }

  if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { tags?: unknown[] }).tags)) {
    return aiTagArraySchema.parse((parsed as { tags: unknown[] }).tags);
  }

  throw new AiServiceError('AI returned an unsupported tag format');
}

export async function generateProductTagsFromText(name: string, description: string): Promise<string[]> {
  const placeholderAiKey = env.aiApiKey.trim().toLowerCase();

  if (!env.aiApiKey || ['your_openai_api_key_here', 'replace_with_your_key', 'changeme'].includes(placeholderAiKey)) {
    const fallbackTags = generateFallbackTags(name, description);

    if (fallbackTags.length >= 3) {
      return fallbackTags;
    }

    throw new AiServiceError('AI API key is not configured. Add a valid API key to enable AI tag generation.');
  }

  try {
    const client = new OpenAI({ apiKey: env.aiApiKey });

    const completion = await client.chat.completions.create({
      model: env.aiModel,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You generate concise product tags. Return valid JSON in the format {"tags": ["tag1", "tag2", ...]} with 3 to 5 short tags only.'
        },
        {
          role: 'user',
          content: `Generate exactly 5 short relevant product tags for this product. Name: ${name}. Description: ${description}. Prefer short one- to three-word lowercase tags. Avoid duplicates, hashtags, and sentences.`
        }
      ]
    });

    const rawContent = completion.choices[0]?.message?.content ?? '';
    const tags = parseAiTags(rawContent);

    if (tags.length < 3) {
      throw new AiServiceError('AI returned too few valid tags');
    }

    return tags.slice(0, 5);
  } catch (error) {
    if (error instanceof AiServiceError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown OpenAI error';
    console.error('OpenAI request failed:', message);
    throw new AiServiceError(`AI service failed to generate tags: ${message}`);
  }
}
