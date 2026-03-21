-- HireLens Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bslhdwtijjtixbhqndaj/sql

-- Analysis sessions table
CREATE TABLE IF NOT EXISTS analysis_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  missing_keywords TEXT[] DEFAULT '{}',
  present_keywords TEXT[] DEFAULT '{}',
  weak_sections JSONB DEFAULT '[]',
  rejection_risk JSONB DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own sessions
CREATE POLICY "Users can view their own sessions"
  ON analysis_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can insert their own sessions
CREATE POLICY "Users can insert their own sessions"
  ON analysis_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can delete their own sessions
CREATE POLICY "Users can delete their own sessions"
  ON analysis_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON analysis_sessions(created_at DESC);

-- ============================================================
-- User Profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  university TEXT NOT NULL DEFAULT '',
  major TEXT NOT NULL DEFAULT '',
  degree_level TEXT NOT NULL DEFAULT 'bachelors', -- bachelors, masters, phd
  graduation_year INTEGER,
  skills TEXT[] DEFAULT '{}',
  experience_level TEXT NOT NULL DEFAULT 'entry', -- entry, mid, senior
  preferred_roles TEXT[] DEFAULT '{}',  -- e.g. {"Software Engineer", "Data Analyst"}
  preferred_locations TEXT[] DEFAULT '{}', -- e.g. {"Chicago", "Remote"}
  job_type TEXT NOT NULL DEFAULT 'fulltime', -- fulltime, parttime, internship, contract
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id);
