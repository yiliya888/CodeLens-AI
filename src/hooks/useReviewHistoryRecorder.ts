import { useEffect, useRef } from 'react'

import { useFileStore } from '@/stores/file-store'
import { useHistoryStore } from '@/stores/history-store'
import { useReviewStore } from '@/stores/review-store'
import type { ReviewResult } from '@/types/review'

function createHistoryId() {
  return `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useReviewHistoryRecorder() {
  const activeFile = useFileStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  )
  const status = useReviewStore((state) => state.status)
  const currentResult = useReviewStore((state) => state.currentResult)
  const addHistory = useHistoryStore((state) => state.addHistory)
  const lastRecordedResultRef = useRef<ReviewResult | null>(null)

  useEffect(() => {
    if (status !== 'completed' || !currentResult || !activeFile) return
    if (lastRecordedResultRef.current === currentResult) return

    lastRecordedResultRef.current = currentResult
    addHistory({
      id: createHistoryId(),
      fileId: activeFile.id,
      fileName: activeFile.name,
      score: currentResult.score,
      issues: currentResult.issues.length,
      createdAt: new Date().toISOString(),
      result: currentResult,
    })
  }, [activeFile, addHistory, currentResult, status])
}
