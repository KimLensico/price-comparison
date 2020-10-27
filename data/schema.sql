DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS popular_titles;
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255)
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255),
  game_rating INTEGER,
  deal_rating VARCHAR(255),
  store_id INTEGER REFERENCES stores(id),
  normal_price VARCHAR(255),
  sale_price VARCHAR(255)
);

CREATE TABLE popular_titles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  thumbnail VARCHAR(255)
);
