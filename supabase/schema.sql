-- ============================================================
-- Soul Pictures MS — Supabase Schema (con DROP para recrear)
-- ============================================================

-- Eliminar tablas existentes (sin datos, es seguro)
DROP TABLE IF EXISTS section_photos CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS weddings CASCADE;

-- Recrear tablas
CREATE TABLE weddings (
  id          TEXT PRIMARY KEY,
  couple_name TEXT NOT NULL,
  year        TEXT DEFAULT '',
  venue       TEXT DEFAULT '',
  visible     BOOLEAN DEFAULT true,
  cover       TEXT DEFAULT '',
  photos      TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
  id        TEXT PRIMARY KEY,
  couple    TEXT NOT NULL,
  venue     TEXT DEFAULT '',
  text      TEXT NOT NULL,
  rating    INT DEFAULT 5,
  photo_url TEXT DEFAULT '',
  visible   BOOLEAN DEFAULT true
);

CREATE TABLE packages (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  name_es     TEXT NOT NULL DEFAULT '',
  tagline     TEXT DEFAULT '',
  tagline_es  TEXT DEFAULT '',
  price       TEXT DEFAULT '',
  features    TEXT[] DEFAULT '{}',
  features_es TEXT[] DEFAULT '{}',
  visible     BOOLEAN DEFAULT true,
  highlighted BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0
);

CREATE TABLE blog_posts (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  title_es     TEXT DEFAULT '',
  excerpt      TEXT DEFAULT '',
  excerpt_es   TEXT DEFAULT '',
  content      TEXT DEFAULT '',
  content_es   TEXT DEFAULT '',
  cover_image  TEXT DEFAULT '',
  tags         TEXT[] DEFAULT '{}',
  published    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE inquiries (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT NOT NULL,
  email        TEXT DEFAULT '',
  phone        TEXT DEFAULT '',
  wedding_date TEXT DEFAULT '',
  venue        TEXT DEFAULT '',
  message      TEXT DEFAULT '',
  package      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  read         BOOLEAN DEFAULT false
);

CREATE TABLE section_photos (
  id         BIGSERIAL PRIMARY KEY,
  section    TEXT NOT NULL,
  url        TEXT NOT NULL,
  filename   TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE weddings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_photos ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "public_read_weddings"
  ON weddings FOR SELECT USING (visible = true);
CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT USING (visible = true);
CREATE POLICY "public_read_packages"
  ON packages FOR SELECT USING (visible = true);
CREATE POLICY "public_read_blog_posts"
  ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "public_read_section_photos"
  ON section_photos FOR SELECT USING (true);
