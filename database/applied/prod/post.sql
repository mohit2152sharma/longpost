-- Script for creating post table in postgres table
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL,
    created_by UUID NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

ALTER TABLE posts ADD COLUMN updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') NOT NULL;

-- Create the trigger that calls the above function before any UPDATE
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
