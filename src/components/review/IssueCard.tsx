import { AlertCircle, Info, ShieldAlert, TriangleAlert } from 'lucide-react'

import type { ReviewIssue } from '@/types/review'
import { cn } from '@/utils/cn'

interface IssueCardProps {
  issue: ReviewIssue
  isSelected: boolean
  onSelect: (issue: ReviewIssue) => void
}

const severityConfig = {
  error: {
    icon: ShieldAlert,
    color: 'text-red-400',
    background: 'bg-red-500/10',
    border: 'border-red-500/25',
  },
  warning: {
    icon: TriangleAlert,
    color: 'text-amber-400',
    background: 'bg-amber-500/10',
    border: 'border-amber-500/25',
  },
  info: {
    icon: Info,
    color: 'text-sky-400',
    background: 'bg-sky-500/10',
    border: 'border-sky-500/25',
  },
} as const

export function IssueCard({ issue, isSelected, onSelect }: IssueCardProps) {
  const config = severityConfig[issue.severity]
  const SeverityIcon = config.icon

  return (
    <button
      type="button"
      className={cn(
        'bg-muted/10 hover:bg-muted/25 w-full rounded-lg border p-3 text-left transition-colors',
        isSelected ? config.border : 'border-border',
      )}
      onClick={() => onSelect(issue)}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md',
            config.background,
            config.color,
          )}
        >
          <SeverityIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs leading-5 font-medium">{issue.title}</h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px]">
            <span className={cn('capitalize', config.color)}>{issue.severity}</span>
            <span>·</span>
            <span className="capitalize">{issue.category}</span>
            <span>·</span>
            <span>Line {issue.line}</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-2.5 text-[11px] leading-4.5">{issue.description}</p>

      <div className="border-border/70 bg-background/50 mt-2.5 rounded-md border p-2.5">
        <div className="text-foreground mb-1 flex items-center gap-1.5 text-[10px] font-medium">
          <AlertCircle className="text-muted-foreground size-3" />
          修改建议
        </div>
        <p className="text-muted-foreground text-[10px] leading-4">{issue.suggestion}</p>
      </div>
    </button>
  )
}
