import { History } from 'lucide-react'

import { HistoryCard } from '@/components/history/HistoryCard'
import { FeedbackState } from '@/components/ui/feedback-state'
import type { ReviewHistory } from '@/types/history'

interface HistoryListProps {
  histories: ReviewHistory[]
  onOpen: (id: string) => void
  onRemove: (id: string) => void
}

export function HistoryList({ histories, onOpen, onRemove }: HistoryListProps) {
  if (histories.length === 0) {
    return (
      <FeedbackState
        className="border-border min-h-72 rounded-lg border border-dashed"
        icon={<History className="size-4" />}
        title="No review history"
        description="完成一次 Code Review 后，记录会显示在这里。"
      />
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
