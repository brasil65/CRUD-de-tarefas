# Correção do Banco de Dados

## 1. Colunas Faltantes (PGRST204)

Execute o código abaixo no SQL Editor do Supabase para adicionar as colunas faltantes:

```sql
-- Adiciona colunas de Categoria e Prioridade
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'personal',
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Permite que a tarefa seja criada sem um user_id obrigatório (opcional)
ALTER TABLE tasks 
ALTER COLUMN user_id DROP NOT NULL;
```

## 2. Grants Faltantes (Data API Access) — CRÍTICO

O tabela `tasks` tem RLS habilitado com políticas por usuário, mas **não tem grants explícitos para a role `authenticated`**. Sem isso, o PostgREST (API do Supabase) rejeita todas as requisições à tabela — mesmo com as políticas RLS corretas.

Execute no SQL Editor do Supabase:

```sql
-- Grant CRUD para role authenticated (cliente Supabase JS via anon key)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

-- Grant total para service_role (operações server-side)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;

-- IMPORTANTÍSSIMO: NÃO conceder grant à role anon
-- Tarefas exigem autenticação. Grant a anon exporia dados de todos os usuários.
```

### Verificação

Após executar, confirme que os grants foram aplicados:

```sql
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'tasks'
ORDER BY grantee, privilege_type;
```

O resultado deve mostrar `authenticated` e `service_role` com `SELECT`, `INSERT`, `UPDATE`, `DELETE`. **Não deve aparecer `anon`.**