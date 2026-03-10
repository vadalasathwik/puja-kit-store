-- Puja Kit Store — PostgreSQL Schema
-- Run this file once against your database to set up all tables:
--   psql -U postgres -d puja_kit_store -f lib/schema.sql

-- ─── Customers ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS customers (
  id         SERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  email      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id          TEXT        PRIMARY KEY,          -- slug, e.g. "ganesh-puja-kit"
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  price       NUMERIC(10,2) NOT NULL,
  description TEXT,
  image       TEXT,
  category    TEXT,
  badge       TEXT,
  items       TEXT[]      NOT NULL DEFAULT '{}'  -- array of kit items
);

-- ─── Orders ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL      PRIMARY KEY,
  customer_id INTEGER     NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  TEXT        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER     NOT NULL DEFAULT 1,
  status      TEXT        NOT NULL DEFAULT 'pending',   -- pending | confirmed | delivered
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Seed Products (mirrors data/products.ts) ────────────────────────────────

INSERT INTO products (id, name, slug, price, description, image, category, badge, items)
VALUES
  (
    'ganesh-puja-kit',
    'Ganesh Puja Kit',
    'ganesh-puja-kit',
    499,
    'A complete and sacred Ganesh Puja Kit thoughtfully assembled for Vinayaka Chaturthi, Sankashti Chaturthi, or any auspicious occasion where you seek the blessings of Lord Ganesha.',
    '/images/ganesh-puja-kit.jpg',
    'Festival',
    'Bestseller',
    ARRAY[
      'Ganesh Idol (Clay / Eco-friendly)', 'Modak (Prasad)', 'Durva Grass',
      'Red Flowers & Garland', 'Roli, Kumkum & Haldi', 'Incense Sticks (Agarbatti)',
      'Camphor (Kapoor)', 'Coconut', 'Betel Leaves & Nuts', 'Puja Thali',
      'Deepak (Oil Lamp)', 'Cotton Wicks'
    ]
  ),
  (
    'satyanarayana-puja-kit',
    'Satyanarayana Puja Kit',
    'satyanarayana-puja-kit',
    799,
    'Perform the sacred Satyanarayana Vrat Puja with ease using our all-inclusive kit. Ideal for birthdays, housewarmings, anniversaries, or fulfilling a vow.',
    '/images/satyanarayana-puja-kit.jpg',
    'Vrat Puja',
    'Popular',
    ARRAY[
      'Satyanarayana Idol / Photo', 'Panchamrit Ingredients (Milk, Curd, Honey, Ghee, Sugar)',
      'Banana Leaves', 'Sheera Prasad Mix', 'Tulsi Leaves', 'Yellow Flowers & Garland',
      'Roli, Kumkum & Chandan', 'Incense Sticks & Dhoop', 'Camphor',
      'Coconut & Fruits', 'Betel Leaves, Nuts & Coins', 'Sacred Thread (Kalava)',
      'Puja Thali with Deepak', 'Cotton Wicks & Oil'
    ]
  ),
  (
    'gruhapravesam-puja-kit',
    'Gruhapravesam Puja Kit',
    'gruhapravesam-puja-kit',
    1299,
    'Bless your new home with positivity, prosperity, and divine protection. Our Gruhapravesam Puja Kit covers every ritual needed for a traditional housewarming ceremony.',
    '/images/gruhapravesam-puja-kit.jpg',
    'Ceremony',
    'Premium',
    ARRAY[
      'Kalash (Copper Pot) with Coconut', 'Mango Leaves for Toran',
      'Turmeric Paste & Kumkum', 'Navadhanyas (Nine Sacred Grains)',
      'Sacred Thread & Coins', 'Incense Sticks, Camphor & Dhoop',
      'Pancha Diya (5 Deepaks)', 'Cotton Wicks & Pure Ghee',
      'Betel Leaves, Areca Nuts', 'Flowers, Garland & Petals',
      'Puja Thali with all accessories', 'Hawan Samagri',
      'Coconut & Fruits', 'Red & Yellow Cloth'
    ]
  ),
  (
    'daily-puja-kit',
    'Daily Puja Kit',
    'daily-puja-kit',
    299,
    'Maintain your daily spiritual practice with our compact and convenient Daily Puja Kit. Designed for everyday worship at your home temple (pooja ghar).',
    '/images/daily-puja-kit.jpg',
    'Daily',
    'Value Pack',
    ARRAY[
      'Incense Sticks (30 sticks / 3 varieties)', 'Camphor Tablets',
      'Sandalwood Paste (Chandan)', 'Kumkum & Haldi Powder',
      'Cotton Wicks (100 pieces)', 'Pure Coconut Oil (small bottle)',
      'Tulsi & Flower Petals (dried)', 'Puja Bell', 'Small Deepak',
      'Sacred Ash (Vibhuti)'
    ]
  )
ON CONFLICT (id) DO NOTHING;
