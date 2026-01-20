import { cn } from '@/lib/utils'
import { LeliLoader } from './leli-loader'

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

function Spinner({ className, size = "sm", variant = "default" }: SpinnerProps) {
  return (
    <LeliLoader
      size={size}
      variant={variant}
      className={cn(className)}
    />
  )
}

export { Spinner }
