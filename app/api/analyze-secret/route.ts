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
          content: "You are a financial analyst. You must analyze secrets and provide numerical valuations. Always respond with exact numbers and detailed breakdowns in JSON format."
        },
        {
          role: "user",
          content: `Analyze this secret and provide a detailed financial breakdown:

Secret: "${secret}"

Calculate and provide ALL of these specific values in your JSON response:
1. RevenueImpact (in USD)
2. MarketImpact (in USD)
3. LegalCosts (in USD)
4. ProtectionCosts (in USD)
5. DamageControlCosts (in USD)
6. ScarcityFactor (scale 0-10)
7. MarketDemandFactor (scale 0-10)

Calculate the final FinancialValue using this exact formula:
BaseValue = RevenueImpact + MarketImpact + LegalCosts + ProtectionCosts

### Output:
Provide the result in JSON format with:
- "FinancialValue": The calculated value of the secret (as a number).
- "Analysis": A brief explanation of the factors considered.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0].message.content)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze secret' },
      { status: 500 }
    )
  }
}