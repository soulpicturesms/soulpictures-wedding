'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, CheckCircle, X } from 'lucide-react'

interface UploadResult {
  name: string
  size: number
  originalSize: number
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [weddingId, setWeddingId] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<UploadResult[] | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (secret.trim()) setAuthed(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setResults(null)
      setError('')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/')
    )
    setFiles(dropped)
    setResults(null)
  }

  const handleUpload = async () => {
    if (!files.length || !weddingId.trim()) {
      setError('Por favor ingresa el ID de la boda y selecciona imágenes.')
      return
    }

    setUploading(true)
    setError('')
    setResults(null)

    const formData = new FormData()
    formData.append('weddingId', weddingId.trim())
    files.forEach(f => formData.append('files', f))

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al subir imágenes')
      } else {
        setResults(data.results)
        setFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="bg-neutral-900 border border-white/10 p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex flex-col leading-none mb-4 items-center">
              <span className="text-white text-lg font-light tracking-[0.3em] uppercase">Soul</span>
              <span className="text-[#C9A96E] text-lg font-semibold tracking-[0.3em] uppercase">Pictures</span>
            </div>
            <p className="text-white/40 text-sm">Admin Panel</p>
          </div>
          <input
            type="password"
            placeholder="Admin password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="w-full bg-neutral-800 border border-white/10 text-white px-4 py-3 text-sm mb-4 outline-none focus:border-[#C9A96E]/50"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-widest uppercase py-3 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex gap-2 items-baseline mb-1">
              <span className="text-white text-lg font-light tracking-[0.3em] uppercase">Soul</span>
              <span className="text-[#C9A96E] text-lg font-semibold tracking-[0.3em] uppercase">Pictures</span>
            </div>
            <p className="text-white/40 text-xs tracking-widest">Admin Panel</p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-white/30 hover:text-white transition-colors text-xs tracking-wider uppercase"
          >
            Salir
          </button>
        </div>

        {/* Upload Card */}
        <div className="bg-neutral-900 border border-white/10 p-8">
          <h2 className="text-white font-playfair text-2xl mb-6">Subir Fotos de Boda</h2>

          <div className="mb-6">
            <label className="text-white/60 text-xs tracking-widest uppercase block mb-2">
              ID de la Boda (slug)
            </label>
            <input
              type="text"
              placeholder="emma-carlos-2024"
              value={weddingId}
              onChange={e => setWeddingId(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-[#C9A96E]/50"
            />
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-[#C9A96E]/50 rounded-sm p-12 text-center cursor-pointer transition-colors mb-6"
          >
            <Upload size={32} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60 mb-1">Arrastra imágenes aquí o haz clic para seleccionar</p>
            <p className="text-white/30 text-xs">JPG, PNG, TIFF — Se convertirán a WebP automáticamente</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mb-6">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-3">
                {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-neutral-800 px-3 py-2">
                    <ImageIcon size={14} className="text-[#C9A96E]" />
                    <span className="text-white/70 text-xs">{f.name}</span>
                    <span className="text-white/30 text-xs">({formatBytes(f.size)})</span>
                    <button
                      onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      className="text-white/30 hover:text-white ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !files.length}
            className="bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-medium tracking-widest uppercase px-8 py-4 transition-colors flex items-center gap-3"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Subiendo y convirtiendo a WebP...
              </>
            ) : (
              <>
                <Upload size={16} />
                Subir {files.length > 0 ? `${files.length} foto${files.length > 1 ? 's' : ''}` : 'fotos'}
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-neutral-900 border border-[#C9A96E]/30 p-8 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={20} className="text-[#C9A96E]" />
              <h3 className="text-white font-playfair text-xl">
                {results.length} foto{results.length > 1 ? 's' : ''} subida{results.length > 1 ? 's' : ''} exitosamente
              </h3>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => {
                const saving = Math.round((1 - r.size / r.originalSize) * 100)
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{r.name}</span>
                    <span className="text-[#C9A96E] text-xs">
                      {formatBytes(r.originalSize)} → {formatBytes(r.size)} ({saving}% menos)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
