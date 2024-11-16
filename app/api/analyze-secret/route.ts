import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Your task is to calculate the financial cost of secrets based on their implications. Assume all impacts are costs (not benefits) unless explicitly stated otherwise. Always respond with exact numbers and a detailed breakdown in JSON format."
        },
        {
          role: "user",
          content: `Analyze this secret and provide a detailed financial breakdown:

Secret: "${secret}"

### Guidelines:
1. All monetary impacts (RevenueImpact, MarketImpact, LegalCosts, ProtectionCosts, DamageControlCosts) must be zero or positive.
2. ScarcityFactor and MarketDemandFactor are non-negative multipliers for BaseValue, not standalone contributors to FinancialValue.

### Calculation:
1. BaseValue = RevenueImpact + MarketImpact + LegalCosts + ProtectionCosts + DamageControlCosts (in USD)
2. Multiplier = (ScarcityFactor / 10) * (MarketDemandFactor / 10)
3. FinancialValue = BaseValue * (1 + Multiplier)

### Output:
Provide the response in JSON format with:
- "FinancialValue": The calculated value of the secret (as a number).
- "Analysis": A brief explanation of the factors considered.` 
}
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    if (!response.choices[0]?.message?.content) {
        throw new Error('No response content from OpenAI')
      }
  
      const result = JSON.parse(response.choices[0].message.content)
      return NextResponse.json(result)
    } catch (err) {  // This is correct
      console.error('Analysis error:', err)
      return NextResponse.json(
        { error: 'Failed to analyze secret', details: err instanceof Error ? err.message : 'Unknown error' },
        { status: 500 }
      )
    }
  }
  
  export const runtime = 'edge'
  export const dynamic = 'force-dynamic'