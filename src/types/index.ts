export interface Wedding {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  wedding_date: string
  venue: string
  location: string
  category: 'beach' | 'resort' | 'church' | 'garden'
  cover_image_url: string
  featured: boolean
  published: boolean
  created_at: string
}

export interface Photo {
  id: string
  wedding_id: string
  url: string
  thumbnail_url: string
  alt_text: string
  order_index: number
  width: number
  height: number
  created_at: string
}

export interface Testimonial {
  id: string
  couple_name: string
  wedding_date: string
  venue: string
  text: string
  rating: number
  photo_url?: string
  published: boolean
}

export interface BlogPost {
  id: string
  slug: string
  title_en: string
  title_es: string
  excerpt_en: string
  excerpt_es: string
  content_en: string
  content_es: string
  cover_image_url: string
  published: boolean
  published_at: string
  created_at: string
}

export interface Service {
  id: string
  name_en: string
  name_es: string
  description_en: string
  description_es: string
  features_en: string[]
  features_es: string[]
  price_usd?: number
  highlighted: boolean
  order_index: number
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  wedding_date?: string
  venue?: string
  message: string
  status: 'new' | 'contacted' | 'booked' | 'closed'
  created_at: string
}
