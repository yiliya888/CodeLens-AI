import { create } from 'zustand'

import type { ReviewResult, ReviewStatus } from '@/types/review'

interface ReviewStore {
  currentResult: ReviewResult | null
  status: ReviewStatus
  selectedIssueId: string | null
  errorMessage: string | null
  streamingContent: string
  currentRequestId: string | null
  startReview: (requestId: string) => void
  startStreaming: (requestId: string) => void
  appendStreamingContent: (requestId: string, content: string) => void
  resetStreamingContent: (requestId: string) => void
  completeReview: (requestId: string, result: ReviewResult) => void
  failReview: (requestId: string, message: string) => void
  cancelReview: (requestId: string) => void
  selectIssue: (issueId: string) => void
  resetReview: () => void
}

const initialState = {
  currentResult: null,
  status: 'idle' as const,
  selectedIssueId: null,
  errorMessage: null,
  streamingContent: '',
  currentRequestId: null,
}

export const useReviewStore = create<ReviewStore>((set) => ({
  ...initialState,
  startReview: (requestId) =>
    set({
      currentResult: null,
      status: 'reviewing',
      selectedIssueId: null,
      errorMessage: null,
      streamingContent: '',
      currentRequestId: requestId,
    }),
  startStreaming: (requestId) =>
    set((state) => (state.currentRequestId === requestId ? { status: 'streaming' } : state)),
  appendStreamingContent: (requestId, content) =>
    set((state) =>
      state.currentRequestId === requestId
        ? { streamingContent: state.streamingContent + content }
        : state,
    ),
  resetStreamingContent: (requestId) =>
    set((state) => (state.currentRequestId === requestId ? { streamingContent: '' } : state)),
  completeReview: (requestId, result) =>
    set((state) =>
      state.currentRequestId === requestId
        ? {
            currentResult: result,
            status: 'completed',
            selectedIssueId: null,
            errorMessage: null,
            streamingContent: '',
            currentRequestId: null,
          }
        : state,
    ),
  failReview: (requestId, message) =>
    set((state) =>
      state.currentRequestId === requestId
        ? {
            currentResult: null,
            status: 'error',
            selectedIssueId: null,
            errorMessage: message,
            streamingContent: '',
            currentRequestId: null,
          }
        : state,
    ),
  cancelReview: (requestId) =>
    set((state) => (state.currentRequestId === requestId ? initialState : state)),
  selectIssue: (issueId) => set({ selectedIssueId: issueId }),
  resetReview: () => set(initialState),
}))
