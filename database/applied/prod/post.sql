-- Script for creating post table in postgres table
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);
