-- Table for caching Telegram AI extractions while waiting for the user to press [Confirm] or [Cancel]
CREATE TABLE pending_telegram_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: We do not need RLS here because this table is exclusively accessed server-side by the Next.js API using the service_role_key.
