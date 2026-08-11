import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface FeedbackStateProps {
  icon: ReactNode
  title: string
  description?: string | null
  action?: ReactNode
  className?: string
}

export function FeedbackState({ icon, title, description, action, className }: FeedbackStateProps) {
  return (
    <div
      className={cn('flex min-h-52 items-center justify-center p-6 text-center', className)}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-60">
        <div className="border-border bg-muted/25 text-muted-foreground mx-auto mb-3 flex size-9 items-center justify-center rounded-lg border">
          {icon}
        </div>
        <p className="text-xs font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground mt-1 text-[11px] leading-4">{description}</p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}
