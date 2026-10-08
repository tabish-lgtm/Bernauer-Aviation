import { MIN_STONE, SLAB_SIZES } from './catalog'
import {
  boundingSize,
  clearances,
  cutoutLabels,
  cutoutRect,
  rectGap,
  rectsOverlap,
} from './geometry'
import type { Drawing, Units } from './types'
import { formatLength } from './units'

export interface Issue {
  id: string
  /** "problem" means the drawing is wrong; "caution" means double-check it. */
  level: 'problem' | 'caution'
  title: string
  detail: string
  cutoutIds: string[]
}

const SIDE_WORD = { left: 'left', right: 'right', back: 'back', front: 'front' } as const
type Side = keyof typeof SIDE_WORD

export function validateDrawing(d: Drawing, units: Units): Issue[] {
  const issues: Issue[] = []
  const fmt = (n: number) => formatLength(n, units)
  const labels = cutoutLabels(d.cutouts)

  // Slab size
  const { w, h } = boundingSize(d)
  const slab = SLAB_SIZES[d.slabSize]
  const fits = (w <= slab.length && h <= slab.depth) || (w <= slab.depth && h <= slab.length)
  if (!fits) {
    issues.push({
      id: 'slab',
      level: 'caution',
      title: 'Needs a seam',
      detail: `At ${fmt(w)} × ${fmt(h)} this piece is bigger than one ${fmt(slab.length)} × ${fmt(slab.depth)} slab. We've placed a seam for you, away from the cut-outs. Check it on the Slab step.`,
      cutoutIds: [],
    })
  }

  if (d.shape === 'l-shape') {
    if (d.returnLength <= d.depth) {
      issues.push({
        id: 'return-length',
        level: 'problem',
        title: 'Return leg is too short',
        detail: `The return must reach further forward than the counter depth (${fmt(d.depth)}).`,
        cutoutIds: [],
      })
    }
    if (d.returnWidth >= d.length) {
      issues.push({
        id: 'return-width',
        level: 'problem',
        title: 'Return leg is too wide',
        detail: `The return must be narrower than the overall length (${fmt(d.length)}).`,
        cutoutIds: [],
      })
    }
  }

  const rects = d.cutouts.map((c) => ({ c, r: cutoutRect(d, c) }))

  for (const { c, r } of rects) {
    const name = labels[c.id]
    const cl = clearances(d, r)
    const sides: Side[] = ['front', 'back', 'left', 'right']
    const outside = sides.filter((s) => cl[s] < -0.001)
    if (outside.length > 0) {
      issues.push({
        id: `edge-${c.id}`,
        level: 'problem',
        title: `${name} runs off the stone`,
        detail: `It crosses the ${joinWords(outside.map((s) => SIDE_WORD[s]))} edge. Move it or make it smaller.`,
        cutoutIds: [c.id],
      })
      continue
    }
    const thin = sides.filter((s) => cl[s] < MIN_STONE - 0.001)
    if (thin.length > 0) {
      const worst = thin.reduce((a, b) => (cl[a] < cl[b] ? a : b))
      issues.push({
        id: `thin-${c.id}`,
        level: 'caution',
        title: `Thin stone near the ${name.toLowerCase()}`,
        detail: `Only ${fmt(cl[worst])} of stone on the ${joinWords(thin.map((s) => SIDE_WORD[s]))} side. Leave at least ${fmt(MIN_STONE)} so it doesn't crack.`,
        cutoutIds: [c.id],
      })
    }
  }

  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i]
      const b = rects[j]
      const pair = `${labels[a.c.id]} and ${labels[b.c.id].toLowerCase()}`
      if (rectsOverlap(a.r, b.r)) {
        issues.push({
          id: `overlap-${a.c.id}-${b.c.id}`,
          level: 'problem',
          title: `${pair} overlap`,
          detail: 'Move one of them so they no longer touch.',
          cutoutIds: [a.c.id, b.c.id],
        })
      } else {
        const gap = rectGap(a.r, b.r)
        if (gap < MIN_STONE - 0.001) {
          issues.push({
            id: `gap-${a.c.id}-${b.c.id}`,
            level: 'caution',
            title: `${pair} are close together`,
            detail: `Only ${fmt(gap)} of stone between them. Leave at least ${fmt(MIN_STONE)}.`,
            cutoutIds: [a.c.id, b.c.id],
          })
        }
      }
    }
  }

  return issues
}

function joinWords(words: string[]) {
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
}
