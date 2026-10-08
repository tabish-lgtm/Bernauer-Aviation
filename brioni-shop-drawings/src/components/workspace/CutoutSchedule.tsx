import { edgeProfileName } from '@/lib/catalog'
import { cutoutLabels, edgeSegments } from '@/lib/geometry'
import type { Drawing, EdgeId, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'

const EDGE_SHORT: Record<EdgeId, string> = {
  back: 'Back',
  right: 'Right end',
  front: 'Front',
  left: 'Left end',
  returnEnd: 'Return end',
  returnInside: 'Return inside',
}

/** Printed under the drawing: a plain schedule the shop can tick off. */
export function CutoutSchedule({ drawing, units }: { drawing: Drawing; units: Units }) {
  const fmt = (n: number) => formatLength(n, units)
  const labels = cutoutLabels(drawing.cutouts)
  return (
    <div className="grid grid-cols-2 gap-8 pt-4 text-xs">
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-sm font-semibold">Cut-outs</caption>
        <thead>
          <tr className="border-b text-left">
            <th className="py-1 font-medium">Item</th>
            <th className="py-1 font-medium">Size</th>
            <th className="py-1 font-medium">From left</th>
            <th className="py-1 font-medium">From front</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {drawing.cutouts.length === 0 && (
            <tr>
              <td className="py-1 font-sans" colSpan={4}>
                None
              </td>
            </tr>
          )}
          {drawing.cutouts.map((c) => (
            <tr key={c.id} className="border-b border-neutral-200">
              <td className="py-1 font-sans">{labels[c.id]}</td>
              <td className="py-1">
                {c.type === 'faucet' ? `${c.holeCount ?? 1} × ${fmt(c.width)}` : `${fmt(c.width)} × ${fmt(c.depth)}`}
              </td>
              <td className="py-1">{fmt(c.fromLeft)}</td>
              <td className="py-1">{fmt(c.fromFront)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-sm font-semibold">Edges</caption>
        <tbody>
          {edgeSegments(drawing).map((s) => (
            <tr key={s.id} className="border-b border-neutral-200">
              <td className="py-1">{EDGE_SHORT[s.id]}</td>
              <td className="py-1 font-medium">{edgeProfileName(drawing.edges[s.id])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
