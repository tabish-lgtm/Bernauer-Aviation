import { useState, type FormEvent } from 'react'

import { Field } from '@/components/Field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MATERIALS } from '@/lib/catalog'

interface NewDrawingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (input: { customer: string; project: string; materialId: string }) => void
}

export function NewDrawingDialog({ open, onOpenChange, onCreate }: NewDrawingDialogProps) {
  const [customer, setCustomer] = useState('')
  const [project, setProject] = useState('')
  const [materialId, setMaterialId] = useState(MATERIALS[0].id)
  const [touched, setTouched] = useState(false)

  const error = touched && !customer.trim() ? 'Add the customer name so the drawing can be found later.' : null

  function submit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!customer.trim()) return
    onCreate({ customer: customer.trim(), project: project.trim(), materialId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>New drawing</DialogTitle>
            <DialogDescription>We'll start you with a standard 96" × 25½" countertop.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Field id="customer" label="Customer" error={error}>
              <Input
                id="customer"
                autoFocus
                className="h-11"
                value={customer}
                placeholder="e.g. Hartley Residence"
                aria-invalid={!!error}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </Field>
            <Field id="project" label="Project" helper="Optional. Becomes the piece name on the drawing.">
              <Input
                id="project"
                className="h-11"
                value={project}
                placeholder="e.g. Kitchen Island"
                onChange={(e) => setProject(e.target.value)}
              />
            </Field>
            <Field id="new-material" label="Material">
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger id="new-material" className="h-11 w-full" size="lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="py-2.5">
                      <span className="size-4 rounded-full border border-black/10" style={{ background: m.swatch }} />
                      {m.name}
                      <span className="text-muted-foreground">{m.kind}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Start drawing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
