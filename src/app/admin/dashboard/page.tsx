'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Upload, Trash2, LogOut, Image as ImageIcon,
  CheckCircle, Loader2, X, AlertCircle, Images,
  Eye, EyeOff, Plus, Edit2, Save, MessageSquare, BookOpen
} from 'lucide-react'

const PHOTO_SECTION_KEYS = ['hero', 'gallery', 'portfolio', 'about', 'sessions', 'cta']

const MENU_ITEMS = [
  { key: 'hero',         label: 'Hero',        desc: 'Fotos del slideshow principal',             icon: '🏠' },
  { key: 'gallery',      label: 'Galería',      desc: 'Fotos de "Recent Love Stories"',            icon: '✨' },
  { key: 'portfolio',    label: 'Portafolio',   desc: 'Fotos del grid de portafolio',              icon: '📸' },
  { key: 'about',        label: 'Sobre mí',     desc: 'Fotos de la sección "Sobre nosotros"',      icon: '👤' },
  { key: 'sessions',     label: 'Sesiones',     desc: 'Fotos de sesiones y propuestas',            icon: '💍' },
  { key: 'cta',          label: 'CTA',          desc: 'Foto de fondo de "Ready to Begin"',         icon: '💫' },
  { key: 'testimonials', label: 'Testimonios',  desc: 'Reseñas y fotos de clientes',               icon: '💬' },
  { key: 'weddings',     label: 'Bodas',        desc: 'Gestionar parejas del portafolio',          icon: '💒' },
  { key: 'packages',     label: 'Paquetes',     desc: 'Paquetes de servicios y precios',           icon: '📦' },
  { key: 'inquiries',    label: 'Consultas',    desc: 'Mensajes y solicitudes recibidas',          icon: '📩' },
  { key: 'blog',         label: 'Blog',         desc: 'Posts y generador de contenido con IA',     icon: '✍️' },
]

interface UploadResult { url: string; name: string; originalSize: number; newSize: number; saving: number }
interface Testimonial { id: string; couple: string; venue: string; text: string; rating: number; photoUrl: string; visible: boolean }
interface Wedding { id: string; coupleName: string; year: string; venue: string; visible: boolean; cover: string; photos: string[] }
interface Package { id: string; name: string; nameEs: string; tagline: string; taglineEs: string; price: string; features: string[]; featuresEs: string[]; visible: boolean; highlighted: boolean }
interface Inquiry { id: string; type: string; name: string; email: string; phone: string; eventDate: string; eventLocation: string; message: string; package?: string; createdAt: string }
interface BlogPost { id: string; slug: string; title: string; titleEs: string; excerpt: string; excerptEs: string; content: string; contentEs: string; coverImage: string; tags: string[]; published: boolean; createdAt: string; publishedAt: string }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ─── Photo Upload Section ──────────────────────────────────────────────────
function PhotoSection({
  sectionKey,
  photos,
  loadingPhotos,
  onRefresh,
}: {
  sectionKey: string
  photos: string[]
  loadingPhotos: boolean
  onRefresh: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[] | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | File[]) => {
    setFiles(prev => [...prev, ...Array.from(incoming).filter(f => f.type.startsWith('image/'))])
    setUploadResults(null)
    setError('')
  }

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    setError('')
    setUploadResults(null)
    const formData = new FormData()
    formData.append('section', sectionKey)
    files.forEach(f => formData.append('files', f))
    const res = await fetch('/api/admin/upload-section', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Error al subir')
    } else {
      setUploadResults(data.results)
      setFiles([])
      if (fileRef.current) fileRef.current.value = ''
      onRefresh()
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
    if (res.ok) onRefresh()
    setDeletingUrl(null)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Upload zone */}
      <div className="bg-neutral-900 border border-white/10 p-6">
        <h2 className="text-white text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
          <Upload size={14} className="text-[#C9A96E]" />
          Subir nuevas fotos
        </h2>
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
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
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />
        </div>

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
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400 ml-1">
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

        {error && <div className="mt-4 flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={14} /> {error}</div>}

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
                  <span className="text-[#C9A96E] ml-4 shrink-0">{formatBytes(r.originalSize)} → {formatBytes(r.newSize)} ({r.saving}% menos)</span>
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
          Fotos actuales — {MENU_ITEMS.find(s => s.key === sectionKey)?.label}
        </h2>
        {loadingPhotos ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#C9A96E]" /></div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon size={32} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No hay fotos en esta sección</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {photos.map(url => (
              <div key={url} className="group relative aspect-square bg-neutral-800 overflow-hidden">
                <Image src={url} alt="Photo" fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs text-center px-2 truncate w-full">{url.split('/').pop()}</p>
                  <button
                    onClick={() => handleDelete(url)}
                    disabled={deletingUrl === url}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-sm transition-colors"
                  >
                    {deletingUrl === url ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Testimonials Section ──────────────────────────────────────────────────
function TestimonialsManager() {
  const [list, setList] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Testimonial>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newT, setNewT] = useState<Omit<Testimonial, 'id'>>({ couple: '', venue: '', text: '', rating: 5, photoUrl: '', visible: true })
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const newPhotoRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    if (res.ok) setList(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const uploadPhoto = async (file: File, onDone: (url: string) => void) => {
    const formData = new FormData()
    formData.append('section', 'testimonials')
    formData.append('files', file)
    const res = await fetch('/api/admin/upload-section', { method: 'POST', body: formData })
    const data = await res.json()
    if (res.ok && data.results?.[0]?.url) onDone(data.results[0].url)
  }

  const startEdit = (t: Testimonial) => {
    setEditId(t.id)
    setEditData({ ...t })
  }

  const saveEdit = async () => {
    if (!editId) return
    setSaving(true)
    const updated = list.map(t => t.id === editId ? { ...t, ...editData } : t)
    await fetch('/api/admin/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setList(updated)
    setEditId(null)
    setSaving(false)
  }

  const toggleVisible = async (id: string) => {
    const updated = list.map(t => t.id === id ? { ...t, visible: !t.visible } : t)
    await fetch('/api/admin/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setList(updated)
  }

  const deleteT = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setList(list.filter(t => t.id !== id))
  }

  const addNew = async () => {
    setSaving(true)
    await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newT),
    })
    setNewT({ couple: '', venue: '', text: '', rating: 5, photoUrl: '', visible: true })
    setShowAdd(false)
    await load()
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-[#C9A96E]" /></div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-sm tracking-widest uppercase flex items-center gap-2">
          <MessageSquare size={14} className="text-[#C9A96E]" />
          Testimonios ({list.length})
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] text-black text-xs font-medium tracking-widest uppercase px-4 py-2 transition-colors"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      {/* Add new form */}
      {showAdd && (
        <div className="bg-neutral-900 border border-[#C9A96E]/30 p-6 space-y-4">
          <p className="text-[#C9A96E] text-xs tracking-widest uppercase">Nuevo Testimonio</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Pareja</label>
              <input value={newT.couple} onChange={e => setNewT({ ...newT, couple: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Venue</label>
              <input value={newT.venue} onChange={e => setNewT({ ...newT, venue: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Texto</label>
            <textarea value={newT.text} onChange={e => setNewT({ ...newT, text: e.target.value })} rows={3}
              className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Foto URL (o sube abajo)</label>
              <input value={newT.photoUrl} onChange={e => setNewT({ ...newT, photoUrl: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Subir foto</label>
              <input ref={newPhotoRef} type="file" accept="image/*" className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadingPhoto('new')
                  await uploadPhoto(file, url => setNewT(prev => ({ ...prev, photoUrl: url })))
                  setUploadingPhoto(null)
                }} />
              <button onClick={() => newPhotoRef.current?.click()}
                disabled={uploadingPhoto === 'new'}
                className="flex items-center gap-2 border border-white/20 hover:border-[#C9A96E]/50 text-white/50 hover:text-white text-xs px-3 py-2 transition-colors disabled:opacity-50">
                {uploadingPhoto === 'new' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                Seleccionar foto
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setNewT({ ...newT, rating: n })}
                  className={`text-xl transition-colors ${n <= newT.rating ? 'text-[#C9A96E]' : 'text-white/20'}`}>★</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addNew} disabled={saving || !newT.couple || !newT.text}
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-6 py-2.5 transition-colors">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
            </button>
            <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white text-xs px-4 py-2.5 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Testimonials list */}
      <div className="space-y-4">
        {list.map(t => (
          <div key={t.id} className={`bg-neutral-900 border p-5 transition-colors ${t.visible ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
            {editId === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Pareja</label>
                    <input value={editData.couple ?? ''} onChange={e => setEditData({ ...editData, couple: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Venue</label>
                    <input value={editData.venue ?? ''} onChange={e => setEditData({ ...editData, venue: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Texto</label>
                  <textarea value={editData.text ?? ''} onChange={e => setEditData({ ...editData, text: e.target.value })} rows={3}
                    className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Foto URL</label>
                    <input value={editData.photoUrl ?? ''} onChange={e => setEditData({ ...editData, photoUrl: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Subir foto</label>
                    <input ref={photoRef} type="file" accept="image/*" className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingPhoto(t.id)
                        await uploadPhoto(file, url => setEditData(prev => ({ ...prev, photoUrl: url })))
                        setUploadingPhoto(null)
                      }} />
                    <button onClick={() => photoRef.current?.click()}
                      disabled={uploadingPhoto === t.id}
                      className="flex items-center gap-2 border border-white/20 hover:border-[#C9A96E]/50 text-white/50 hover:text-white text-xs px-3 py-2 transition-colors disabled:opacity-50">
                      {uploadingPhoto === t.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      Cambiar foto
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setEditData({ ...editData, rating: n })}
                        className={`text-xl transition-colors ${n <= (editData.rating ?? 5) ? 'text-[#C9A96E]' : 'text-white/20'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} disabled={saving}
                    className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-5 py-2 transition-colors">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
                  </button>
                  <button onClick={() => setEditId(null)} className="text-white/40 hover:text-white text-xs px-4 py-2 transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {/* Photo thumbnail */}
                <div className="relative w-20 h-20 shrink-0 bg-neutral-800 overflow-hidden">
                  {t.photoUrl ? (
                    <Image src={t.photoUrl} alt={t.couple} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-neutral-600" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-playfair">{t.couple}</p>
                      <p className="text-[#C9A96E] text-xs tracking-wider mt-0.5">{t.venue}</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="text-[#C9A96E] text-xs">★</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleVisible(t.id)} title={t.visible ? 'Ocultar' : 'Mostrar'}
                        className="p-1.5 text-white/30 hover:text-white transition-colors">
                        {t.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button onClick={() => startEdit(t)}
                        className="p-1.5 text-white/30 hover:text-[#C9A96E] transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteT(t.id)}
                        className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs mt-2 line-clamp-2">"{t.text}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Weddings Section ──────────────────────────────────────────────────────
function WeddingsManager() {
  const [list, setList] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Wedding>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newW, setNewW] = useState({ coupleName: '', year: new Date().getFullYear().toString(), venue: '', cover: '', visible: true })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [uploadingForId, setUploadingForId] = useState<string | null>(null)
  const photoInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/portfolio')
    if (res.ok) setList(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const saveAll = async (updated: Wedding[]) => {
    await fetch('/api/admin/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setList(updated)
  }

  const toggleVisible = async (id: string) => {
    await saveAll(list.map(w => w.id === id ? { ...w, visible: !w.visible } : w))
  }

  const startEdit = (w: Wedding) => { setEditId(w.id); setEditData({ ...w }) }

  const saveEdit = async () => {
    if (!editId) return
    setSaving(true)
    await saveAll(list.map(w => w.id === editId ? { ...w, ...editData } : w))
    setEditId(null)
    setSaving(false)
  }

  const deleteW = async (id: string) => {
    if (!confirm('¿Eliminar esta boda?')) return
    await fetch('/api/admin/portfolio', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setList(list.filter(w => w.id !== id))
  }

  const addNew = async () => {
    setSaving(true)
    await fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newW, photos: newW.cover ? [newW.cover] : [] }),
    })
    setNewW({ coupleName: '', year: new Date().getFullYear().toString(), venue: '', cover: '', visible: true })
    setShowAdd(false)
    await load()
    setSaving(false)
  }

  const uploadPhotosForWedding = async (id: string, files: FileList) => {
    if (!files.length) return
    setUploadingForId(id)
    const formData = new FormData()
    formData.append('section', 'portfolio')
    Array.from(files).forEach(f => formData.append('files', f))
    const res = await fetch('/api/admin/upload-section', { method: 'POST', body: formData })
    const data = await res.json()
    if (res.ok && data.results?.length) {
      const newUrls: string[] = data.results.map((r: { url: string }) => r.url)
      const updated = list.map(w => {
        if (w.id !== id) return w
        const merged = [...w.photos, ...newUrls.filter(u => !w.photos.includes(u))]
        return { ...w, photos: merged, cover: w.cover || merged[0] }
      })
      await saveAll(updated)
    }
    setUploadingForId(null)
  }

  const removePhotoFromWedding = async (id: string, url: string) => {
    const updated = list.map(w => {
      if (w.id !== id) return w
      const photos = w.photos.filter(p => p !== url)
      return { ...w, photos, cover: w.cover === url ? (photos[0] ?? '') : w.cover }
    })
    await saveAll(updated)
  }

  const setCoverForWedding = async (id: string, url: string) => {
    await saveAll(list.map(w => w.id === id ? { ...w, cover: url } : w))
  }

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-[#C9A96E]" /></div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-sm tracking-widest uppercase flex items-center gap-2">
          <BookOpen size={14} className="text-[#C9A96E]" />
          Bodas en Portafolio ({list.length})
        </h2>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] text-black text-xs font-medium tracking-widest uppercase px-4 py-2 transition-colors">
          <Plus size={14} /> Agregar
        </button>
      </div>

      {/* Add new form */}
      {showAdd && (
        <div className="bg-neutral-900 border border-[#C9A96E]/30 p-6 space-y-4">
          <p className="text-[#C9A96E] text-xs tracking-widest uppercase">Nueva Boda</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Nombre de la pareja</label>
              <input value={newW.coupleName} onChange={e => setNewW({ ...newW, coupleName: e.target.value })}
                placeholder="Emma & Carlos"
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Año</label>
              <input value={newW.year} onChange={e => setNewW({ ...newW, year: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Venue</label>
              <input value={newW.venue} onChange={e => setNewW({ ...newW, venue: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addNew} disabled={saving || !newW.coupleName}
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-6 py-2.5 transition-colors">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
            </button>
            <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white text-xs px-4 py-2.5 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Weddings list */}
      <div className="space-y-2">
        {list.map(w => (
          <div key={w.id} className={`bg-neutral-900 border transition-colors ${w.visible ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
            {editId === w.id ? (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Pareja</label>
                    <input value={editData.coupleName ?? ''} onChange={e => setEditData({ ...editData, coupleName: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Año</label>
                    <input value={editData.year ?? ''} onChange={e => setEditData({ ...editData, year: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">Venue</label>
                    <input value={editData.venue ?? ''} onChange={e => setEditData({ ...editData, venue: e.target.value })}
                      className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} disabled={saving}
                    className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-5 py-2 transition-colors">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
                  </button>
                  <button onClick={() => setEditId(null)} className="text-white/40 hover:text-white text-xs px-4 py-2 transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                {/* Wedding row */}
                <div className="p-4 flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0 bg-neutral-800 overflow-hidden">
                    {w.cover ? (
                      <Image src={w.cover} alt={w.coupleName} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={16} className="text-neutral-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-playfair">{w.coupleName}</p>
                    <p className="text-white/40 text-xs mt-0.5">{w.venue} · {w.year}</p>
                    <p className="text-white/25 text-xs mt-0.5">{w.photos.length} foto{w.photos.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Photos expand button */}
                    <button
                      onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
                      title="Gestionar fotos"
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors rounded-sm ${
                        expandedId === w.id
                          ? 'bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/30'
                          : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Images size={13} />
                      <span className="hidden sm:inline">Fotos</span>
                    </button>
                    <button onClick={() => toggleVisible(w.id)} title={w.visible ? 'Ocultar' : 'Mostrar'}
                      className="p-1.5 text-white/30 hover:text-white transition-colors">
                      {w.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => startEdit(w)}
                      className="p-1.5 text-white/30 hover:text-[#C9A96E] transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteW(w.id)}
                      className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded photos panel */}
                {expandedId === w.id && (
                  <div className="border-t border-white/10 bg-neutral-950/60 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[#C9A96E] text-xs tracking-widest uppercase">Fotos de {w.coupleName}</p>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          ref={el => { photoInputRefs.current[w.id] = el }}
                          onChange={e => e.target.files && uploadPhotosForWedding(w.id, e.target.files)}
                        />
                        <button
                          onClick={() => photoInputRefs.current[w.id]?.click()}
                          disabled={uploadingForId === w.id}
                          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-3 py-2 transition-colors"
                        >
                          {uploadingForId === w.id
                            ? <><Loader2 size={12} className="animate-spin" /> Subiendo...</>
                            : <><Upload size={12} /> Subir fotos</>
                          }
                        </button>
                      </div>
                    </div>

                    {w.photos.length === 0 ? (
                      <p className="text-white/25 text-xs text-center py-6">
                        No hay fotos aún. Haz clic en "Subir fotos" para agregar.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {w.photos.map(url => (
                          <div key={url} className="relative aspect-square group overflow-hidden bg-neutral-800">
                            <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                            {/* Cover badge */}
                            {url === w.cover && (
                              <div className="absolute top-1 left-1 bg-[#C9A96E] text-black text-[9px] font-medium tracking-widest uppercase px-1.5 py-0.5">
                                Portada
                              </div>
                            )}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                              {url !== w.cover && (
                                <button
                                  onClick={() => setCoverForWedding(w.id, url)}
                                  className="text-[#C9A96E] text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                                >
                                  Portada
                                </button>
                              )}
                              <button
                                onClick={() => removePhotoFromWedding(w.id, url)}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-[10px] transition-colors"
                              >
                                <X size={10} /> Quitar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-white/20 text-xs">
                      Las fotos se suben a /images/portfolio/ y se convierten a WebP automáticamente.
                      "Quitar" las elimina de esta boda pero no del servidor.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Packages Manager ──────────────────────────────────────────────────────
function PackagesManager() {
  const [list, setList] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Package>>({})
  const [showAdd, setShowAdd] = useState(false)
  const blank: Omit<Package, 'id'> = { name: '', nameEs: '', tagline: '', taglineEs: '', price: '', features: [], featuresEs: [], visible: true, highlighted: false }
  const [newPkg, setNewPkg] = useState(blank)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/packages')
    if (res.ok) setList(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const saveAll = async (updated: Package[]) => {
    await fetch('/api/admin/packages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setList(updated)
  }

  const toggleVisible = (id: string) => saveAll(list.map(p => p.id === id ? { ...p, visible: !p.visible } : p))
  const toggleHighlight = (id: string) => saveAll(list.map(p => p.id === id ? { ...p, highlighted: !p.highlighted } : p))

  const saveEdit = async () => {
    if (!editId) return
    setSaving(true)
    await saveAll(list.map(p => p.id === editId ? { ...p, ...editData } : p))
    setEditId(null)
    setSaving(false)
  }

  const deleteP = async (id: string) => {
    if (!confirm('¿Eliminar este paquete?')) return
    await fetch('/api/admin/packages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setList(list.filter(p => p.id !== id))
  }

  const addNew = async () => {
    setSaving(true)
    await fetch('/api/admin/packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPkg) })
    setNewPkg(blank)
    setShowAdd(false)
    await load()
    setSaving(false)
  }

  const textArea = (label: string, val: string, onChange: (v: string) => void) => (
    <div>
      <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">{label}</label>
      <textarea value={val} onChange={e => onChange(e.target.value)} rows={4}
        placeholder="Una característica por línea"
        className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none resize-none font-mono text-xs" />
    </div>
  )

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-[#C9A96E]" /></div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-sm tracking-widest uppercase flex items-center gap-2">
          <span className="text-[#C9A96E]">📦</span> Paquetes ({list.length})
        </h2>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] text-black text-xs font-medium tracking-widest uppercase px-4 py-2 transition-colors">
          <Plus size={14} /> Agregar
        </button>
      </div>

      {showAdd && (
        <div className="bg-neutral-900 border border-[#C9A96E]/30 p-6 space-y-4">
          <p className="text-[#C9A96E] text-xs tracking-widest uppercase">Nuevo Paquete</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Nombre (EN)', 'name'], ['Nombre (ES)', 'nameEs'], ['Tagline (EN)', 'tagline'], ['Tagline (ES)', 'taglineEs'], ['Precio', 'price']].map(([lbl, key]) => (
              <div key={key}>
                <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">{lbl}</label>
                <input value={(newPkg as Record<string, unknown>)[key as string] as string} onChange={e => setNewPkg(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
              </div>
            ))}
          </div>
          {textArea('Características EN (una por línea)', newPkg.features.join('\n'), v => setNewPkg(p => ({ ...p, features: v.split('\n').filter(Boolean) })))}
          {textArea('Características ES (una por línea)', newPkg.featuresEs.join('\n'), v => setNewPkg(p => ({ ...p, featuresEs: v.split('\n').filter(Boolean) })))}
          <div className="flex gap-3">
            <button onClick={addNew} disabled={saving || !newPkg.name}
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-6 py-2.5 transition-colors">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
            </button>
            <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white text-xs px-4 py-2.5 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map(pkg => (
          <div key={pkg.id} className={`bg-neutral-900 border p-5 transition-colors ${pkg.visible ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
            {editId === pkg.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[['Nombre (EN)', 'name'], ['Nombre (ES)', 'nameEs'], ['Tagline (EN)', 'tagline'], ['Tagline (ES)', 'taglineEs'], ['Precio', 'price']].map(([lbl, key]) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs tracking-widest uppercase block mb-1">{lbl}</label>
                      <input value={(editData as Record<string,string>)[key] ?? ''} onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                        className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C9A96E]/50 outline-none" />
                    </div>
                  ))}
                </div>
                {textArea('Características EN', (editData.features ?? []).join('\n'), v => setEditData(d => ({ ...d, features: v.split('\n').filter(Boolean) })))}
                {textArea('Características ES', (editData.featuresEs ?? []).join('\n'), v => setEditData(d => ({ ...d, featuresEs: v.split('\n').filter(Boolean) })))}
                <div className="flex gap-3">
                  <button onClick={saveEdit} disabled={saving}
                    className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-black text-xs font-medium tracking-widest uppercase px-5 py-2 transition-colors">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Guardar
                  </button>
                  <button onClick={() => setEditId(null)} className="text-white/40 hover:text-white text-xs px-4 py-2 transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-playfair text-lg">{pkg.name}</p>
                    {pkg.highlighted && <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] tracking-widest uppercase px-2 py-0.5">Popular</span>}
                  </div>
                  <p className="text-white/40 text-xs mb-3">{pkg.tagline}</p>
                  <p className="text-white/25 text-xs">{pkg.features.length} características · {pkg.price || 'Sin precio'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleHighlight(pkg.id)} title="Destacado"
                    className={`p-1.5 transition-colors ${pkg.highlighted ? 'text-[#C9A96E]' : 'text-white/20 hover:text-[#C9A96E]'}`}>
                    <span className="text-sm">★</span>
                  </button>
                  <button onClick={() => toggleVisible(pkg.id)} className="p-1.5 text-white/30 hover:text-white transition-colors">
                    {pkg.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => { setEditId(pkg.id); setEditData({ ...pkg }) }}
                    className="p-1.5 text-white/30 hover:text-[#C9A96E] transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteP(pkg.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Inquiries Manager ─────────────────────────────────────────────────────
function InquiriesManager() {
  const [list, setList] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/inquiries').then(r => r.ok ? r.json() : []).then(setList).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-[#C9A96E]" /></div>

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-white text-sm tracking-widest uppercase flex items-center gap-2">
        <span className="text-[#C9A96E]">📩</span> Consultas recibidas ({list.length})
      </h2>

      {list.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/25 text-sm">No hay consultas aún</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(inq => (
            <div key={inq.id} className="bg-neutral-900 border border-white/10">
              <button
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#C9A96E] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{inq.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{inq.email} · {inq.eventDate || '—'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${inq.type === 'quote' ? 'bg-[#C9A96E]/20 text-[#C9A96E]' : 'bg-white/10 text-white/40'}`}>
                    {inq.type === 'quote' ? 'Cotización' : 'Contacto'}
                  </span>
                  <span className="text-white/20 text-xs">{new Date(inq.createdAt).toLocaleDateString('es-DO')}</span>
                </div>
              </button>

              {expandedId === inq.id && (
                <div className="border-t border-white/10 p-4 space-y-3 bg-neutral-950/40">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {[['Teléfono', inq.phone], ['Fecha evento', inq.eventDate], ['Lugar', inq.eventLocation], ['Paquete', inq.package || '—']].map(([k, v]) => v && (
                      <div key={k}><p className="text-white/30 uppercase tracking-widest mb-0.5">{k}</p><p className="text-white/70">{v}</p></div>
                    ))}
                  </div>
                  <div className="bg-neutral-900 p-3">
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Mensaje</p>
                    <p className="text-white/70 text-sm leading-relaxed">{inq.message}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={`mailto:${inq.email}`} className="text-[#C9A96E] text-xs tracking-widest uppercase hover:text-white transition-colors">
                      Responder por email →
                    </a>
                    {inq.phone && (
                      <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                        className="text-[#25D366] text-xs tracking-widest uppercase hover:text-white transition-colors">
                        WhatsApp →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Blog Manager ─────────────────────────────────────────────────────────
function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'generator' | 'editor'>('list')

  // Generator state
  const [genStep, setGenStep] = useState<'idle' | 'titles' | 'generating-titles' | 'post' | 'generating-post' | 'error'>('idle')
  const [titles, setTitles] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [genContext, setGenContext] = useState('')
  const [generatedPost, setGeneratedPost] = useState<Partial<BlogPost> | null>(null)

  // Editor state
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverReady, setCoverReady] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/blog')
    if (res.ok) setPosts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generateTitles = async () => {
    setGenStep('generating-titles')
    setTitles([])
    setMsg('')
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'titles', context: genContext })
      })
      const data = await res.json()
      if (!res.ok) { setGenStep('idle'); setMsg(`Error: ${data.error || res.status}${data.raw ? ' — ' + data.raw.slice(0, 120) : ''}`); return }
      if (!data.titles?.length) { setGenStep('idle'); setMsg('No titles returned. Try again.'); return }
      setTitles(data.titles)
      setGenStep('titles')
    } catch (e) {
      setGenStep('idle')
      setMsg(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }

  const generatePost = async (title: string) => {
    setSelectedTitle(title)
    setGenStep('generating-post')
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'post', title, context: genContext })
      })
      const data = await res.json()
      const p = data.post
      const now = new Date().toISOString()
      setGeneratedPost({
        id: `post-${Date.now()}`,
        slug: p.slug,
        title: p.titleEn,
        titleEs: p.titleEs,
        excerpt: p.excerptEn,
        excerptEs: p.excerptEs,
        content: p.contentEn,
        contentEs: p.contentEs,
        coverImage: '',
        tags: p.tags || [],
        published: false,
        createdAt: now,
        publishedAt: now,
      })
      setGenStep('post')
    } catch {
      setGenStep('titles')
      setMsg('Error generating post content. Try again.')
    }
  }

  const openEditor = (post: BlogPost | null) => {
    setEditPost(post)
    setCoverFile(null)
    setCoverReady(false)
    setCoverUploading(false)
    setView('editor')
    setMsg('')
  }

  const handleCoverSelect = async (file: File) => {
    setCoverFile(file)
    setCoverReady(false)
    setCoverUploading(true)
    setMsg('')
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
      const fileName = `${baseName}-${Date.now()}.jpg`
      const storagePath = `blog/${fileName}`
      const { error } = await supabase.storage.from('media').upload(storagePath, file, {
        upsert: true,
        contentType: 'image/jpeg',
      })
      if (error) throw new Error(error.message)
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(storagePath)
      setEditPost(p => p ? { ...p, coverImage: publicUrl } : p)
      setCoverReady(true)
    } catch (e) {
      setMsg(`Cover upload failed: ${e instanceof Error ? e.message : String(e)}`)
      setCoverReady(false)
    } finally {
      setCoverUploading(false)
    }
  }

  const uploadCover = async (): Promise<string> => {
    // Cover is already uploaded on select — just return the current URL
    return editPost?.coverImage || ''
  }

  const savePost = async () => {
    if (!editPost) return
    setSaving(true)
    setMsg('')
    try {
      const coverImage = await uploadCover()
      const post: BlogPost = { ...editPost, coverImage, publishedAt: editPost.published ? (editPost.publishedAt || new Date().toISOString()) : editPost.publishedAt }
      const existing = posts.find(p => p.id === post.id)
      const method = existing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/blog', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg(`Error ${res.status}: ${data.error || JSON.stringify(data)}`)
        setSaving(false)
        return
      }
      setMsg('✓ Saved')
      await load()
      setView('list')
    } catch (e) {
      setMsg(`Error: ${e instanceof Error ? e.message : String(e)}`)
    }
    setSaving(false)
  }

  const togglePublish = async (post: BlogPost) => {
    const updated = { ...post, published: !post.published, publishedAt: !post.published ? new Date().toISOString() : post.publishedAt }
    await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    await load()
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
  }

  const inputCls = 'w-full bg-neutral-800 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/25 focus:border-[#C9A96E]/60 focus:outline-none transition-colors'
  const labelCls = 'text-white/40 text-xs tracking-widest uppercase block mb-1.5'

  // ── Editor view ──
  if (view === 'editor' && editPost) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('list')} className="text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Back</button>
          <h2 className="text-white font-playfair text-xl font-light">
            {posts.find(p => p.id === editPost.id) ? 'Edit Post' : 'New Post'}
          </h2>
        </div>

        <div className="space-y-5">
          {/* Cover */}
          <div>
            <label className={labelCls}>Cover Image</label>

            {/* Preview */}
            {editPost.coverImage && !coverUploading && (
              <div className="relative mb-3">
                <img src={editPost.coverImage} className="h-32 w-full object-cover opacity-80" alt="" />
                {coverReady && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-600/90 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                    <CheckCircle size={10} /> Ready
                  </div>
                )}
              </div>
            )}

            {/* Uploading indicator */}
            {coverUploading && (
              <div className="h-32 mb-3 border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3">
                <Loader2 size={22} className="animate-spin text-[#C9A96E]" />
                <p className="text-white/50 text-xs tracking-widest uppercase">Uploading image...</p>
              </div>
            )}

            <input ref={coverRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverSelect(f) }} />
            <button
              onClick={() => coverRef.current?.click()}
              disabled={coverUploading}
              className="border border-white/20 disabled:opacity-50 text-white/50 hover:text-white text-xs tracking-widest uppercase px-5 py-2.5 transition-colors flex items-center gap-2"
            >
              {coverUploading
                ? <><Loader2 size={12} className="animate-spin" /> Uploading...</>
                : coverReady
                  ? <><CheckCircle size={12} className="text-green-400" /> {coverFile?.name ?? 'Change Photo'}</>
                  : 'Upload Cover Photo'
              }
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title (English)</label>
              <input value={editPost.title} onChange={e => setEditPost(p => p ? {...p, title: e.target.value} : p)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Title (Español)</label>
              <input value={editPost.titleEs} onChange={e => setEditPost(p => p ? {...p, titleEs: e.target.value} : p)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input value={editPost.slug} onChange={e => setEditPost(p => p ? {...p, slug: e.target.value} : p)} className={inputCls} placeholder="e.g. best-punta-cana-wedding-venues" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Excerpt / Meta Description (EN)</label>
              <textarea value={editPost.excerpt} onChange={e => setEditPost(p => p ? {...p, excerpt: e.target.value} : p)} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Excerpt / Meta Description (ES)</label>
              <textarea value={editPost.excerptEs} onChange={e => setEditPost(p => p ? {...p, excerptEs: e.target.value} : p)} rows={3} className={`${inputCls} resize-none`} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input value={editPost.tags.join(', ')} onChange={e => setEditPost(p => p ? {...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)} : p)} className={inputCls} placeholder="punta cana, wedding, destination" />
          </div>

          <div>
            <label className={labelCls}>Content (English) — HTML</label>
            <textarea value={editPost.content} onChange={e => setEditPost(p => p ? {...p, content: e.target.value} : p)} rows={14} className={`${inputCls} resize-y font-mono text-xs`} />
          </div>
          <div>
            <label className={labelCls}>Content (Español) — HTML</label>
            <textarea value={editPost.contentEs} onChange={e => setEditPost(p => p ? {...p, contentEs: e.target.value} : p)} rows={14} className={`${inputCls} resize-y font-mono text-xs`} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors ${editPost.published ? 'bg-[#C9A96E]' : 'bg-white/20'} relative`}
                onClick={() => setEditPost(p => p ? {...p, published: !p.published} : p)}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${editPost.published ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-white/60 text-sm">{editPost.published ? 'Published' : 'Draft'}</span>
            </label>
          </div>

          {msg && <p className="text-[#C9A96E] text-sm">{msg}</p>}

          <button onClick={savePost} disabled={saving || coverUploading} className="bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-60 text-black text-sm font-medium tracking-[0.2em] uppercase px-8 py-4 transition-colors flex items-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : coverUploading ? <><Loader2 size={14} className="animate-spin" /> Uploading image...</> : 'Save Post'}
          </button>
        </div>
      </div>
    )
  }

  // ── Generator view ──
  if (view === 'generator') {
    return (
      <div className="p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setView('list'); setGenStep('idle'); setTitles([]); setGeneratedPost(null) }} className="text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Back</button>
          <h2 className="text-white font-playfair text-xl font-light">AI Blog Generator</h2>
        </div>

        {/* Step 1: Generate titles */}
        {(genStep === 'idle' || genStep === 'generating-titles' || genStep === 'titles') && (
          <div className="mb-8">
            <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
              <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2">Step 1 — Generate SEO Titles</p>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                The AI will generate 10 SEO-optimized blog post titles. Optionally add context to guide the topic.
              </p>
              <div className="mb-4">
                <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Context (optional)</label>
                <textarea
                  value={genContext}
                  onChange={e => setGenContext(e.target.value)}
                  placeholder="e.g. Write about beach ceremonies at Hard Rock Hotel, tips for brides, best time of year..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C9A96E]/50 text-white/80 text-sm px-4 py-3 outline-none resize-none placeholder:text-white/20"
                />
              </div>
              <button
                onClick={generateTitles}
                disabled={genStep === 'generating-titles'}
                className="bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-60 text-black text-sm font-medium tracking-[0.2em] uppercase px-7 py-3 transition-colors flex items-center gap-2"
              >
                {genStep === 'generating-titles' ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : '✦ Generate Title Ideas'}
              </button>
            </div>

            {titles.length > 0 && (
              <div>
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Choose a title to write the full post:</p>
                <div className="space-y-2">
                  {titles.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => generatePost(t)}
                      disabled={saving}
                      className="w-full text-left border border-white/10 hover:border-[#C9A96E]/50 bg-white/[0.02] hover:bg-[#C9A96E]/5 px-5 py-4 transition-all group disabled:opacity-50"
                    >
                      <span className="text-[#C9A96E] text-xs mr-3 font-mono">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-white/80 group-hover:text-white text-sm transition-colors">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Generating post */}
        {genStep === 'generating-post' && (
          <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
            <Loader2 size={28} className="animate-spin text-[#C9A96E] mx-auto mb-4" />
            <p className="text-white/60 text-sm mb-1">Writing your blog post...</p>
            <p className="text-white/30 text-xs">"{selectedTitle}"</p>
          </div>
        )}

        {/* Step 3: Post generated — open editor */}
        {genStep === 'post' && generatedPost && (
          <div className="border border-[#C9A96E]/30 bg-[#C9A96E]/5 p-6">
            <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-3">✓ Post Generated</p>
            <h3 className="text-white font-playfair text-lg font-light mb-2">{generatedPost.title}</h3>
            <p className="text-white/40 text-sm mb-2">/{generatedPost.slug}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-5">{generatedPost.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {generatedPost.tags?.map(tag => <span key={tag} className="text-[10px] border border-[#C9A96E]/30 text-[#C9A96E]/70 px-2 py-1 tracking-widest uppercase">{tag}</span>)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { openEditor(generatedPost as BlogPost) }}
                className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-7 py-3 transition-colors"
              >
                Edit & Publish
              </button>
              <button onClick={() => { setGenStep('titles'); setGeneratedPost(null) }} className="border border-white/20 text-white/50 hover:text-white text-sm tracking-widest uppercase px-5 py-3 transition-colors">
                Generate Another
              </button>
            </div>
          </div>
        )}

        {msg && <p className="text-red-400 text-sm mt-4">{msg}</p>}
      </div>
    )
  }

  // ── List view ──
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-white font-playfair text-xl font-light">Blog Posts</h2>
          <p className="text-white/30 text-xs mt-1">{posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setGenStep('idle'); setTitles([]); setGeneratedPost(null); setView('generator') }}
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-xs font-medium tracking-[0.2em] uppercase px-5 py-3 transition-colors flex items-center gap-2">
            ✦ AI Generator
          </button>
          <button onClick={() => openEditor({ id: `post-${Date.now()}`, slug: '', title: '', titleEs: '', excerpt: '', excerptEs: '', content: '', contentEs: '', coverImage: '', tags: [], published: false, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString() })}
            className="border border-white/20 hover:border-white/50 text-white/60 hover:text-white text-xs tracking-widest uppercase px-5 py-3 transition-colors">
            + New Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/30"><Loader2 size={16} className="animate-spin" /> Loading...</div>
      ) : posts.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-16 text-center">
          <p className="text-white/20 text-xs tracking-widest uppercase mb-4">No posts yet</p>
          <button onClick={() => { setGenStep('idle'); setView('generator') }}
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-xs font-medium tracking-[0.2em] uppercase px-6 py-3 transition-colors">
            ✦ Create your first post with AI
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="border border-white/10 bg-white/[0.02] p-5 flex items-center gap-5">
              {post.coverImage && <img src={post.coverImage} className="w-16 h-12 object-cover shrink-0 opacity-80" alt="" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-white/20 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-white text-sm font-medium truncate">{post.title}</p>
                <p className="text-white/30 text-xs truncate">/{post.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(post)} className="text-white/40 hover:text-[#C9A96E] transition-colors p-2" title={post.published ? 'Unpublish' : 'Publish'}>
                  {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => openEditor(post)} className="text-white/40 hover:text-white transition-colors p-2">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deletePost(post.id)} className="text-white/40 hover:text-red-400 transition-colors p-2">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('hero')
  const [photos, setPhotos] = useState<Record<string, string[]>>({})
  const [loadingPhotos, setLoadingPhotos] = useState(false)

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

  useEffect(() => {
    if (PHOTO_SECTION_KEYS.includes(activeSection)) loadPhotos()
  }, [activeSection, loadPhotos])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/en'
  }

  const activeItem = MENU_ITEMS.find(s => s.key === activeSection)
  const isPhotoSection = PHOTO_SECTION_KEYS.includes(activeSection)

  return (
    <div className="min-h-screen bg-neutral-950 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-white/10 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-white/10">
          <button onClick={() => { window.location.href = '/en' }} className="flex flex-col leading-none hover:opacity-80 transition-opacity text-left">
            <span className="text-white text-lg font-light tracking-[0.3em] uppercase">Soul</span>
            <span className="text-[#C9A96E] text-lg font-semibold tracking-[0.3em] uppercase">Pictures</span>
          </button>
          <p className="text-white/30 text-xs tracking-widest mt-2">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Section divider: Photos */}
          <p className="text-white/20 text-xs tracking-widest uppercase px-4 py-2">Fotos</p>
          {MENU_ITEMS.filter(s => PHOTO_SECTION_KEYS.includes(s.key)).map(sec => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
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

          {/* Section divider: Content */}
          <p className="text-white/20 text-xs tracking-widest uppercase px-4 py-2 mt-3">Contenido</p>
          {MENU_ITEMS.filter(s => !PHOTO_SECTION_KEYS.includes(s.key)).map(sec => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className={`w-full text-left px-4 py-3 rounded-sm transition-colors flex items-center gap-3 ${
                activeSection === sec.key
                  ? 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{sec.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{sec.label}</p>
                <p className="text-xs text-white/30 truncate">{sec.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-white/40 hover:text-white text-sm transition-colors"
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
              {activeItem?.icon} {activeItem?.label}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">{activeItem?.desc}</p>
          </div>
          {isPhotoSection && (
            <div className="flex items-center gap-3 text-white/40 text-xs">
              <Images size={14} />
              <span>{(photos[activeSection] || []).length} foto{(photos[activeSection] || []).length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </header>

        {/* Content */}
        {isPhotoSection && (
          <PhotoSection
            key={activeSection}
            sectionKey={activeSection}
            photos={photos[activeSection] || []}
            loadingPhotos={loadingPhotos}
            onRefresh={loadPhotos}
          />
        )}
        {activeSection === 'testimonials' && <TestimonialsManager />}
        {activeSection === 'weddings' && <WeddingsManager />}
        {activeSection === 'packages' && <PackagesManager />}
        {activeSection === 'inquiries' && <InquiriesManager />}
        {activeSection === 'blog' && <BlogManager />}
      </main>
    </div>
  )
}
