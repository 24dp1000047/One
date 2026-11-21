import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    typeof supabaseKey === 'string' &&
    supabaseKey.length > 20 &&
    !supabaseUrl.includes('your-project')
  );
}

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ [Database] Supabase PostgreSQL client initialized.');
  } catch (err: any) {
    console.error('❌ [Database] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ [Database] Supabase URL or Key not configured in .env. Persistence is running in local mode.');
}

export { supabase };
