import { createClient } from '@supabase/supabase-js';

// Obtém as credenciais das variáveis de ambiente com o prefixo VITE_
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("As chaves do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) não estão configuradas no arquivo .env");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);