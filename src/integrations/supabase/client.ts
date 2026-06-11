import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente reais estão presentes
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Se estiver configurado, cria o cliente real.
// Se não, criamos um Proxy seguro que evita erros fatais de inicialização (tela em branco),
// permitindo que o React renderize a tela amigável explicativa sem quebrar no carregamento.
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : new Proxy({} as any, {
      get() {
        return () => {
          throw new Error("Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
        };
      }
    });