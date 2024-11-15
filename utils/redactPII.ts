'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function redactPII(message: string): Promise<string> {
  // Your existing logic to redact PII
  return message // Ensure it returns a string
} 