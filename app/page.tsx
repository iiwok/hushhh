'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Component() {
  const [messages, setMessages] = useState<{ text: string, value: number }[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch existing secrets on mount
  useEffect(() => {
    async function fetchSecrets() {
      try {
        const { data, error } = await supabase
          .from('secrets')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        if (data) {
          setMessages(data.map(secret => ({
            text: secret.secret_text,
            value: secret.financial_value
          })))
        }
      } catch (error) {
        console.error('Error fetching secrets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecrets()
  }, [])

  const scrollToBottom = () => {
    const receipt = document.getElementById('receipt-content')
    if (receipt) {
      receipt.scrollTo({
        top: receipt.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const { redactedText, financialValue, analysis } = await handleSecret(newMessage.trim())
        setMessages(prev => [...prev, { text: redactedText, value: financialValue }])
        setNewMessage('')
      } catch (error) {
        console.error('Failed to process secret:', error)
        // Optionally add error handling UI here
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Calculate total
  const totalValue = messages.reduce((sum, message) => sum + message.value, 0)

  return (
    <div className="relative min-h-screen w-full p-4">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.6', // Adjust this value between 0 and 1
          // Alternative: filter: 'brightness(0.6)', // Or use brightness for a different effect
        }}
      />

      {/* Content - now relative to appear above background */}
      <div className="relative z-10 mx-auto max-w-md p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b p-4">
            <div className="font-mono text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-wider">KEEP THE RECEIPTS</h1>
              <div className="text-sm">
                <p>DIGITAL CONFESSIONAL</p>
                <p>555 Internet Street</p>
                <p>Web County, DC 53CR3T</p>
              </div>
            </div>
          </div>
          
          <div 
            id="receipt-content"
            className="font-mono p-4 space-y-2 max-h-[400px] overflow-y-auto bg-white"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500">No secrets yet</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="border-b border-dotted pb-2">
                  <div className="flex justify-between">
                    <span>#{(index + 1).toString().padStart(3, '0')}</span>
                    <span>${message.value.toFixed(2)}</span>
                  </div>
                  <p className="break-words">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-black">
            <div className="font-mono p-4 bg-white">
              <div className="flex justify-between items-center">
                <div className="font-bold">TOTAL</div>
                <div className="font-bold">${totalValue.toFixed(2)}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {messages.length} secret{messages.length !== 1 ? 's' : ''} confessed
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="What's your secret's worth?"
                className="font-mono"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !newMessage.trim()}
                className={isSubmitting ? 'cursor-not-allowed' : ''}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Add'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

async function handleSecret(text: string) {
  try {
    // First redact PII
    const redactResponse = await fetch('/api/redact-pii', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    if (!redactResponse.ok) {
      const error = await redactResponse.json()
      throw new Error(error.message || 'Failed to redact PII')
    }

    const redactData = await redactResponse.json()
    
    if (!redactData.redactedText) {
      throw new Error('No redacted text returned')
    }

    // Then analyze the redacted secret
    const analysisResponse = await fetch('/api/analyze-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: redactData.redactedText })
    })

    if (!analysisResponse.ok) {
      const error = await analysisResponse.json()
      throw new Error(error.message || 'Failed to analyze secret')
    }

    const analysis = await analysisResponse.json()

    // Save to Supabase
    const { error } = await supabase
      .from('secrets')
      .insert([
        { secret_text: redactData.redactedText, financial_value: analysis.FinancialValue }
      ])

    if (error) {
      throw new Error('Failed to save secret to database')
    }

    return {
      redactedText: redactData.redactedText,
      financialValue: analysis.FinancialValue,
      analysis: analysis.Analysis
    }
  } catch (error) {
    console.error('Error processing secret:', error)
    throw error
  }
}
