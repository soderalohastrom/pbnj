-- Migration: Rename 'created' to 'updated'
-- SQLite doesn't support ALTER TABLE RENAME COLUMN in older versions,
-- so we recreate the table

-- Create new table with updated column name and all current columns
CREATE TABLE pastes_new (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  language TEXT,
  updated INTEGER NOT NULL,
  filename TEXT,
  name TEXT,
  is_private INTEGER DEFAULT 0,
  secret_key TEXT
);

-- Copy data from old table (handling both old and new schemas)
INSERT INTO pastes_new (id, code, language, updated, filename, name, is_private, secret_key)
SELECT
  id,
  code,
  language,
  COALESCE(updated, created, 0) as updated,
  filename,
  name,
  COALESCE(is_private, 0),
  secret_key
FROM pastes;

-- Drop old table
DROP TABLE pastes;

-- Rename new table
ALTER TABLE pastes_new RENAME TO pastes;

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_updated ON pastes(updated DESC);
