import type { NextFunction, Request, Response } from 'express'

import { reviewCode } from '../services/reviewService.js'
import type { ErrorResponse, ReviewRequest, ReviewResult } from '../types/review.js'

function isReviewRequest(body: unknown): body is ReviewRequest {
  if (!body || typeof body !== 'object') return false

  const request = body as Record<string, unknown>
  return (
    typeof request.code === 'string' &&
    typeof request.language === 'string' &&
    Array.isArray(request.rules) &&
    request.rules.every((rule) => typeof rule === 'string')
  )
}

export async function createReview(
  request: Request<Record<string, never>, ReviewResult | ErrorResponse, unknown>,
  response: Response<ReviewResult | ErrorResponse>,
  next: NextFunction,
) {
  try {
    if (!isReviewRequest(request.body)) {
      response.status(400).json({ message: 'code、language 和 rules 字段格式不正确。' })
      return
    }

    const result = await reviewCode(request.body)
    response.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
