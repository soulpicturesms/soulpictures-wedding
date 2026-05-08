'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Upload, Trash2, LogOut, Image as ImageIcon,
  CheckCircle, Loader2, X, AlertCircle, Images
} from 'lucide-react'

const SECTIONS = [
  { key: 'hero',      label: 'Hero',        desc: 'Foto principal de la página de inicio',    icon: '🏠' },
  { key: 'gallery',   label: 'Galería',      desc: 'Fotos destacadas en la sección de inicio', icon: '✨' },
  { key: 'portfolio', label: 'Portafolio',   desc: 'Grid de bodas en la página de portafolio', icon: '📸' },
  { key: 'about',     label: 'Sobre mí',     desc: 'Fotos de la sección "Sobre nosotros"',     icon: '👤' },
  { key: 'sessions',  label: 'Sesiones',     desc: 'Fotos de sesiones y propuestas',           icon: '💍' },
]

interface UploadResult {
  url: string
  name: string
  originalSize: number
  newSize: number
  saving: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('hero')
  const [photos, setPhotos] = useState<Record<string, string[]>>({})
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[] | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadPhotos = useCallback(async () => {
    setLoadingPhotos(true)
    try {
      const res = await fetch('/api/admin/photos')
      if (res.status === 401) { router.push('/admin/login'); return }
      setPhotos(await res.json())
    } finally {
      setLoadingPhotos(false)
    }
  }, [router])

  useEffect(() => { loadPhotos() }, [loadPhotos])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleFiles = (incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...valid])
    setUploadResults(null)
    setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index))

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    setError('')
    setUploadResults(null)

    const formData = new FormData()
    formData.append('section', activeSection)
    files.forEach(f => formData.append('files', f))

    const res = await fetch('/api/admin/upload-section', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al subir')
    } else {
      setUploadResults(data.results)
      setFiles([])
      if (fileRef.current) fileRef.current.value = ''
      await loadPhotos()
    }
    setUploading(false)
  }

  const handleDelete = async (url: string) => {
    if (!confirm('¿Eliminar esta foto?')) return
    setDeletingUrl(url)
    const res = await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) await loadPhotos()
    setDeletingUrl(null)
  }

  const currentPhotos = photos[activeSection] || []

  return (
    <div className="min-h-screen bg-neutral-950 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col leading-none">
            <span className="text-white text-lg font-light tracking-[0.3em] uppercase">Soul</span>
            <span className="text-[#C9A96E] text-lg font-semibold tracking-[0.3em] uppercase">Pictures</span>
          </div>
          <p className="text-white/30 text-xs tracking-widest mt-1">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {SECTIONS.map(sec => (
            <button
              key={sec.key}
              onClick={() => { setActiveSection(sec.key); setFiles([]); setUploadResults(null); setError('') }}
              className={`w-full text-left px-4 py-3 rounded-sm transition-colors flex items-center gap-3 ${
                activeSection === sec.key
                  ? 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{sec.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{sec.label}</p>
                <p className="text-xs text-white/30 truncate">{(photos[sec.key] || []).length} fotos</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-white/40 hover:text-white text-sm transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-neutral-900 border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-playfair text-xl">
              {SECTIONS.find(s => s.key === activeSection)?.icon}{' '}
              {SECTIONS.find(s => s.key === activeSection)?.label}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">
              {SECTIONS.find(s => s.key === activeSection)?.desc}
            </p>
          </div>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <Images size={14} />
            <span>{currentPhotos.length} foto{currentPhotos.length !== 1 ? 's' : ''}</span>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* Upload zone */}
          <div className="bg-neutral-900 border border-white/10 p-6">
            <h2 className="text-white text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
              <Upload size={14} className="text-[#C9A96E]" />
              Subir nuevas fotos
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-colors ${
                dragging ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-white/15 hover:border-[#C9A96E]/40'
              }`}
            >
              <Upload size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm mb-1">Arrastra fotos aquí o haz clic para seleccionar</p>
              <p className="text-white/25 text-xs">JPG, PNG, TIFF · Se convierten a WebP automáticamente</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={e => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Selected files */}
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-white/40 text-xs tracking-widest uppercase mb-3">
                  {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-neutral-800 px-3 py-2 text-xs">
                      <ImageIcon size={12} className="text-[#C9A96E]" />
                      <span className="text-white/70 max-w-[120px] truncate">{f.name}</span>
                      <span className="text-white/30">({formatBytes(f.size)})</span>
                      <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 ml-1">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-sm font-medium tracking-widest uppercase px-8 py-3 transition-colors flex items-center gap-2"
                >
                  {uploading
                    ? <><Loader2 size={14} className="animate-spin" /> Convirtiendo a WebP...</>
                    : <><Upload size={14} /> Subir {files.length} foto{files.length > 1 ? 's' : ''}</>
                  }
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Upload results */}
            {uploadResults && (
              <div className="mt-4 bg-neutral-800 border border-[#C9A96E]/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-[#C9A96E]" />
                  <span className="text-white text-sm">{uploadResults.length} foto{uploadResults.length > 1 ? 's' : ''} subida{uploadResults.length > 1 ? 's' : ''} exitosamente</span>
                </div>
                <div className="space-y-1">
                  {uploadResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/60 truncate max-w-xs">{r.name}</span>
                      <span className="text-[#C9A96E] ml-4 shrink-0">
                        {formatBytes(r.originalSize)} → {formatBytes(r.newSize)} ({r.saving}% menos)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current photos grid */}
          <div className="bg-neutral-900 border border-white/10 p-6">
            <h2 className="text-white text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
              <Images size={14} className="text-[#C9A96E]" />
              Fotos actuales — {SECTIONS.find(s => s.key === activeSection)?.label}
            </h2>

            {loadingPhotos ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-[#C9A96E]" />
              </div>
            ) : currentPhotos.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon size={32} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No hay fotos en esta sección</p>
                <p className="text-white/20 text-xs mt-1">Sube fotos usando el área de arriba</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {currentPhotos.map(url => (
                  <div key={url} className="group relative aspect-square bg-neutral-800 overflow-hidden">
                    <Image
                      src={url}
                      alt="Photo"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-xs text-center px-2 truncate w-full">{url.split('/').pop()}</p>
                      <button
                        onClick={() => handleDelete(url)}
                        disabled={deletingUrl === url}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-sm transition-colors"
                      >
                        {deletingUrl === url
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Trash2 size={12} />
                        }
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
