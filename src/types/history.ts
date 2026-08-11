import type { ReviewResult } from '@/types/review'

export interface ReviewHistory {
  id: string
  fileId: string
  fileName: string
  score: number
  issues: number
  createdAt: string
  result: ReviewResult
}
