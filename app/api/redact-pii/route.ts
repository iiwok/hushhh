import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Validate input
    if (!request.body) {
      return NextResponse.json({ error: 'No request body' }, { status: 400 })
    }

    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at identifying and redacting PII (Personal Identifiable Information). This means names, birthdays, addresses, phone numbers, social security numbers, passport numbers. Return the text with PII replaced with [REDACTED]."
        },
        {
          role: "user",
          content: `Redact any PII from this text: "${text}"`
        }
      ],
    })

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ 
      redactedText: response.choices[0].message.content,
      success: true 
    })
  } catch (error) {
    console.error('Redaction error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to redact PII',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
