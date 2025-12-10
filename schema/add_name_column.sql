-- Migration: Add missing 'name' column to pastes table
-- This adds support for paste names if they don't already exist

-- Check and add 'name' column if it doesn't exist
-- Note: SQLite doesn't have IF NOT EXISTS for ALTER TABLE, so we use a try-catch approach in D1

ALTER TABLE pastes ADD COLUMN name TEXT;
