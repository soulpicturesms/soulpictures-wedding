-- =====================================================
-- SOUL PICTURES - Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- WEDDINGS
create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  bride_name text not null,
  groom_name text not null,
  wedding_date date,
  venue text,
  location text default 'Punta Cana, Dominican Republic',
  category text check (category in ('beach', 'resort', 'church', 'garden')) default 'resort',
  cover_image_url text,
  featured boolean default false,
  published boolean default false,
  created_at timestamptz default now()
);

-- PHOTOS
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  alt_text text default '',
  order_index integer default 0,
  width integer default 0,
  height integer default 0,
  created_at timestamptz default now()
);

-- TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  couple_name text not null,
  wedding_date text,
  venue text,
  text text not null,
  rating integer default 5 check (rating between 1 and 5),
  photo_url text,
  published boolean default true,
  created_at timestamptz default now()
);

-- BLOG POSTS
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_es text not null,
  excerpt_en text,
  excerpt_es text,
  content_en text,
  content_es text,
  cover_image_url text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_es text not null,
  description_en text,
  description_es text,
  features_en text[] default '{}',
  features_es text[] default '{}',
  price_usd integer,
  highlighted boolean default false,
  order_index integer default 0
);

-- INQUIRIES (contact form)
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  wedding_date date,
  venue text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'booked', 'closed')),
  created_at timestamptz default now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table weddings enable row level security;
alter table photos enable row level security;
alter table testimonials enable row level security;
alter table blog_posts enable row level security;
alter table services enable row level security;
alter table inquiries enable row level security;

-- PUBLIC: can read published content
create policy "Public can read published weddings"
  on weddings for select using (published = true);

create policy "Public can read photos of published weddings"
  on photos for select using (
    exists (select 1 from weddings w where w.id = photos.wedding_id and w.published = true)
  );

create policy "Public can read published testimonials"
  on testimonials for select using (published = true);

create policy "Public can read published blog posts"
  on blog_posts for select using (published = true);

create policy "Public can read services"
  on services for select using (true);

-- PUBLIC: can submit inquiries
create policy "Anyone can submit inquiry"
  on inquiries for insert with check (true);

-- SERVICE ROLE: full access (used by admin API)
create policy "Service role full access weddings"
  on weddings for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Service role full access photos"
  on photos for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Service role full access testimonials"
  on testimonials for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Service role full access blog"
  on blog_posts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Service role full access services"
  on services for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Service role full access inquiries"
  on inquiries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- =====================================================
-- STORAGE BUCKET
-- =====================================================

insert into storage.buckets (id, name, public)
values ('weddings', 'weddings', true)
on conflict do nothing;

create policy "Public read wedding images"
  on storage.objects for select
  using (bucket_id = 'weddings');

create policy "Service role upload wedding images"
  on storage.objects for insert
  with check (auth.role() = 'service_role');

create policy "Service role delete wedding images"
  on storage.objects for delete
  using (auth.role() = 'service_role');

-- =====================================================
-- SAMPLE DATA (optional - delete if not needed)
-- =====================================================

insert into testimonials (couple_name, wedding_date, venue, text, rating) values
  ('Sarah & Daniel', '2024-03-15', 'Hard Rock Hotel & Casino Punta Cana', 'Marcos and his team were absolutely incredible. Every single photo captured the emotion of our day perfectly. We cannot recommend Soul Pictures enough!', 5),
  ('María & Alejandro', '2024-05-20', 'Excellence Punta Cana', 'Usamos Soul Pictures para nuestra boda destino y quedamos sin palabras. Las fotos son mágicas, profesionales y llenas de amor. ¡Gracias infinitas!', 5),
  ('Emma & Thomas', '2023-11-10', 'Secrets Royal Beach', 'From our first consultation to the final gallery delivery, everything was flawless. The photos tell our story better than we ever could ourselves.', 5);

insert into services (name_en, name_es, description_en, description_es, features_en, features_es, highlighted, order_index) values
  ('Essential', 'Esencial', 'Perfect for intimate ceremonies', 'Perfecto para ceremonias íntimas',
   ARRAY['6 hours coverage', '500+ edited photos', 'Online gallery', 'WebP high-res download'],
   ARRAY['6 horas de cobertura', '500+ fotos editadas', 'Galería en línea', 'Descarga en alta resolución WebP'],
   false, 1),
  ('Signature', 'Signature', 'Our most popular package', 'Nuestro paquete más popular',
   ARRAY['10 hours coverage', '900+ edited photos', 'Engagement session', 'Online gallery', 'Printed album', 'Same-day preview'],
   ARRAY['10 horas de cobertura', '900+ fotos editadas', 'Sesión de compromiso', 'Galería en línea', 'Álbum impreso', 'Preview el mismo día'],
   true, 2),
  ('Luxury', 'Luxury', 'The complete experience', 'La experiencia completa',
   ARRAY['Full day coverage', '1500+ edited photos', 'Engagement session', 'Drone coverage', 'Premium album', 'Behind the scenes video', 'Priority editing'],
   ARRAY['Cobertura día completo', '1500+ fotos editadas', 'Sesión de compromiso', 'Cobertura con dron', 'Álbum premium', 'Video behind the scenes', 'Edición prioritaria'],
   false, 3);
