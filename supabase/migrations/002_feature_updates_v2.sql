-- Shadow Rank Feature Updates v2
-- Migration for new columns and features

-- Add goal column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS goal TEXT;

-- Add resume_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Add resume_uploaded_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS resume_uploaded_at TIMESTAMPTZ;

-- Add earned_xp column to skills table (XP earned from activities, separate from base level)
ALTER TABLE public.skills 
ADD COLUMN IF NOT EXISTS earned_xp INTEGER DEFAULT 0;

-- Add base_level column to skills table (level derived from resume parsing)
ALTER TABLE public.skills 
ADD COLUMN IF NOT EXISTS base_level INTEGER DEFAULT 1 CHECK (base_level >= 1 AND base_level <= 10);

-- Create storage bucket for resumes (Note: This needs to be done via Supabase dashboard or API)
-- The bucket name should be 'resumes' with the following configuration:
-- - Public: false (private bucket)
-- - File size limit: 10MB
-- - Allowed MIME types: application/pdf, text/plain, text/markdown

-- Comment explaining the bucket setup for manual creation:
COMMENT ON TABLE public.profiles IS 'User profiles. Resume files stored in Supabase Storage bucket "resumes" with path format: {user_id}/resume.{extension}';

-- RLS policies for resumes bucket (to be applied via Supabase dashboard):
-- Policy: Users can upload their own resumes
--   Operation: INSERT
--   Policy: (bucket_id = 'resumes') AND (auth.uid()::text = (storage.foldername(name))[1])
--
-- Policy: Users can view their own resumes  
--   Operation: SELECT
--   Policy: (bucket_id = 'resumes') AND (auth.uid()::text = (storage.foldername(name))[1])
--
-- Policy: Users can update their own resumes
--   Operation: UPDATE
--   Policy: (bucket_id = 'resumes') AND (auth.uid()::text = (storage.foldername(name))[1])
--
-- Policy: Users can delete their own resumes
--   Operation: DELETE
--   Policy: (bucket_id = 'resumes') AND (auth.uid()::text = (storage.foldername(name))[1])
