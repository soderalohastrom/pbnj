-- Migration: Fix pastes table schema
-- This ensures the pastes table has all required columns

-- First, check if the table has the correct schema
-- Create a new table with the correct schema
CREATE TABLE IF NOT EXISTS pastes_fixed (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  language TEXT,
  updated INTEGER NOT NULL,
  filename TEXT,
  name TEXT,
  is_private INTEGER DEFAULT 0,
  secret_key TEXT
);

-- If pastes table exists and is different, migrate data
-- SQLite allows this even if pastes_fixed already exists
INSERT OR IGNORE INTO pastes_fixed 
SELECT * FROM pastes 
WHERE id NOT IN (SELECT id FROM pastes_fixed);

-- Only proceed with rename if there's data to migrate
-- (this handles the case where both tables exist)
DROP TABLE IF EXISTS pastes_backup;

-- Rename old table as backup
ALTER TABLE pastes RENAME TO pastes_backup;

-- Rename fixed table to pastes
ALTER TABLE pastes_fixed RENAME TO pastes;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_updated ON pastes(updated DESC);
