-- Add explicit Data API grants to tasks table
-- Without these grants, PostgREST rejects all requests even with RLS policies

-- Grant CRUD to authenticated role (Supabase JS client via anon key)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

-- Grant full access to service_role (server-side operations)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;

-- NOTE: No grant to anon role — tasks require authentication