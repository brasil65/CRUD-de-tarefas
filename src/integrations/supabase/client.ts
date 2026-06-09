import { createClient } from '@supabase/supabase-js';

// Obtém as credenciais das variáveis de ambiente com o prefixo VITE_
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Inicializa o cliente do Supabase de forma resiliente.
// Se as chaves estiverem ausentes, o app carrega normalmente em vez de dar tela em branco,
// permitindo debugar com facilidade ou mostrar erros amigáveis.
const supabaseUrl = SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);