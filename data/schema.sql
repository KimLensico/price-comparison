DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS popular_titles;

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255),
  game_rating INTEGER,
  deal_rating DECIMAL(3,2),
  store_id INTEGER,
  normal_price VARCHAR(255),
  sale_price VARCHAR(255)
);

CREATE TABLE popular_titles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255)
);
