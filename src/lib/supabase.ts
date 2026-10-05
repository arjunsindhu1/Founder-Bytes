import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or localStorage override
const getEnvCredentials = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('fb_supabase_url') || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('fb_supabase_anon_key') || '';
  return { url: url.trim(), anonKey: anonKey.trim() };
};

let cachedClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getEnvCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (cachedClient && currentUrl === url && currentKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentUrl = url;
    currentKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getEnvCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function updateSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem('fb_supabase_url', url.trim());
  else localStorage.removeItem('fb_supabase_url');

  if (anonKey) localStorage.setItem('fb_supabase_anon_key', anonKey.trim());
  else localStorage.removeItem('fb_supabase_anon_key');

  cachedClient = null;
  currentUrl = '';
  currentKey = '';
}

export async function ensureAdminAuth(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      return true;
    }
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: 'admin@founderbytes.in',
      password: 'Admin@founderbytes123',
    });
    return !error && !!signInData.session;
  } catch (err) {
    console.warn('ensureAdminAuth warning:', err);
  }
  return false;
}

