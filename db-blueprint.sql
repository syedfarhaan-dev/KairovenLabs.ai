-- Database Blueprint for Kairoven Labs Lead Capture System
-- Paste this script into your Supabase SQL Editor to provision the table.

CREATE TABLE IF NOT EXISTS contact_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    project_details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New Lead',
    ip_address TEXT,
    source_page TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous insertions from the public contact form
CREATE POLICY "Allow public inserts to contact_leads" 
ON contact_leads 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy to allow authenticated/service_role access to read/write everything
CREATE POLICY "Allow service_role full management" 
ON contact_leads 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
