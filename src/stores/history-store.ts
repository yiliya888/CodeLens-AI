import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ReviewHistory } from '@/types/history'

interface HistoryStore {
  histories: ReviewHistory[]
  addHistory: (history: ReviewHistory) => void
  removeHistory: (id: string) => void
  getHistory: (id: string) => ReviewHistory | undefined
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      histories: [],
      addHistory: (history) => set((state) => ({ histories: [history, ...state.histories] })),
      removeHistory: (id) =>
        set((state) => ({
          histories: state.histories.filter((history) => history.id !== id),
        })),
      getHistory: (id) => get().histories.find((history) => history.id === id),
    }),
    {
      name: 'codelens-review-history',
    },
  ),
)
