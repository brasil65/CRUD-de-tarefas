import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as chaves estão devidamente configuradas no ambiente
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Usamos chaves de placeholder na inicialização para evitar que o Vite lance erro fatal de compilação/build,
// permitindo que o React renderize a tela de instrução ConfigMissing.
const supabaseUrl = SUPABASE_URL || "https://placeholder-build-url.supabase.co";
const supabaseAnonKey = SUPABASE_ANON_KEY || "placeholder-build-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);