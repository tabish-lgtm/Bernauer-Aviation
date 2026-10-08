import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { CUTOUT_SPECS, FAUCET_SPACING, THICKNESS_LABEL, edgeProfileName, getMaterial } from '@/lib/catalog'
import {
  boundingSize,
  clearances,
  cutoutLabels,
  cutoutRect,
  edgeSegments,
  lShapeSizes,
  offsetsFromPosition,
  outlinePoints,
  type Rect,
} from '@/lib/geometry'
import type { Cutout, Drawing, Units } from '@/lib/types'
import { formatLength, snapEighth } from '@/lib/units'
import type { Seam } from '@/lib/slab'
import type { Issue } from '@/lib/validation'

/* Drawing palette. Kept as literal colors so the SVG prints exactly as seen. */
const INK = '#18181b'
const MUTED = '#a1a1aa'
const ACCENT = '#4353c9'
const ACCENT_SOFT = '#eef0fc'
const SEAM = '#e11d48'
const CAUTION = '#b45309'
const PROBLEM = '#dc2626'
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace'
const SANS = '"Inter Variable", ui-sans-serif, system-ui, sans-serif'

const VW = 1000
const TITLE_H = 64
/** Tallest the piece itself may be drawn, so long thin pieces and deep ones both fit. */
const MAX_PIECE_H = 460

interface DrawingCanvasProps {
  drawing: Drawing
  units: Units
  quoteNumber: string
  date: string
  issues: Issue[]
  seams?: Seam[]
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  onMoveCutout?: (id: string, offsets: { fromLeft: number; fromFront: number }) => void
  onEditCutout?: (id: string) => void
}

export function DrawingCanvas({
  drawing: d,
  units,
  quoteNumber,
  date,
  issues,
  seams = [],
  selectedId = null,
  onSelect,
  onMoveCutout,
  onEditCutout,
}: DrawingCanvasProps) {
  const uid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{
    id: string
    clientX: number
    clientY: number
    inchesPerPx: number
    rectX: number
    rectY: number
  } | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const interactive = !!onMoveCutout

  const fmt = (n: number) => formatLength(n, units)
  // Dimension labels drop "mm" (the title block states the units); inches keep their ".
  const dim = (n: number) => formatLength(n, units, units === 'in')
  const material = getMaterial(d.materialId)
  const { w: bw, h: bh } = boundingSize(d)
  const isL = d.shape === 'l-shape'
  const { returnLength, returnWidth } = lShapeSizes(d)

  // ── Layout: fit the piece into the sheet, leaving room for dimensions ──
  const hasSplash = d.backsplash.enabled
  const pad = {
    left: 120,
    right: isL ? 120 : 80,
    top: 92 + (hasSplash ? 52 : 0),
    bottom: isL ? 100 : 64,
  }
  const availW = VW - pad.left - pad.right
  const s = Math.min(availW / bw, MAX_PIECE_H / bh, 14)
  const ox = pad.left + (availW - bw * s) / 2
  const oy = pad.top
  // The sheet is cropped to its content, so the drawing fills the canvas.
  const titleY = oy + bh * s + pad.bottom
  const VH = titleY + TITLE_H + 16
  const X = (inches: number) => ox + inches * s
  const Y = (inches: number) => oy + inches * s

  const splashGap = 30
  const splashH = Math.min(Math.max(d.backsplash.height * s, 16), 40)
  const topDimY = oy - (hasSplash ? splashGap + splashH + 26 : 44)

  const labels = cutoutLabels(d.cutouts)
  const rects = d.cutouts.map((c) => ({ c, r: cutoutRect(d, c) }))
  const issueLevel = (id: string) => {
    const mine = issues.filter((i) => i.cutoutIds.includes(id))
    if (mine.some((i) => i.level === 'problem')) return 'problem'
    if (mine.length) return 'caution'
    return null
  }

  // ── Dragging ──
  // The screen→drawing transform is captured when the drag starts, so the
  // cut-out keeps tracking the pointer even if the canvas resizes mid-drag
  // (for example when a warning appears underneath it).
  function onPointerDown(e: PointerEvent<SVGGElement>, c: Cutout, r: Rect) {
    onSelect?.(c.id)
    if (!interactive) return
    const ctm = svgRef.current?.getScreenCTM()
    if (!ctm) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {
      id: c.id,
      clientX: e.clientX,
      clientY: e.clientY,
      inchesPerPx: 1 / (ctm.a * s),
      rectX: r.x,
      rectY: r.y,
    }
  }

  function onPointerMove(e: PointerEvent<SVGGElement>, c: Cutout) {
    const st = drag.current
    if (!st || st.id !== c.id) return
    const dxPx = e.clientX - st.clientX
    const dyPx = e.clientY - st.clientY
    if (draggingId !== c.id && Math.hypot(dxPx, dyPx) < 4) return
    setDraggingId(c.id)
    const x = snapEighth(st.rectX + dxPx * st.inchesPerPx)
    const y = snapEighth(st.rectY + dyPx * st.inchesPerPx)
    const next = offsetsFromPosition(d, c, x, y)
    onMoveCutout?.(c.id, { fromLeft: snapEighth(next.fromLeft), fromFront: snapEighth(next.fromFront) })
  }

  function onPointerUp() {
    drag.current = null
    setDraggingId(null)
  }

  function onKeyDown(e: KeyboardEvent<SVGGElement>, c: Cutout) {
    const step = e.shiftKey ? 1 : 0.125
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    if (moves[e.key] && interactive) {
      e.preventDefault()
      const [dl, df] = moves[e.key]
      onMoveCutout?.(c.id, {
        fromLeft: snapEighth(c.fromLeft + dl),
        fromFront: snapEighth(c.fromFront + df),
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onEditCutout?.(c.id)
    } else if (e.key === 'Escape') {
      onSelect?.(null)
    }
  }

  const outline = outlinePoints(d)
    .map(([x, y]) => `${X(x)},${Y(y)}`)
    .join(' ')
  const isDark = ['absolute-black', 'steel-grey'].includes(material.id)

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full select-none print:h-auto"
      role="img"
      aria-label={`Shop drawing of ${d.pieceName}, ${fmt(d.length)} by ${fmt(d.depth)}`}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onSelect?.(null)
      }}
    >
      <defs>
        <marker
          id={`arrow-${uid}`}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,1.5 L10,5 L0,8.5 z" fill="context-stroke" />
        </marker>
        <pattern id={`hatch-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={MUTED} strokeWidth="0.75" strokeOpacity="0.45" />
        </pattern>
      </defs>

      {/* Backsplash, drawn as a separate strip behind the back edge */}
      {hasSplash && (
        <g>
          <rect
            x={X(0)}
            y={oy - splashGap - splashH}
            width={bw * s}
            height={splashH}
            fill={material.swatch}
            fillOpacity={isDark ? 0.16 : 0.5}
            stroke={INK}
            strokeWidth={1}
          />
          <text
            x={X(bw / 2)}
            y={oy - splashGap - splashH / 2}
            dominantBaseline="central"
            textAnchor="middle"
            fontFamily={SANS}
            fontSize={10.5}
            fontWeight={500}
            fill={INK}
          >
            Backsplash · {fmt(d.backsplash.height)} high · {fmt(d.length)} long
          </text>
        </g>
      )}

      {/* Stone */}
      <polygon
        points={outline}
        fill={material.swatch}
        fillOpacity={isDark ? 0.14 : 0.55}
        stroke="none"
      />

      {/* Edges: profiled edges get an inner line, unfinished edges are dashed */}
      {edgeSegments(d).map((seg) => {
        const profile = d.edges[seg.id]
        const [ax, ay] = seg.a
        const [bx, by] = seg.b
        const [nx, ny] = seg.normal
        const raw = profile === 'raw'
        const inset = 3.5
        const horizontal = ay === by
        const mx = X((ax + bx) / 2) + nx * 13
        const my = Y((ay + by) / 2) + ny * 13
        const length = Math.hypot(bx - ax, by - ay) * s
        return (
          <g key={seg.id}>
            <line
              x1={X(ax)}
              y1={Y(ay)}
              x2={X(bx)}
              y2={Y(by)}
              stroke={raw ? MUTED : INK}
              strokeWidth={raw ? 1.25 : 1.75}
              strokeDasharray={raw ? '6 4' : undefined}
              strokeLinecap="square"
            />
            {!raw && (
              <line
                x1={X(ax) - nx * inset}
                y1={Y(ay) - ny * inset}
                x2={X(bx) - nx * inset}
                y2={Y(by) - ny * inset}
                stroke={ACCENT}
                strokeWidth={0.75}
                strokeOpacity={0.7}
              />
            )}
            {length > 50 && (
              <text
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="central"
                transform={horizontal ? undefined : `rotate(-90 ${mx} ${my})`}
                fontFamily={SANS}
                fontSize={9.5}
                fontWeight={600}
                letterSpacing={1}
                fill={raw ? MUTED : ACCENT}
              >
                {edgeProfileName(profile).toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* Overall dimensions */}
      <g>
        <ExtLine x1={X(0)} y1={oy - 4} x2={X(0)} y2={topDimY - 6} />
        <ExtLine x1={X(bw)} y1={oy - 4} x2={X(bw)} y2={topDimY - 6} />
        <Dim x1={X(0)} y1={topDimY} x2={X(bw)} y2={topDimY} label={dim(d.length)} uid={uid} />

        <ExtLine x1={ox - 4} y1={Y(0)} x2={ox - 50} y2={Y(0)} />
        <ExtLine x1={ox - 4} y1={Y(d.depth)} x2={ox - 50} y2={Y(d.depth)} />
        <Dim x1={ox - 44} y1={Y(0)} x2={ox - 44} y2={Y(d.depth)} label={dim(d.depth)} uid={uid} />

        {isL && (
          <>
            <ExtLine x1={X(bw) + 4} y1={Y(0)} x2={X(bw) + 50} y2={Y(0)} />
            <ExtLine x1={X(bw) + 4} y1={Y(returnLength)} x2={X(bw) + 50} y2={Y(returnLength)} />
            <Dim
              x1={X(bw) + 44}
              y1={Y(0)}
              x2={X(bw) + 44}
              y2={Y(returnLength)}
              label={dim(returnLength)}
              uid={uid}
            />

            <ExtLine x1={X(bw - returnWidth)} y1={Y(returnLength) + 4} x2={X(bw - returnWidth)} y2={Y(returnLength) + 50} />
            <ExtLine x1={X(bw)} y1={Y(returnLength) + 4} x2={X(bw)} y2={Y(returnLength) + 50} />
            <Dim
              x1={X(bw - returnWidth)}
              y1={Y(returnLength) + 44}
              x2={X(bw)}
              y2={Y(returnLength) + 44}
              label={dim(returnWidth)}
              uid={uid}
            />

            <ExtLine x1={X(0)} y1={Y(d.depth) + 4} x2={X(0)} y2={Y(d.depth) + 50} />
            <ExtLine x1={X(bw - returnWidth)} y1={Y(d.depth) + 4} x2={X(bw - returnWidth)} y2={Y(d.depth) + 50} />
            <Dim
              x1={X(0)}
              y1={Y(d.depth) + 44}
              x2={X(bw - returnWidth)}
              y2={Y(d.depth) + 44}
              label={dim(bw - returnWidth)}
              uid={uid}
            />
          </>
        )}
      </g>

      {/* Cut-out offset dimensions (drawn under the cut-outs) */}
      {rects.map(({ c, r }) => {
        const others = rects.filter((o) => o.c.id !== c.id).map((o) => o.r)
        const cl = clearances(d, r)
        const cy = r.y + r.h / 2
        const cx = r.x + r.w / 2
        const blockedH = (a: number, b: number) =>
          others.some((o) => o.y <= cy && cy <= o.y + o.h && o.x + o.w > a && o.x < b)
        const blockedV = (a: number, b: number) =>
          others.some((o) => o.x <= cx && cx <= o.x + o.w && o.y + o.h > a && o.y < b)

        const useRight = blockedH(cl.leftEdge, r.x) && !blockedH(r.x + r.w, cl.rightEdge)
        const hx1 = useRight ? r.x + r.w : cl.leftEdge
        const hx2 = useRight ? cl.rightEdge : r.x
        const useBack = blockedV(r.y + r.h, cl.frontEdge) && !blockedV(0, r.y)
        const vy1 = useBack ? 0 : r.y + r.h
        const vy2 = useBack ? r.y : cl.frontEdge
        const selected = c.id === selectedId
        const opacity = selectedId && !selected ? 0.45 : 1
        // A cut-out that runs off the stone gets a warning instead of misleading offsets.
        if (Math.min(cl.left, cl.right, cl.back, cl.front) < 0) return null

        return (
          <g key={`dims-${c.id}`} opacity={opacity}>
            {Math.abs(hx2 - hx1) > 0.01 && (
              <Dim
                x1={X(hx1)}
                y1={Y(cy)}
                x2={X(hx2)}
                y2={Y(cy)}
                label={dim(hx2 - hx1)}
                uid={uid}
                color={ACCENT}
                small
                bold={selected}
              />
            )}
            {Math.abs(vy2 - vy1) > 0.01 && (
              <Dim
                x1={X(cx)}
                y1={Y(vy1)}
                x2={X(cx)}
                y2={Y(vy2)}
                label={dim(vy2 - vy1)}
                uid={uid}
                color={ACCENT}
                small
                bold={selected}
              />
            )}
          </g>
        )
      })}

      {/* Cut-outs */}
      {rects.map(({ c, r }) => {
        const selected = c.id === selectedId
        const level = issueLevel(c.id)
        const stroke = level === 'problem' ? PROBLEM : level === 'caution' ? CAUTION : selected ? ACCENT : INK
        const px = X(r.x)
        const py = Y(r.y)
        const pw = r.w * s
        const ph = r.h * s
        const spec = CUTOUT_SPECS[c.type]
        const sizeText =
          c.type === 'faucet'
            ? `${c.holeCount ?? 1} × ${dim(c.width)} hole${(c.holeCount ?? 1) > 1 ? 's' : ''}`
            : `${dim(c.width)} × ${dim(c.depth)}`
        const labelInside = pw > 86 && ph > 38

        return (
          <g
            key={c.id}
            role="button"
            tabIndex={interactive ? 0 : -1}
            aria-label={`${labels[c.id]}, ${sizeText}. Use arrow keys to move, Enter to edit.`}
            className={interactive ? 'outline-none' : undefined}
            style={{
              cursor: interactive ? (draggingId === c.id ? 'grabbing' : 'grab') : 'default',
              touchAction: 'none',
            }}
            onPointerDown={(e) => onPointerDown(e, c, r)}
            onPointerMove={(e) => onPointerMove(e, c)}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={() => onEditCutout?.(c.id)}
            onKeyDown={(e) => onKeyDown(e, c)}
            onFocus={() => onSelect?.(c.id)}
          >
            {selected && (
              <rect
                x={px - 5}
                y={py - 5}
                width={pw + 10}
                height={ph + 10}
                rx={6}
                fill={ACCENT_SOFT}
                fillOpacity={0.6}
                stroke={ACCENT}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            {c.type === 'faucet' ? (
              <>
                <rect x={px - 3} y={py - 3} width={pw + 6} height={ph + 6} fill="transparent" />
                {Array.from({ length: c.holeCount ?? 1 }).map((_, i) => {
                  const rad = (c.width / 2) * s
                  return (
                    <circle
                      key={i}
                      cx={X(r.x + c.width / 2 + i * FAUCET_SPACING)}
                      cy={Y(r.y + c.depth / 2)}
                      r={Math.max(rad, 3)}
                      fill="#fff"
                      stroke={stroke}
                      strokeWidth={1.25}
                    />
                  )
                })}
              </>
            ) : (
              <>
                <rect
                  x={px}
                  y={py}
                  width={pw}
                  height={ph}
                  rx={c.type === 'cooktop' ? 1 : c.type === 'dropin-sink' ? 3 * s : 1.5 * s}
                  fill="#fff"
                  stroke={stroke}
                  strokeWidth={selected ? 1.75 : 1.25}
                />
                {c.type === 'dropin-sink' && (
                  <rect
                    x={px + s}
                    y={py + s}
                    width={Math.max(pw - 2 * s, 0)}
                    height={Math.max(ph - 2 * s, 0)}
                    rx={2.5 * s}
                    fill="none"
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeDasharray="4 3"
                  />
                )}
                {c.type === 'cooktop' &&
                  [
                    [0.16, 0.24],
                    [0.84, 0.24],
                    [0.16, 0.76],
                    [0.84, 0.76],
                  ].map(([fx, fy], i) => (
                    <circle
                      key={i}
                      cx={px + pw * fx}
                      cy={py + ph * fy}
                      r={Math.min(pw, ph) * (i % 3 === 0 ? 0.13 : 0.1)}
                      fill="none"
                      stroke={MUTED}
                      strokeWidth={0.75}
                      strokeOpacity={0.55}
                    />
                  ))}
                {c.type !== 'cooktop' && (
                  <circle
                    cx={px + pw / 2}
                    cy={py + ph * (labelInside ? 0.78 : 0.5)}
                    r={Math.max(1.75 * s, 3)}
                    fill="none"
                    stroke={MUTED}
                    strokeWidth={0.75}
                  />
                )}
              </>
            )}

            {labelInside ? (
              <g pointerEvents="none">
                <text
                  x={px + pw / 2}
                  y={py + ph / 2 - 8}
                  textAnchor="middle"
                  fontFamily={SANS}
                  fontSize={9.5}
                  fontWeight={600}
                  letterSpacing={0.8}
                  fill={MUTED}
                >
                  {(c.type === 'undermount-sink' || c.type === 'dropin-sink'
                    ? spec.name
                    : labels[c.id]
                  ).toUpperCase()}
                </text>
                <text
                  x={px + pw / 2}
                  y={py + ph / 2 + 8}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize={12.5}
                  fontWeight={600}
                  fill={INK}
                >
                  {sizeText}
                </text>
              </g>
            ) : (
              <text
                x={px + pw + 8}
                y={py + ph / 2}
                dominantBaseline="central"
                fontFamily={MONO}
                fontSize={10.5}
                fontWeight={500}
                fill={INK}
                pointerEvents="none"
              >
                {sizeText}
              </text>
            )}
          </g>
        )
      })}

      {/* Seams, placed by the slab layout */}
      {seams.map((seam, i) => {
        const x1 = X(seam.a[0])
        const y1 = Y(seam.a[1])
        const x2 = X(seam.b[0])
        const y2 = Y(seam.b[1])
        return (
          <g key={`seam-${i}`} pointerEvents="none">
            <line x1={x1} y1={y1 - 6} x2={x2} y2={y2 + 6} stroke={SEAM} strokeWidth={1.5} strokeDasharray="7 4" />
            <rect x={x1 - 21} y={(y1 + y2) / 2 - 8} width={42} height={16} rx={8} fill={SEAM} />
            <text
              x={x1}
              y={(y1 + y2) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={SANS}
              fontSize={9}
              fontWeight={700}
              letterSpacing={0.8}
              fill="#fff"
            >
              SEAM
            </text>
          </g>
        )
      })}

      <TitleBlock
        d={d}
        quoteNumber={quoteNumber}
        date={date}
        materialName={material.name.includes(material.kind) ? material.name : `${material.name} ${material.kind}`}
        units={units}
        y={titleY}
      />
    </svg>
  )
}

/* ─────────────────────────── Pieces of the sheet ─────────────────────────── */

function ExtLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={0.75} />
}

function Dim({
  x1,
  y1,
  x2,
  y2,
  label,
  uid,
  color = INK,
  small = false,
  bold = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  uid: string
  color?: string
  small?: boolean
  bold?: boolean
}) {
  const horizontal = Math.abs(y1 - y2) < 0.01
  const fontSize = small ? 11 : 13
  const textW = label.length * fontSize * 0.62 + 8
  const textH = fontSize + 6
  const len = Math.hypot(x2 - x1, y2 - y1)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  // When the line is too short for its label, set the label beside it.
  const fits = len > (horizontal ? textW + 14 : textH + 14)
  const tx = horizontal ? mx : fits ? mx : mx + textW / 2 + 5
  const ty = horizontal ? (fits ? my : my - textH / 2 - 3) : my
  const showArrows = len > 14

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={bold ? 1.25 : 1}
        markerStart={showArrows ? `url(#arrow-${uid})` : undefined}
        markerEnd={showArrows ? `url(#arrow-${uid})` : undefined}
      />
      <rect x={tx - textW / 2} y={ty - textH / 2} width={textW} height={textH} rx={3} fill="#fff" fillOpacity={0.94} />
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={MONO}
        fontSize={fontSize}
        fontWeight={bold ? 700 : 600}
        fill={color}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {label}
      </text>
    </g>
  )
}

function TitleBlock({
  d,
  quoteNumber,
  date,
  materialName,
  units,
  y: TITLE_Y,
}: {
  y: number
  d: Drawing
  quoteNumber: string
  date: string
  materialName: string
  units: Units
}) {
  const x0 = 16
  const width = VW - 32
  const cells: { label: string; value: string; w: number; mono?: boolean }[] = [
    { label: 'Piece', value: d.pieceName || 'Untitled piece', w: 0.2 },
    { label: 'Material', value: materialName, w: 0.2 },
    { label: 'Thickness', value: THICKNESS_LABEL[d.thickness], w: 0.12 },
    { label: 'Quote', value: quoteNumber, w: 0.1, mono: true },
    { label: 'Date', value: date, w: 0.11 },
    { label: 'Scale', value: `Drawn to scale · units ${units === 'in' ? 'inches' : 'mm'}`, w: 0.27 },
  ]
  let cursor = x0
  return (
    <g fontFamily={SANS}>
      <rect x={x0} y={TITLE_Y} width={width} height={TITLE_H} rx={10} fill="#fff" stroke="#e4e4e7" strokeWidth={1} />
      {cells.map((cell, i) => {
        const cx = cursor
        const cw = width * cell.w
        cursor += cw
        return (
          <g key={cell.label}>
            {i > 0 && <line x1={cx} y1={TITLE_Y + 12} x2={cx} y2={TITLE_Y + TITLE_H - 12} stroke="#e4e4e7" />}
            <text x={cx + 14} y={TITLE_Y + 22} fontSize={9} fontWeight={600} letterSpacing={1} fill={MUTED}>
              {cell.label.toUpperCase()}
            </text>
            <text
              x={cx + 14}
              y={TITLE_Y + 44}
              fontSize={13}
              fontWeight={600}
              fill={INK}
              fontFamily={cell.mono ? MONO : SANS}
            >
              {truncate(cell.value, Math.floor(cw / 7.6))}
            </text>
          </g>
        )
      })}
      <text x={VW - 30} y={TITLE_Y - 10} textAnchor="end" fontSize={9.5} fill={MUTED}>
        Brioni Granite · Top view, front edge at bottom · Verify all dimensions on site
      </text>
    </g>
  )
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, Math.max(max - 1, 1))}…` : text
}
