import openai from 'openai'

export async function analyze_secret(secretDescription: string): Promise<number> {
  const prompt = `
    You are an expert financial and strategic analyst for evaluating secrets.
    Based on the description of the secret, infer the financial impact and calculate its cost.

    ### Secret Description:
    "${secretDescription}"

    ### What to Do:
    1. Infer the following factors based on the secret:
       - Revenue/Profit Impact ($)
       - Market Impact ($)
       - Legal Costs ($)
       - Protection Costs ($)
       - Damage Control Costs ($)
       - Scarcity Factor (0-10)
       - Market Demand Factor (0-10)
    2. Use the following formula to calculate the secret's financial value:
       - Base Value = RevenueImpact + MarketImpact + LegalCosts + ProtectionCosts + DamageControlCosts
       - Multiplier = (ScarcityFactor / 10) * (MarketDemandFactor / 10)
       - Financial Value = Base Value * (1 + Multiplier)

    ### Output:
    Provide the result in JSON format with:
    - "FinancialValue": The calculated value of the secret (as a number).
  `

  try {
    const response = await openai.Completion.create({
      engine: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0
    })

    const result = response.choices[0].text
    const financialValue = eval(result).FinancialValue || 0
    return financialValue
  } catch (error) {
    console.error("Error calculating secret value:", error)
    return 0
  }
} 