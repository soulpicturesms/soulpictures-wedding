import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SOURCE = 'C:/Users/Marcos/Desktop/SoulPicturesMS Colecction'
const DEST = 'public/images'

// Create output folders
const folders = ['hero', 'gallery', 'portfolio', 'sessions']
folders.forEach(f => fs.mkdirSync(`${DEST}/${f}`, { recursive: true }))

// Photo selection plan:
// hero/         → 1 wide photo for the homepage hero
// gallery/      → 6 photos for home gallery preview (one per wedding)
// portfolio/    → 9 photos for portfolio grid (cover per wedding)
// sessions/     → 2 photos for engagement/sessions section

const selections = [
  // HERO - pick mid-range from root (likely landscape ceremony or couple shots)
  { src: `${SOURCE}/25.JPG`,              dest: `${DEST}/hero/hero-01.webp`,        width: 1920, quality: 88 },
  { src: `${SOURCE}/60.JPG`,              dest: `${DEST}/hero/hero-02.webp`,        width: 1920, quality: 88 },

  // GALLERY HOME (6 wedding covers - one from each resumen folder)
  { src: `${SOURCE}/boda resumen1/1.JPG`,          dest: `${DEST}/gallery/wedding-01.webp`,   width: 800, quality: 85 },
  { src: `${SOURCE}/boda resumen2/1.JPG`,          dest: `${DEST}/gallery/wedding-02.webp`,   width: 800, quality: 85 },
  { src: `${SOURCE}/boda resumen3/1.JPG`,          dest: `${DEST}/gallery/wedding-03.webp`,   width: 800, quality: 85 },
  { src: `${SOURCE}/boda resumen4/1.JPG`,          dest: `${DEST}/gallery/wedding-04.webp`,   width: 800, quality: 85 },
  { src: `${SOURCE}/boda resumen5/1.JPG`,          dest: `${DEST}/gallery/wedding-05.webp`,   width: 800, quality: 85 },
  { src: `${SOURCE}/bodar esumen7/1.JPG`,          dest: `${DEST}/gallery/wedding-06.webp`,   width: 800, quality: 85 },

  // PORTFOLIO GRID (9 covers - one per wedding, different photos)
  { src: `${SOURCE}/boda resumen1/3.JPG`,          dest: `${DEST}/portfolio/boda-1-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/boda resumen2/3.JPG`,          dest: `${DEST}/portfolio/boda-2-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/boda resumen3/3.JPG`,          dest: `${DEST}/portfolio/boda-3-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/boda resumen4/3.JPG`,          dest: `${DEST}/portfolio/boda-4-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/boda resumen5/3.JPG`,          dest: `${DEST}/portfolio/boda-5-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/bodar esumen7/3.JPG`,          dest: `${DEST}/portfolio/boda-7-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/bodar esumen8/1.JPG`,          dest: `${DEST}/portfolio/boda-8-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/bodar esumen9/1.JPG`,          dest: `${DEST}/portfolio/boda-9-cover.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/boda resumen 10/1.JPG`,        dest: `${DEST}/portfolio/boda-10-cover.webp`, width: 900, quality: 85 },

  // ABOUT / SESSIONS
  { src: `${SOURCE}/sesion fotos julia/1.JPG`,     dest: `${DEST}/sessions/session-01.webp`,  width: 900, quality: 85 },
  { src: `${SOURCE}/propuesta resumen1/1.JPG`,     dest: `${DEST}/sessions/proposal-01.webp`, width: 900, quality: 85 },
]

let converted = 0
let errors = 0

for (const { src, dest, width, quality } of selections) {
  const winSrc = src.replace(/\//g, '\\')
  try {
    if (!fs.existsSync(src)) {
      // Try to find the first available file in the folder if specific file missing
      const dir = path.dirname(src)
      const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort()
      if (!files.length) { console.log(`⚠ No files in: ${dir}`); errors++; continue }
      const fallback = path.join(dir, files[0])
      console.log(`Using fallback: ${fallback}`)
      const { size: originalSize } = fs.statSync(fallback)
      await sharp(fallback)
        .rotate()
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toFile(dest)
      const { size: newSize } = fs.statSync(dest)
      const saving = Math.round((1 - newSize / originalSize) * 100)
      console.log(`✓ ${path.basename(dest)} — ${(originalSize/1e6).toFixed(1)}MB → ${(newSize/1e3).toFixed(0)}KB (${saving}% smaller)`)
    } else {
      const { size: originalSize } = fs.statSync(src)
      await sharp(src)
        .rotate()
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toFile(dest)
      const { size: newSize } = fs.statSync(dest)
      const saving = Math.round((1 - newSize / originalSize) * 100)
      console.log(`✓ ${path.basename(dest)} — ${(originalSize/1e6).toFixed(1)}MB → ${(newSize/1e3).toFixed(0)}KB (${saving}% smaller)`)
    }
    converted++
  } catch (e) {
    console.error(`✗ ${path.basename(dest)}: ${e.message}`)
    errors++
  }
}

console.log(`\nDone: ${converted} converted, ${errors} errors`)
