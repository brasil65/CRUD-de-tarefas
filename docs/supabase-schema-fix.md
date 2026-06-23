# Fixing PGRST204 Error: Missing 'category' Column

## Problem
The Supabase client throws a PGRST204 error: "Could not find the 'category' column of 'tasks' in the schema cache" when trying to create tasks.

This happens because:
1. The frontend code expects `category` and `priority` columns in the `tasks` table
2. These columns are missing from the database schema
3. The Supabase client's schema cache hasn't been updated

## Solution

See **[docs/fix-database.md](./fix-database.md)** for the complete, up-to-date fix instructions including:
- Adding missing `category` and `priority` columns
- Fixing missing Data API grants (critical for PostgREST access)

## Verification
Check that the columns exist in your Supabase Dashboard:
1. Go to Database → Tables → tasks
2. Verify `category` and `priority` columns are present
3. Try creating a task again - the error should be resolved