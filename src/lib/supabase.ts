import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

export const getAuthUser = (user: any): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || user.email?.split('@')[0] || 'User'
  };
};