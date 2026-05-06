import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SOURCE = 'C:/Users/Marcos/Desktop/SoulPicturesMS Colecction'
const DEST = 'public/images'

// Helper: get file at specific index from folder
function getFile(folder, index) {
  const files = fs.readdirSync(folder)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort()
  return path.join(folder, files[Math.min(index, files.length - 1)])
}

async function convert(src, dest, width, quality = 85) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const originalSize = fs.statSync(src).size
  await sharp(src).rotate().resize(width, null, { withoutEnlargement: true }).webp({ quality, effort: 4 }).toFile(dest)
  const newSize = fs.statSync(dest).size
  const saving = Math.round((1 - newSize / originalSize) * 100)
  console.log(`✓ ${path.basename(dest)} — ${(originalSize/1e6).toFixed(1)}MB → ${(newSize/1e3).toFixed(0)}KB (${saving}% smaller)`)
}

const albums = {
  resumen1: `${SOURCE}/boda resumen1`,
  resumen2: `${SOURCE}/boda resumen2`,
  resumen3: `${SOURCE}/boda resumen3`,
  resumen4: `${SOURCE}/boda resumen4`,
  resumen5: `${SOURCE}/boda resumen5`,
  resumen7: `${SOURCE}/bodar esumen7`,
  resumen8: `${SOURCE}/bodar esumen8`,
  resumen9: `${SOURCE}/bodar esumen9`,
  resumen10: `${SOURCE}/boda resumen 10`,
  julia: `${SOURCE}/sesion fotos julia`,
  propuesta: `${SOURCE}/propuesta resumen1`,
}

// Pick photos from mid/late album (ceremony & couple shots)
const jobs = [
  // GALLERY HOME - 6 featured weddings (mid-album = couple/ceremony shots)
  { src: getFile(albums.resumen1,  15), dest: `${DEST}/gallery/wedding-01.webp`,   w: 800 },
  { src: getFile(albums.resumen2,  12), dest: `${DEST}/gallery/wedding-02.webp`,   w: 800 },
  { src: getFile(albums.resumen8,  10), dest: `${DEST}/gallery/wedding-03.webp`,   w: 800 },
  { src: getFile(albums.resumen4,  14), dest: `${DEST}/gallery/wedding-04.webp`,   w: 800 },
  { src: getFile(albums.resumen9,  20), dest: `${DEST}/gallery/wedding-05.webp`,   w: 800 },
  { src: getFile(albums.resumen7,  10), dest: `${DEST}/gallery/wedding-06.webp`,   w: 800 },

  // PORTFOLIO GRID - 9 covers (different photo per wedding)
  { src: getFile(albums.resumen1,  20), dest: `${DEST}/portfolio/boda-1.webp`,  w: 900 },
  { src: getFile(albums.resumen2,  18), dest: `${DEST}/portfolio/boda-2.webp`,  w: 900 },
  { src: getFile(albums.resumen3,   8), dest: `${DEST}/portfolio/boda-3.webp`,  w: 900 },
  { src: getFile(albums.resumen4,  20), dest: `${DEST}/portfolio/boda-4.webp`,  w: 900 },
  { src: getFile(albums.resumen5,  20), dest: `${DEST}/portfolio/boda-5.webp`,  w: 900 },
  { src: getFile(albums.resumen7,  14), dest: `${DEST}/portfolio/boda-6.webp`,  w: 900 },
  { src: getFile(albums.resumen8,  20), dest: `${DEST}/portfolio/boda-7.webp`,  w: 900 },
  { src: getFile(albums.resumen9,  30), dest: `${DEST}/portfolio/boda-8.webp`,  w: 900 },
  { src: getFile(albums.resumen10,  8), dest: `${DEST}/portfolio/boda-9.webp`,  w: 900 },

  // ABOUT section
  { src: getFile(albums.julia,      5), dest: `${DEST}/about/session-01.webp`,  w: 900 },
  { src: getFile(albums.propuesta,  6), dest: `${DEST}/about/proposal-01.webp`, w: 900 },

  // EXTRA HERO option (from root folder - later number = couple shots)
  { src: `${SOURCE}/80.JPG`,            dest: `${DEST}/hero/hero-03.webp`,       w: 1920, q: 88 },
  { src: `${SOURCE}/120.JPG`,           dest: `${DEST}/hero/hero-04.webp`,       w: 1920, q: 88 },
]

for (const { src, dest, w, q } of jobs) {
  try {
    await convert(src, dest, w, q || 85)
  } catch (e) {
    console.error(`✗ ${path.basename(dest)}: ${e.message}`)
  }
}
console.log('\nAll done!')
