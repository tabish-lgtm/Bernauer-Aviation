import * as React from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { toggleVariants } from '@/components/ui/toggle'

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
})

type Thumb = { x: number; y: number; w: number; h: number }

/**
 * The "outline" variant renders as a segmented control: a soft grey track and
 * a white thumb that slides to the selected item.
 */
function ToggleGroup({
  className,
  thumbClassName,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & { thumbClassName?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = React.useState<Thumb | null>(null)
  const segmented = variant === 'outline'

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!segmented || !el) return
    const measure = () => {
      const on = el.querySelector<HTMLElement>('[data-slot=toggle-group-item][data-state=on]')
      setThumb(on ? { x: on.offsetLeft, y: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight } : null)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const mo = new MutationObserver(measure)
    mo.observe(el, { attributes: true, subtree: true, attributeFilter: ['data-state'] })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [segmented])

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        'group/toggle-group relative flex w-fit items-center gap-0.5 rounded-full data-[variant=outline]:bg-muted data-[variant=outline]:p-[3px]',
        className,
      )}
      {...props}
    >
      {segmented && thumb && (
        <span
          aria-hidden
          data-thumb
          className={cn(
            'pointer-events-none absolute top-0 left-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
            thumbClassName,
          )}
          style={{ width: thumb.w, height: thumb.h, transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
        />
      )}
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'min-w-0 flex-1 shrink-0 focus:z-10 focus-visible:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
