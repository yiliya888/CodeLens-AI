import type { ReviewResult } from '@/types/review'

export type AIProviderName = 'mock' | 'deepseek'

export interface AIProvider {
  reviewCode(code: string, language: string): Promise<ReviewResult>
}
