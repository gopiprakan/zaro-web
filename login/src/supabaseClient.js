import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase Project Credentials
// (The base URL is automatically normalized if '/rest/v1/' is attached)
const SUPABASE_URL = "https://gelhmybrvpvvpmisgatz.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_cr6APOHuX3dyr8k7HyQTtA_i2NR93WP";

// Normalize URL to base domain in case REST endpoint path was provided
const sanitizedUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');

// Create and export Supabase client instance
export const supabase = createClient(sanitizedUrl, SUPABASE_PUBLIC_KEY);

/**
 * Protect private pages with supabase.auth.getSession()
 * If no active session exists, redirects user to the login page.
 * @param {string} [loginUrl='/login'] - Redirect destination when unauthenticated
 * @returns {Promise<import('@supabase/supabase-js').Session|null>}
 */
export async function protectPage(loginUrl = '/login') {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.href = loginUrl;
    return null;
  }
  return session;
}

// Attach to window object for convenient browser console/vanilla JS access
if (typeof window !== 'undefined') {
  window.supabase = supabase;
  window.protectPage = protectPage;
}

export default supabase;
