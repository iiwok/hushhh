# About the Project

## **Overview**
The **"Neverending Receipt for Secrets"** is a web-based platform that allows users to anonymously share their secrets. The platform ensures anonymity, redacts personally identifiable information (PII) using AI, and assigns a "value" to each secret. All secrets are displayed in a continuous, receipt-style feed accessible worldwide.

## **How It Works**
1. Users anonymously submit their secrets via a simple web form.
2. Submissions are processed by the backend to:
   - Detect and redact PII using OpenAI GPT-based tools.
   - Assign a "value" score to the secret based on predefined parameters.
3. Secrets are displayed in a neverending receipt-style feed for everyone to view.

## **Technology Involved**
- **Frontend:** TypeScript, Next.js
- **Backend:** Supabase, OpenAI GPT API
- **Database:** Supabase PostgreSQL
- **Hosting:** Vercel (Frontend), Supabase (Backend)
- **Other:** Secure HTTPS communication
