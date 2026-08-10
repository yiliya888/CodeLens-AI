import { AlertTriangle, LoaderCircle, Play, ScanSearch } from 'lucide-react'
import { useEffect } from 'react'

import { IssueList } from '@/components/review/IssueList'
import { ReviewScore } from '@/components/review/ReviewScore'
import { Button } from '@/components/ui/button'
import { reviewCode } from '@/services/reviewService'
import { useFileStore } from '@/stores/file-store'
import { useReviewStore } from '@/stores/review-store'
import type { ReviewStatus } from '@/types/review'
import { cn } from '@/utils/cn'

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'text-muted-foreground' },
  reviewing: { label: 'Reviewing', className: 'text-amber-400' },
  completed: { label: 'Completed', className: 'text-emerald-400' },
  error: { label: 'Error', className: 'text-red-400' },
}

export function ReviewPanel() {
  const activeFile = useFileStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  )
  const currentResult = useReviewStore((state) => state.currentResult)
  const status = useReviewStore((state) => state.status)
  const selectedIssue = useReviewStore((state) => state.selectedIssue)
  const errorMessage = useReviewStore((state) => state.errorMessage)
  const startReview = useReviewStore((state) => state.startReview)
  const completeReview = useReviewStore((state) => state.completeReview)
  const failReview = useReviewStore((state) => state.failReview)
  const selectIssue = useReviewStore((state) => state.selectIssue)
  const resetReview = useReviewStore((state) => state.resetReview)
  const currentStatus = statusConfig[status]

  useEffect(() => {
    resetReview()
  }, [activeFile?.id, resetReview])

  async function handleReview() {
    if (!activeFile) return

    const reviewedFileId = activeFile.id
    startReview()
    try {
      const result = await reviewCode(activeFile.content, activeFile.language)
      if (useFileStore.getState().activeFileId !== reviewedFileId) return
      completeReview(result)
    } catch {
      if (useFileStore.getState().activeFileId !== reviewedFileId) return
      failReview('Review 未能完成，请稍后重试。')
    }
  }

  return (
    <aside className="border-border bg-panel flex min-h-72 w-full shrink-0 flex-col border-t lg:min-h-0 lg:w-88 lg:border-t-0 lg:border-l xl:w-96">
      <div className="border-border shrink-0 border-b p-3">
        <div className="flex items-center gap-2">
          <ScanSearch className="text-muted-foreground size-4" />
          <h1 className="text-xs font-semibold">Code Review</h1>
          <span className={cn('ml-auto text-[10px] font-medium', currentStatus.className)}>
            {currentStatus.label}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-[11px]">
              {activeFile?.name ?? 'No active file'}
            </p>
          </div>
          <Button
            size="sm"
            className="h-7 px-2.5 text-[11px]"
            onClick={() => void handleReview()}
            disabled={!activeFile || status === 'reviewing'}
          >
            {status === 'reviewing' ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Play className="fill-current" />
            )}
            {status === 'reviewing' ? 'Reviewing' : 'Review'}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {status === 'idle' && (
          <div className="flex h-full min-h-52 items-center justify-center text-center">
            <div className="max-w-52">
              <div className="border-border bg-muted/25 mx-auto mb-3 flex size-9 items-center justify-center rounded-lg border">
                <ScanSearch className="text-muted-foreground size-4" />
              </div>
              <p className="text-xs font-medium">Ready for review</p>
              <p className="text-muted-foreground mt-1 text-[11px] leading-4">
                运行 Review，查看当前文件的质量评分和问题列表。
              </p>
            </div>
          </div>
        )}

        {status === 'reviewing' && (
          <div className="flex h-full min-h-52 items-center justify-center text-center">
            <div>
              <LoaderCircle className="text-muted-foreground mx-auto mb-3 size-5 animate-spin" />
              <p className="text-xs font-medium">Reviewing code…</p>
              <p className="text-muted-foreground mt-1 text-[11px]">正在生成 Mock Review 结果</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex h-full min-h-52 items-center justify-center text-center">
            <div className="max-w-52">
              <AlertTriangle className="mx-auto mb-3 size-5 text-red-400" />
              <p className="text-xs font-medium">Review failed</p>
              <p className="text-muted-foreground mt-1 text-[11px] leading-4">{errorMessage}</p>
            </div>
          </div>
        )}

        {status === 'completed' && currentResult && (
          <div className="space-y-4">
            <ReviewScore score={currentResult.score} summary={currentResult.summary} />
            <IssueList
              issues={currentResult.issues}
              selectedIssue={selectedIssue}
              onSelectIssue={selectIssue}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
