import { DimensionInput } from '@/components/DimensionInput'
import { Field, SectionTitle } from '@/components/Field'
import { ShapeIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MATERIALS } from '@/lib/catalog'
import type { Drawing, Shape, Thickness, Units } from '@/lib/types'

import { EdgeSelector } from './EdgeSelector'

interface PieceFormProps {
  drawing: Drawing
  units: Units
  onUnitsChange: (u: Units) => void
  onChange: (patch: Partial<Drawing>) => void
}

export function PieceForm({ drawing: d, units, onUnitsChange, onChange }: PieceFormProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Piece */}
      <section className="flex flex-col gap-3.5">
        <SectionTitle>Piece</SectionTitle>
        <Field id="piece-name" label="Name" helper="Shown on the drawing, e.g. Kitchen Island.">
          <Input
            id="piece-name"
            value={d.pieceName}
            onChange={(e) => onChange({ pieceName: e.target.value })}
            className=""
            placeholder="Kitchen Island"
          />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium" id="shape-label">
            Shape
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={d.shape}
            onValueChange={(v) => v && onChange({ shape: v as Shape })}
            className="w-full rounded-[18px]"
            thumbClassName="rounded-[14px]"
            aria-labelledby="shape-label"
          >
            {(['rectangle', 'l-shape'] as Shape[]).map((shape) => (
              <ToggleGroupItem
                key={shape}
                value={shape}
                className="h-14 flex-col gap-0.5 rounded-[14px]"
              >
                <ShapeIcon shape={shape} />
                <span className="text-[12px] font-medium">{shape === 'rectangle' ? 'Rectangle' : 'L-shape'}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </section>

      <Separator />

      {/* Size */}
      <section className="flex flex-col gap-3.5">
        <SectionTitle
          aside={
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={units}
              onValueChange={(v) => v && onUnitsChange(v as Units)}
              aria-label="Units"
            >
              <ToggleGroupItem value="in" className="px-2.5">
                Inches
              </ToggleGroupItem>
              <ToggleGroupItem value="mm" className="px-2.5">
                mm
              </ToggleGroupItem>
            </ToggleGroup>
          }
        >
          Size
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput
            id="length"
            label="Length"
            value={d.length}
            units={units}
            min={6}
            max={240}
            onChange={(length) => onChange({ length })}
            helper="Left end to right end."
          />
          <DimensionInput
            id="depth"
            label="Depth"
            value={d.depth}
            units={units}
            min={6}
            max={120}
            onChange={(depth) => onChange({ depth })}
            helper="Back wall to front edge."
          />
        </div>

        {d.shape === 'l-shape' && (
          <div className="animate-rise grid grid-cols-2 gap-3 rounded-2xl bg-neutral-50 p-3.5">
            <p className="text-muted-foreground col-span-2 text-xs">
              The return is the leg that turns toward you on the right.
            </p>
            <DimensionInput
              id="return-length"
              label="Return depth"
              value={d.returnLength}
              units={units}
              min={6}
              max={240}
              onChange={(returnLength) => onChange({ returnLength })}
              helper="Back wall to the end of the return."
            />
            <DimensionInput
              id="return-width"
              label="Return width"
              value={d.returnWidth}
              units={units}
              min={6}
              max={120}
              onChange={(returnWidth) => onChange({ returnWidth })}
              helper="Side to side."
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium" id="thickness-label">
            Thickness
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={d.thickness}
            onValueChange={(v) => v && onChange({ thickness: v as Thickness })}
            className="w-full"
            aria-labelledby="thickness-label"
          >
            <ToggleGroupItem value="2cm">
              2 cm <span className="text-muted-foreground font-normal">¾"</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="3cm">
              3 cm <span className="text-muted-foreground font-normal">1¼"</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-xs">3 cm is standard for kitchens.</p>
        </div>
      </section>

      <Separator />

      {/* Material */}
      <section className="flex flex-col gap-3.5">
        <SectionTitle>Material</SectionTitle>
        <Field id="material" label="Material and color" helper="Matches the material on the quote.">
          <Select value={d.materialId} onValueChange={(materialId) => onChange({ materialId })}>
            <SelectTrigger id="material" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIALS.map((m) => (
                <SelectItem key={m.id} value={m.id} className="py-2.5">
                  <span
                    className="size-4 rounded-full border border-black/10"
                    style={{ background: m.swatch }}
                  />
                  {m.name}
                  <span className="text-muted-foreground">{m.kind}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>

      <Separator />

      {/* Edges */}
      <section className="flex flex-col gap-3.5">
        <SectionTitle>Edges</SectionTitle>
        <EdgeSelector shape={d.shape} edges={d.edges} onChange={(edges) => onChange({ edges })} />
      </section>

      <Separator />

      {/* Backsplash */}
      <section className="flex flex-col gap-3.5 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="backsplash" className="text-[13px] font-semibold">
              Backsplash
            </label>
            <p className="text-muted-foreground text-xs">A strip of stone along the back wall.</p>
          </div>
          <Switch
            id="backsplash"
            checked={d.backsplash.enabled}
            onCheckedChange={(enabled) => onChange({ backsplash: { ...d.backsplash, enabled } })}
          />
        </div>
        {d.backsplash.enabled && (
          <DimensionInput
            className="animate-rise"
            id="backsplash-height"
            label="Height"
            value={d.backsplash.height}
            units={units}
            min={1}
            max={48}
            onChange={(height) => onChange({ backsplash: { ...d.backsplash, height } })}
            helper='4" is standard. Full height is usually 18".'
          />
        )}
      </section>
    </div>
  )
}
