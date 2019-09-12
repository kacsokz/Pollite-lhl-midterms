-- Drop and recreate Choices table

DROP TABLE IF EXISTS choices CASCADE;

CREATE TABLE choices (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT
);
