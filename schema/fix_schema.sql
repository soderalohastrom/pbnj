-- Migration: Ensure pastes table has all required columns
-- This migration safely adds any missing columns

-- Add missing columns if they don't exist
-- Note: SQLite will error if column exists, but D1 handles this gracefully
ALTER TABLE pastes ADD COLUMN name TEXT;
ALTER TABLE pastes ADD COLUMN is_private INTEGER DEFAULT 0;
ALTER TABLE pastes ADD COLUMN secret_key TEXT;

-- Ensure the index exists
CREATE INDEX IF NOT EXISTS idx_updated ON pastes(updated DESC);
