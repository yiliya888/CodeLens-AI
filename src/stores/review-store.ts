import { create } from 'zustand'

import type { ReviewIssue, ReviewResult, ReviewStatus } from '@/types/review'

interface ReviewStore {
  currentResult: ReviewResult | null
  status: ReviewStatus
  selectedIssue: ReviewIssue | null
  errorMessage: string | null
  startReview: () => void
  completeReview: (result: ReviewResult) => void
  failReview: (message: string) => void
  selectIssue: (issue: ReviewIssue) => void
  resetReview: () => void
}

const initialState = {
  currentResult: null,
  status: 'idle' as const,
  selectedIssue: null,
  errorMessage: null,
}

export const useReviewStore = create<ReviewStore>((set) => ({
  ...initialState,
  startReview: () =>
    set({
      currentResult: null,
      status: 'reviewing',
      selectedIssue: null,
      errorMessage: null,
    }),
  completeReview: (result) =>
    set({
      currentResult: result,
      status: 'completed',
      selectedIssue: null,
      errorMessage: null,
    }),
  failReview: (message) =>
    set({
      currentResult: null,
      status: 'error',
      selectedIssue: null,
      errorMessage: message,
    }),
  selectIssue: (issue) => set({ selectedIssue: issue }),
  resetReview: () => set(initialState),
}))
