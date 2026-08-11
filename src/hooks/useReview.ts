import { useEffect } from 'react'

import { reviewCode } from '@/services/ai/reviewService'
import { useFileStore } from '@/stores/file-store'
import { useReviewStore } from '@/stores/review-store'
import type { CodeFile } from '@/types/editor'

function createRequestId() {
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useReview(activeFile: CodeFile | undefined) {
  const currentResult = useReviewStore((state) => state.currentResult)
  const status = useReviewStore((state) => state.status)
  const selectedIssueId = useReviewStore((state) => state.selectedIssueId)
  const errorMessage = useReviewStore((state) => state.errorMessage)
  const startReview = useReviewStore((state) => state.startReview)
  const completeReview = useReviewStore((state) => state.completeReview)
  const failReview = useReviewStore((state) => state.failReview)
  const cancelReview = useReviewStore((state) => state.cancelReview)
  const selectIssue = useReviewStore((state) => state.selectIssue)
  const resetReview = useReviewStore((state) => state.resetReview)

  useEffect(() => {
    resetReview()
  }, [activeFile?.id, resetReview])

  async function review() {
    if (!activeFile) return

    const requestId = createRequestId()
    const reviewedFileId = activeFile.id
    const reviewedContent = activeFile.content

    startReview(requestId)

    try {
      const result = await reviewCode(reviewedContent, activeFile.language)
      const latestFileState = useFileStore.getState()
      const latestFile = latestFileState.files.find((file) => file.id === reviewedFileId)
      const isCurrentSnapshot =
        latestFileState.activeFileId === reviewedFileId && latestFile?.content === reviewedContent

      if (!isCurrentSnapshot) {
        cancelReview(requestId)
        return
      }

      completeReview(requestId, result)
    } catch {
      failReview(requestId, 'Review 未能完成，请稍后重试。')
    }
  }

  return {
    currentResult,
    status,
    selectedIssueId,
    errorMessage,
    isLoading: status === 'reviewing',
    review,
    selectIssue,
  }
}
