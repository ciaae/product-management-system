import dotenv from 'dotenv';

dotenv.config();

const placeholderValues = new Set(['', 'your_openai_api_key_here', 'replace_with_your_key', 'changeme']);

const requiredKeys = ['DATABASE_URL', 'FRONTEND_URL'] as const;

for (const key of requiredKeys) {
  if (!process.env[key] || !process.env[key]?.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const rawAiApiKey = process.env.AI_API_KEY?.trim() ?? '';
if (rawAiApiKey && placeholderValues.has(rawAiApiKey.toLowerCase())) {
  console.warn('AI_API_KEY is set to a placeholder value; using local fallback tag generation until a real key is configured.');
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  aiApiKey: rawAiApiKey,
  aiModel: process.env.AI_MODEL ?? 'gpt-4o-mini',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3001'
};
