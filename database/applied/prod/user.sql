-- Script for creating user table in postgres table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    did TEXT NOT NULL,
    email TEXT,
    handle TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

-- Create the trigger that calls the above function before any UPDATE
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
