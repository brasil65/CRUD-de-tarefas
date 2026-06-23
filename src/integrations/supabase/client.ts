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

/**
 * Verifica se a conexão com o Supabase está funcionando e se os grants
 * da tabela tasks estão corretos. Útil para diagnóstico de problemas de
 * Data API (PostgREST rejeitando requisições por falta de GRANT).
 *
 * @returns true se a conexão e grants estão OK, false caso contrário
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('[Supabase] Connection check failed:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Connection check exception:', err);
    return false;
  }
}