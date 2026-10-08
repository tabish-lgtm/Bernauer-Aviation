import * as React from 'react'
import { Toggle as TogglePrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-white data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:shadow-black/10 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:ring-4 focus-visible:ring-neutral-900/10 outline-none transition-[color,background-color,box-shadow] duration-200 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        // Segmented: the sliding thumb in ToggleGroup paints the active state.
        outline:
          'relative z-[1] bg-transparent data-[state=on]:bg-transparent data-[state=on]:shadow-none',
      },
      size: {
        default: 'h-[30px] px-3 min-w-9 text-[13px]',
        sm: 'h-[26px] px-2.5 min-w-8 text-[13px]',
        lg: 'h-9 px-3 min-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Toggle, toggleVariants }
