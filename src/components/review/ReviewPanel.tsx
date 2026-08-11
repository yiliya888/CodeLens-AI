import { AlertTriangle, LoaderCircle, Play, ScanSearch } from 'lucide-react'

import { FixPreview } from '@/components/diff/FixPreview'
import { IssueList } from '@/components/review/IssueList'
import { ReviewScore } from '@/components/review/ReviewScore'
import { Button } from '@/components/ui/button'
import { FeedbackState } from '@/components/ui/feedback-state'
import { useCodeFix } from '@/hooks/useCodeFix'
import { useEditorMarkers } from '@/hooks/useEditorMarkers'
import { useEditorNavigation } from '@/hooks/useEditorNavigation'
import { useReview } from '@/hooks/useReview'
import { useFileStore } from '@/stores/file-store'
import type { ReviewIssue, ReviewStatus } from '@/types/review'
import { cn } from '@/utils/cn'

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'text-muted-foreground' },
  reviewing: { label: 'Connecting', className: 'text-amber-400' },
  streaming: { label: 'Streaming', className: 'text-sky-400' },
  completed: { label: 'Completed', className: 'text-emerald-400' },
  error: { label: 'Error', className: 'text-red-400' },
}

const EMPTY_ISSUES: ReviewIssue[] = []

export function ReviewPanel() {
  const activeFile = useFileStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  )
  const {
    currentResult,
    status,
    selectedIssueId,
    errorMessage,
    streamingContent,
    isLoading,
    review,
    selectIssue,
  } = useReview(activeFile)
  const currentStatus = statusConfig[status]
  const issues = currentResult?.issues ?? EMPTY_ISSUES
  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) ?? null
  const { navigateToIssue } = useEditorNavigation(selectedIssue)
  const { preview, openFix, acceptFix, rejectFix } = useCodeFix(activeFile)

  useEditorMarkers(issues)

  function handleSelectIssue(issue: ReviewIssue) {
    selectIssue(issue.id)
    navigateToIssue(issue)
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
          <p className="text-muted-foreground min-w-0 flex-1 truncate text-[11px]">
            {activeFile?.name ?? 'No active file'}
          </p>
          <Button
            size="sm"
            className="h-7 px-2.5 text-[11px]"
            onClick={() => void review()}
            disabled={!activeFile || isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Play className="fill-current" />
            )}
            {isLoading ? 'Reviewing' : 'Review'}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {status === 'idle' && (
          <FeedbackState
            className="h-full"
            icon={<ScanSearch className="size-4" />}
            title="Ready for review"
            description="运行 Review，查看当前文件的质量评分和问题列表。"
          />
        )}

        {status === 'reviewing' && (
          <FeedbackState
            className="h-full"
            icon={<LoaderCircle className="size-4 animate-spin" />}
            title="Starting review"
            description="正在建立安全的流式连接…"
          />
        )}

        {status === 'streaming' && (
          <div
            className="border-border bg-muted/10 min-h-52 rounded-lg border p-3"
            role="status"
            aria-live="polite"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-medium">
              <LoaderCircle className="size-3.5 animate-spin text-sky-400" />
              Streaming Review
            </div>
            <pre className="text-muted-foreground font-mono text-[10px] leading-4 break-words whitespace-pre-wrap">
              {streamingContent || 'Waiting for model output…'}
            </pre>
          </div>
        )}

        {status === 'error' && (
          <FeedbackState
            className="h-full"
            icon={<AlertTriangle className="size-4 text-red-400" />}
            title="Review failed"
            description={errorMessage || '连接暂时不可用，请稍后重试。'}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => void review()}
                disabled={!activeFile}
              >
                Retry
              </Button>
            }
          />
        )}

        {status === 'completed' && currentResult && (
          <div className="space-y-4">
            <ReviewScore score={currentResult.score} summary={currentResult.summary} />
            <IssueList
              issues={issues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={handleSelectIssue}
              onFixIssue={openFix}
            />
          </div>
        )}
      </div>

      {preview && activeFile && (
        <FixPreview
          fileName={preview.fileName}
          language={activeFile.language}
          suggestion={preview.suggestion}
          onAccept={acceptFix}
          onReject={rejectFix}
        />
      )}
    </aside>
  )
}
