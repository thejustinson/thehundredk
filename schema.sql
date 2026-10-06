-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Offers Table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_number SERIAL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    activity_date DATE DEFAULT CURRENT_DATE,
    
    -- Prospect Details (Private by default)
    person_name TEXT,
    company_name TEXT,
    person_role TEXT,
    industry TEXT,
    
    -- Contact Details (Strictly Private)
    contact_email TEXT,
    contact_phone TEXT,
    contact_username TEXT,
    
    -- Offer Details
    offer_title TEXT NOT NULL,
    offer_description TEXT,
    channel TEXT,
    
    -- Pipeline State
    stage TEXT NOT NULL DEFAULT 'contacted', -- e.g., contacted, responded, conversation, proposal, negotiation, won, lost
    status TEXT NOT NULL DEFAULT 'pending',  -- e.g., pending, won, lost
    
    -- Financials
    deal_value NUMERIC,
    deal_currency TEXT DEFAULT 'USD',
    
    -- Next Steps
    next_action TEXT,
    next_action_date DATE,
    
    -- Outcomes
    rejection_reason TEXT,
    private_notes TEXT,
    public_notes TEXT,
    lesson TEXT,
    
    -- Visibility & Auth
    is_public BOOLEAN DEFAULT FALSE,
    created_by TEXT -- Maps to Telegram User ID or Supabase Auth UUID
);

-- 2. Offer Events Table (History)
CREATE TABLE offer_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_date DATE DEFAULT CURRENT_DATE,
    
    -- Event Details
    event_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    
    -- Stage Transitions
    old_stage TEXT,
    new_stage TEXT,
    
    -- Outcomes
    notes TEXT,
    lesson TEXT,
    
    -- Visibility & Auth
    is_public BOOLEAN DEFAULT FALSE,
    created_by TEXT
);

-- 3. Indexes for performance
CREATE INDEX idx_offers_created_by ON offers(created_by);
CREATE INDEX idx_offer_events_offer_id ON offer_events(offer_id);
CREATE INDEX idx_offers_is_public ON offers(is_public) WHERE is_public = TRUE;

-- 4. Row Level Security (RLS) policies
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_events ENABLE ROW LEVEL SECURITY;

-- Public read access for explicitly public records
CREATE POLICY "Public profiles are viewable by everyone." 
ON offers FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Public events are viewable by everyone." 
ON offer_events FOR SELECT USING (is_public = TRUE);

-- (Further policies for authenticated service_role and users would go here)
