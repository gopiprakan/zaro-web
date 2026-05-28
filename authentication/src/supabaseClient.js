import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not the default placeholders
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-supabase') &&
  !supabaseAnonKey.includes('your-supabase') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.trim() !== '';

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const checkSupabaseConnection = () => {
  return {
    isConfigured,
    supabaseUrl,
    supabaseAnonKey,
  };
};

/**
 * Create or update a user profile in the 'profiles' table.
 * Call this right after supabase.auth.signUp() succeeds.
 * 
 * Required Supabase SQL to create the profiles table:
 * 
 *   CREATE TABLE IF NOT EXISTS public.profiles (
 *     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *     username TEXT NOT NULL,
 *     full_name TEXT,
 *     phone TEXT,
 *     email TEXT NOT NULL,
 *     avatar_url TEXT,
 *     created_at TIMESTAMPTZ DEFAULT NOW(),
 *     updated_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 * 
 *   -- Enable Row Level Security
 *   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 * 
 *   -- Users can read their own profile
 *   CREATE POLICY "Users can view own profile"
 *     ON public.profiles FOR SELECT
 *     USING (auth.uid() = id);
 * 
 *   -- Users can update their own profile
 *   CREATE POLICY "Users can update own profile"
 *     ON public.profiles FOR UPDATE
 *     USING (auth.uid() = id);
 * 
 *   -- Users can insert their own profile
 *   CREATE POLICY "Users can insert own profile"
 *     ON public.profiles FOR INSERT
 *     WITH CHECK (auth.uid() = id);
 */
export const createProfile = async (userId, profileData) => {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: profileData.username,
      full_name: profileData.fullName || '',
      phone: profileData.phone,
      email: profileData.email,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  return { data, error };
};

/**
 * Fetch a user's profile from the 'profiles' table.
 */
export const getProfile = async (userId) => {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};
