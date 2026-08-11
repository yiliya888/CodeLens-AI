import type { ReviewRequest, ReviewResult } from '../types/review.js'

import { reviewWithLLM } from './llmService.js'

export async function reviewCode({ code, language, rules }: ReviewRequest): Promise<ReviewResult> {
  return reviewWithLLM({ code, language, rules })
}
