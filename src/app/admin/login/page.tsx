'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center leading-none mb-3">
            <span className="text-white text-2xl font-light tracking-[0.4em] uppercase">Soul</span>
            <span className="text-[#C9A96E] text-2xl font-semibold tracking-[0.4em] uppercase">Pictures</span>
          </div>
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mt-2">Panel de Control</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-white/10 p-8">
          <h1 className="text-white font-playfair text-xl mb-6 text-center">Iniciar Sesión</h1>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="marcos"
                required
                autoFocus
                className="w-full bg-neutral-800 border border-white/10 focus:border-[#C9A96E]/60 text-white px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-neutral-800 border border-white/10 focus:border-[#C9A96E]/60 text-white px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-sm font-medium tracking-[0.2em] uppercase py-3.5 transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
