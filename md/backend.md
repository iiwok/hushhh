# Backend

## **About the Backend**
The backend is powered by **Supabase**, which handles database storage, API routing, and authentication logic. Additional business logic is implemented using OpenAI GPT for PII detection and secret valuation.

## **Tech Stack**
- **Database:** Supabase PostgreSQL
- **API Layer:** Supabase Functions
- **Business Logic:** Node.js and OpenAI GPT API integration

## **Database Tables**
1. **Secrets**
   - `id`: Unique identifier for each secret (UUID).
   - `content`: The submitted secret (text).
   - `valuation`: The secret's "value" score (integer).
   - `redacted_content`: The secret text with PII redacted.
   - `created_at`: Timestamp for when the secret was submitted.
2. **Logs (optional for debugging)**
   - `id`: Unique identifier for each log entry.
   - `secret_id`: Foreign key referencing the `Secrets` table.
   - `redactions`: List of redacted elements (JSON).
   - `processing_time`: Time taken for processing.

## **Business Logic**
1. **PII Redaction**: Use OpenAI GPT API to detect and redact PII from the submitted secret.
2. **Secret Valuation**: Assign a "value" score based on predefined parameters.
3. **Feed Sorting**: Return secrets sorted by submission time.

## **Requirements**
- Secrets must be processed within 3 seconds.
- Secure all API endpoints with Supabase policies.
- Scalable database structure to handle up to 10,000 concurrent users.
