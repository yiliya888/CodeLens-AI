import { ChevronRight, Clock3, FileCode2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ReviewHistory } from '@/types/history'

interface HistoryCardProps {
  history: ReviewHistory
  onOpen: (id: string) => void
  onRemove: (id: string) => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function HistoryCard({ history, onOpen, onRemove }: HistoryCardProps) {
  return (
    <article className="group border-border bg-card hover:bg-muted/25 flex items-center gap-3 rounded-lg border p-3 transition-colors">
      <div className="border-border bg-muted/30 flex size-9 shrink-0 items-center justify-center rounded-md border">
        <FileCode2 className="size-4 text-sky-400" />
      </div>

      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onOpen(history.id)}>
        <h2 className="truncate text-xs font-medium">{history.fileName}</h2>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
          <span className="font-medium text-emerald-500">{history.score}/100</span>
          <span>{history.issues} issues</span>
          <span className="flex items-center gap-1">
            <Clock3 className="size-3" />
            {formatDate(history.createdAt)}
          </span>
        </div>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        onClick={() => onRemove(history.id)}
        aria-label={`删除 ${history.fileName} 的 Review 记录`}
      >
        <Trash2 className="size-3.5" />
      </Button>
      <ChevronRight className="text-muted-foreground size-3.5" />
    </article>
  )
}
