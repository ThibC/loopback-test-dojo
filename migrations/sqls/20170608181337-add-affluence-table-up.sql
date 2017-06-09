CREATE TABLE affluence (
  id SERIAL PRIMARY KEY,
  value DECIMAL NOT NULL,
  day DATE,
  movie_theater_id INTEGER REFERENCES movietheater(id)
);
