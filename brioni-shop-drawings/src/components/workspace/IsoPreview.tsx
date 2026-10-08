import { useId, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { StoneFilter } from '@/components/StoneTexture'
import { Button } from '@/components/ui/button'
import { getMaterial } from '@/lib/catalog'
import { boundingSize, cutoutRect, edgeSegments, type Point } from '@/lib/geometry'
import type { Drawing } from '@/lib/types'

/**
 * A light 3D preview drawn as isometric SVG: base cabinets, the stone with
 * its real edges and cut-outs, and the backsplash. Enough for a customer to
 * recognise their kitchen, with nothing to install or learn.
 */

const COS = Math.cos(Math.PI / 6)
const SIN = 0.5
const CABINET = 34.5
const TOE = 4

type V3 = [number, number, number]
const proj = ([x, y, z]: V3): Point => [(x - y) * COS, (x + y) * SIN - z]
const pts = (vs: V3[]) => vs.map((v) => proj(v).join(',')).join(' ')

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 + amount))))
  const r = f((n >> 16) & 255)
  const g = f((n >> 8) & 255)
  const b = f(n & 255)
  return `rgb(${r},${g},${b})`
}

interface Face {
  key: string
  points: V3[]
  depth: number
  normal: Point
  a: Point
  b: Point
  z0: number
  z1: number
}

/** Visible side faces of a vertical prism, viewed from the front-right. */
function sideFaces(prefix: string, outline: Point[], normals: Point[], z0: number, z1: number): Face[] {
  const faces: Face[] = []
  outline.forEach((a, i) => {
    const b = outline[(i + 1) % outline.length]
    const n = normals[i]
    if (n[0] <= 0.5 && n[1] <= 0.5) return
    faces.push({
      key: `${prefix}-${i}`,
      points: [
        [a[0], a[1], z0],
        [b[0], b[1], z0],
        [b[0], b[1], z1],
        [a[0], a[1], z1],
      ],
      depth: (a[0] + b[0]) / 2 + (a[1] + b[1]) / 2,
      normal: n,
      a,
      b,
      z0,
      z1,
    })
  })
  return faces.sort((p, q) => p.depth - q.depth)
}

/** Move each edge of an orthogonal polygon inward by its own distance. */
function inset(outline: Point[], normals: Point[], dist: number[]): Point[] {
  return outline.map(([x, y], i) => {
    const prev = (i - 1 + outline.length) % outline.length
    return [
      x - normals[i][0] * dist[i] - normals[prev][0] * dist[prev],
      y - normals[i][1] * dist[i] - normals[prev][1] * dist[prev],
    ]
  })
}

export function IsoPreview({ drawing: d }: { drawing: Drawing }) {
  const uid = useId().replace(/:/g, '')
  const [flipped, setFlipped] = useState(false)
  const material = getMaterial(d.materialId)
  const { w: bw } = boundingSize(d)
  const mx = (x: number) => (flipped ? bw - x : x)

  const segs = edgeSegments(d)
  const outline: Point[] = segs.map((s) => [mx(s.a[0]), s.a[1]])
  const normals: Point[] = segs.map((s) => [flipped ? -s.normal[0] : s.normal[0], s.normal[1]])
  const wallSide = segs.map((s) => s.id === 'back')

  const T = d.thickness === '3cm' ? 1.9 : 1.3 // a little exaggerated so the edge reads
  const top = CABINET + T

  const body = inset(outline, normals, wallSide.map((w) => (w ? 0 : 1.5)))
  const toe = inset(outline, normals, wallSide.map((w) => (w ? 0 : 4.5)))

  const toeFaces = sideFaces('toe', toe, normals, 0, TOE)
  const bodyFaces = sideFaces('body', body, normals, TOE, CABINET)
  const stoneFaces = sideFaces('stone', outline, normals, CABINET, top)

  // Fit the view to everything drawn.
  const splashH = d.backsplash.enabled ? d.backsplash.height : 0
  const all: Point[] = []
  for (const [x, y] of outline) for (const z of [0, top + splashH + 16]) all.push(proj([x, y, z]))
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const pad = Math.max(...xs) - Math.min(...xs)
  const vb = {
    x: Math.min(...xs) - pad * 0.08,
    y: Math.min(...ys) - pad * 0.06,
    w: (Math.max(...xs) - Math.min(...xs)) * 1.16,
    h: Math.max(...ys) - Math.min(...ys) + pad * 0.14,
  }
  const sw = vb.w / 700 // a "pixel" in view units, for strokes

  const front = material.swatch
  const isDark = ['absolute-black', 'steel-grey'].includes(material.id)

  function doorLines(f: Face) {
    const len = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const n = Math.max(1, Math.round(len / 21))
    const lines = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const x = f.a[0] + (f.b[0] - f.a[0]) * t
      const y = f.a[1] + (f.b[1] - f.a[1]) * t
      if (i > 0 && i < n) lines.push(<polyline key={`d${i}`} points={pts([[x, y, f.z0 + 0.5], [x, y, f.z1 - 0.5]])} />)
      if (i < n) {
        const t2 = (i + 0.5) / n
        const hx = f.a[0] + (f.b[0] - f.a[0]) * t2
        const hy = f.a[1] + (f.b[1] - f.a[1]) * t2
        const ux = (f.b[0] - f.a[0]) / len
        const uy = (f.b[1] - f.a[1]) / len
        lines.push(
          <polyline
            key={`h${i}`}
            strokeWidth={sw * 2.2}
            stroke="#b4b4bb"
            points={pts([
              [hx - ux * 3, hy - uy * 3, f.z1 - 4.5],
              [hx + ux * 3, hy + uy * 3, f.z1 - 4.5],
            ])}
          />,
        )
      }
    }
    lines.push(
      <polyline
        key="drawer"
        points={pts([
          [f.a[0], f.a[1], f.z1 - 7],
          [f.b[0], f.b[1], f.z1 - 7],
        ])}
      />,
    )
    return lines
  }

  const cutouts = d.cutouts.map((c) => {
    const r = cutoutRect(d, c)
    const x0 = flipped ? bw - (r.x + r.w) : r.x
    return { c, x0, y0: r.y, w: r.w, h: r.h }
  })

  function ellipse(cx: number, cy: number, rad: number, z: number) {
    const ring: V3[] = []
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2
      ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z])
    }
    return pts(ring)
  }

  const splashT = 0.75
  const splash: Point[] = [
    [mx(0), 0],
    [mx(d.length), 0],
    [mx(d.length), splashT],
    [mx(0), splashT],
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-100 via-neutral-50 to-white">
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="h-full w-full" role="img" aria-label="3D preview of the countertop">
        <defs>
          <StoneFilter id={`stone-${uid}`} material={material} unitsPerInch={1} />
          <clipPath id={`top-${uid}`}>
            <polygon points={pts(outline.map(([x, y]) => [x, y, top]))} />
          </clipPath>
          <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={vb.w / 120} />
          </filter>
          <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={isDark ? 0.14 : 0.35} />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Floor shadow */}
        <polygon
          points={pts(inset(outline, normals, outline.map(() => -6)).map(([x, y]) => [x + 6, y + 6, 0]))}
          fill="#000"
          opacity={0.12}
          filter={`url(#shadow-${uid})`}
        />

        {/* Cabinets */}
        <g stroke="#d8d6d0" strokeWidth={sw} strokeLinejoin="round">
          {toeFaces.map((f) => (
            <polygon key={f.key} points={pts(f.points)} fill="#3f3f46" stroke="#3f3f46" />
          ))}
          {bodyFaces.map((f) => (
            <g key={f.key}>
              <polygon points={pts(f.points)} fill={f.normal[1] > 0.5 ? '#f7f5f0' : '#e9e6df'} />
              <g fill="none" stroke="#d3d0c8" strokeWidth={sw * 1.1}>
                {doorLines(f)}
              </g>
            </g>
          ))}
        </g>

        {/* Stone edges */}
        {stoneFaces.map((f) => (
          <polygon
            key={f.key}
            points={pts(f.points)}
            fill={shade(front, f.normal[1] > 0.5 ? (isDark ? 0.25 : -0.1) : isDark ? 0.1 : -0.18)}
            stroke={shade(front, isDark ? 0.4 : -0.3)}
            strokeWidth={sw * 0.8}
            strokeLinejoin="round"
          />
        ))}

        {/* Stone top */}
        <g clipPath={`url(#top-${uid})`}>
          <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={front} />
          <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} filter={`url(#stone-${uid})`} />
          <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={`url(#sheen-${uid})`} />
        </g>
        <polygon
          points={pts(outline.map(([x, y]) => [x, y, top]))}
          fill="none"
          stroke={shade(front, isDark ? 0.5 : -0.25)}
          strokeWidth={sw}
          strokeLinejoin="round"
        />

        {/* Cut-outs */}
        {cutouts.map(({ c, x0, y0, w, h }) => {
          const z = top + 0.02
          if (c.type === 'faucet') {
            const n = c.holeCount ?? 1
            const rad = c.width / 2
            const cy = y0 + h / 2
            const holes = Array.from({ length: n }, (_, i) => (flipped ? x0 + w - rad - i * 4 : x0 + rad + i * 4))
            const mid = holes[Math.floor(n / 2)]
            return (
              <g key={c.id}>
                {holes.map((cx, i) => (
                  <polygon key={i} points={ellipse(cx, cy, rad, z)} fill="#27272a" />
                ))}
                <polyline
                  points={pts([
                    [mid, cy, z],
                    [mid, cy, z + 13],
                    [mid, cy + 7, z + 13],
                    [mid, cy + 8, z + 9],
                  ])}
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth={sw * 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )
          }
          const rect: V3[] = [
            [x0, y0, z],
            [x0 + w, y0, z],
            [x0 + w, y0 + h, z],
            [x0, y0 + h, z],
          ]
          if (c.type === 'cooktop') {
            return (
              <g key={c.id}>
                <polygon points={pts(rect)} fill="#18181b" stroke="#52525b" strokeWidth={sw} />
                {[
                  [0.27, 0.3, 0.17],
                  [0.73, 0.3, 0.13],
                  [0.27, 0.72, 0.13],
                  [0.73, 0.72, 0.17],
                ].map(([fx, fy, fr], i) => (
                  <polygon
                    key={i}
                    points={ellipse(x0 + w * fx, y0 + h * fy, Math.min(w, h) * fr, z + 0.01)}
                    fill="none"
                    stroke="#71717a"
                    strokeWidth={sw * 1.2}
                  />
                ))}
              </g>
            )
          }
          const lip = 1
          return (
            <g key={c.id}>
              <polygon points={pts(rect)} fill="#a1a1aa" />
              <polygon
                points={pts([
                  [x0 + lip, y0 + lip, z - 7],
                  [x0 + w - lip, y0 + lip, z - 7],
                  [x0 + w - lip, y0 + h - lip, z - 7],
                  [x0 + lip, y0 + h - lip, z - 7],
                ])}
                fill="#d4d4d8"
              />
              <polygon points={ellipse(x0 + w / 2, y0 + h * 0.6, 1.6, z - 7)} fill="#52525b" />
            </g>
          )
        })}

        {/* Backsplash */}
        {d.backsplash.enabled && (
          <g strokeWidth={sw * 0.8} stroke={shade(front, isDark ? 0.4 : -0.25)} strokeLinejoin="round">
            {sideFaces('splash', splash, [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([x, y]) => [flipped ? -x : x, y] as Point), top, top + d.backsplash.height).map((f) => (
              <polygon key={f.key} points={pts(f.points)} fill={shade(front, f.normal[1] > 0.5 ? (isDark ? 0.18 : -0.06) : isDark ? 0.08 : -0.15)} />
            ))}
            <polygon points={pts(splash.map(([x, y]) => [x, y, top + d.backsplash.height]))} fill={shade(front, isDark ? 0.3 : 0.02)} />
          </g>
        )}
      </svg>

      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur" onClick={() => setFlipped((f) => !f)}>
          <RotateCcw />
          Turn view
        </Button>
      </div>
      <p className="text-muted-foreground absolute bottom-5 left-5 text-xs">Preview only. Not to scale.</p>
    </div>
  )
}
