import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-body font-medium',
          'transition-all duration-150 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
          'disabled:pointer-events-none disabled:opacity-40 select-none',
          // Variants
          variant === 'primary' && [
            'bg-accent-500 text-text-inverse',
            'hover:bg-accent-600 active:bg-accent-700',
            'shadow-glow-sm hover:shadow-glow-accent',
          ],
          variant === 'secondary' && [
            'bg-bg-elevated text-text-primary border border-border',
            'hover:bg-bg-overlay hover:border-border-strong',
          ],
          variant === 'ghost' && [
            'text-text-secondary hover:text-text-primary',
            'hover:bg-bg-elevated',
          ],
          variant === 'outline' && [
            'border border-border text-text-primary',
            'hover:bg-bg-elevated hover:border-border-strong',
          ],
          variant === 'danger' && [
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
          ],
          // Sizes
          size === 'sm' && 'h-8 px-3 text-sm rounded',
          size === 'md' && 'h-10 px-4 text-sm rounded-md',
          size === 'lg' && 'h-12 px-6 text-base rounded-lg',
          size === 'icon' && 'h-9 w-9 rounded-md',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button }
