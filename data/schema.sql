DROP TABLE IF EXISTS games;

CREATE TABLE games(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255),
  game_rating INTEGER,
  deal_rating NUMERIC(2,3),
  store_id INTEGER,
  normal_price VARCHAR(255),
  sale_price VARCHAR(255),
);

CREATE TABLE popular_titles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255),
)