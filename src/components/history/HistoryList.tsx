import { HistoryCard } from '@/components/history/HistoryCard'
import type { ReviewHistory } from '@/types/history'

interface HistoryListProps {
  histories: ReviewHistory[]
  onOpen: (id: string) => void
  onRemove: (id: string) => void
}

export function HistoryList({ histories, onOpen, onRemove }: HistoryListProps) {
  if (histories.length === 0) {
    return (
      <div className="border-border flex min-h-72 items-center justify-center rounded-lg border border-dashed text-center">
        <div>
          <p className="text-xs font-medium">No review history</p>
          <p className="text-muted-foreground mt-1 text-[11px]">
            完成一次 Code Review 后，记录会显示在这里。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {histories.map((history) => (
        <HistoryCard key={history.id} history={history} onOpen={onOpen} onRemove={onRemove} />
      ))}
    </div>
  )
}
