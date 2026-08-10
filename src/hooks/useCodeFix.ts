import { useState } from 'react'

import { useFileStore } from '@/stores/file-store'
import { useReviewStore } from '@/stores/review-store'
import type { CodeFile } from '@/types/editor'
import type { FixSuggestion, ReviewIssue } from '@/types/review'

interface FixPreviewState {
  fileId: string
  fileName: string
  suggestion: FixSuggestion
}

export function useCodeFix(activeFile: CodeFile | undefined) {
  const [preview, setPreview] = useState<FixPreviewState | null>(null)
  const updateFileContent = useFileStore((state) => state.updateFileContent)
  const resetReview = useReviewStore((state) => state.resetReview)
  const activePreview = preview?.fileId === activeFile?.id ? preview : null

  function openFix(issue: ReviewIssue) {
    if (!activeFile || !issue.fixSuggestion) return

    setPreview({
      fileId: activeFile.id,
      fileName: activeFile.name,
      suggestion: issue.fixSuggestion,
    })
  }

  function acceptFix() {
    if (!preview) return

    const fileState = useFileStore.getState()
    if (fileState.activeFileId !== preview.fileId) {
      setPreview(null)
      return
    }

    updateFileContent(preview.fileId, preview.suggestion.after)
    setPreview(null)
    resetReview()
  }

  function rejectFix() {
    setPreview(null)
  }

  return {
    preview: activePreview,
    openFix,
    acceptFix,
    rejectFix,
  }
}
