-- Drop and recreate Polls table

DROP TABLE IF EXISTS polls CASCADE;

CREATE TABLE polls (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL,
  question VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW()
);
