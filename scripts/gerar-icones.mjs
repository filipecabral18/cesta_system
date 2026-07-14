// Gera os PNGs do PWA a partir de public/favicon.svg.
// Rode com: npm run gerar-icones
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(resolve(raiz, 'public/favicon.svg'))

const alvos = [
  { arquivo: 'public/pwa-192x192.png', tamanho: 192 },
  { arquivo: 'public/pwa-512x512.png', tamanho: 512 },
  { arquivo: 'public/apple-touch-icon.png', tamanho: 180 },
]

for (const { arquivo, tamanho } of alvos) {
  // density alto garante rasterização nítida do SVG antes do resize.
  await sharp(svg, { density: 384 })
    .resize(tamanho, tamanho)
    .png()
    .toFile(resolve(raiz, arquivo))
  console.log('gerado:', arquivo)
}
