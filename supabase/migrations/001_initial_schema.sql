-- Shadow Rank Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  github_id TEXT UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  rank TEXT NOT NULL DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A')),
  xp INTEGER NOT NULL DEFAULT 0,
  current_quest JSONB,
  resume_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Quest history table
CREATE TABLE IF NOT EXISTS public.quest_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quest_title TEXT NOT NULL,
  quest_description TEXT,
  repo_url TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Skills policies
CREATE POLICY "Users can view their own skills"
  ON public.skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
  ON public.skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
  ON public.skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quest history policies
CREATE POLICY "Users can view their own quest history"
  ON public.quest_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quest history"
  ON public.quest_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, github_id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'user_name',
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'name', 'Hunter'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Initialize debugging skill for new users
  INSERT INTO public.skills (user_id, skill_name, level, xp)
  VALUES (NEW.id, 'Debugging', 1, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_history_user_id ON public.quest_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_github_id ON public.profiles(github_id);
