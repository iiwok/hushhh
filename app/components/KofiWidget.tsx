'use client'

import { useEffect } from 'react'

interface KofiOptions {
  'type': string
  'floating-chat.donateButton.text': string
  'floating-chat.donateButton.background-color': string
  'floating-chat.donateButton.text-color': string
}

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: KofiOptions) => void
    }
  }
}

export default function KofiWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
    script.async = true
    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw('hushhh', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Buy me a coffee',
          'floating-chat.donateButton.background-color': '#ffffff',
          'floating-chat.donateButton.text-color': '#323842'
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}
