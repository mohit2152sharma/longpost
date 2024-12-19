-- Script for creating user table in postgres table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    did TEXT NOT NULL,
    email TEXT,
    handle TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create a trigger function to automatically update the `updated_at` column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that calls the above function before any UPDATE
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
