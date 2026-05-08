import { SessionOptions } from 'iron-session'

export interface SessionData {
  isLoggedIn: boolean
  username: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET || 'soul-pictures-fallback-secret-32ch',
  cookieName: 'sp_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  },
}
