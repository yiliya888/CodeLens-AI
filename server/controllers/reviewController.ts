import type { NextFunction, Request, Response } from 'express'

import { reviewCode } from '../services/reviewService.js'
import {
  createReviewSession,
  subscribeToReviewSession,
  unsubscribeFromReviewSession,
} from '../services/reviewStreamService.js'
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

export function createReviewStreamSession(
  request: Request<Record<string, never>, { sessionId: string } | ErrorResponse, unknown>,
  response: Response<{ sessionId: string } | ErrorResponse>,
) {
  if (!isReviewRequest(request.body)) {
    response.status(400).json({ message: 'code、language 和 rules 字段格式不正确。' })
    return
  }

  response.status(201).json({ sessionId: createReviewSession(request.body) })
}

export function streamReview(
  request: Request<{ sessionId: string }, ErrorResponse, unknown, { lastEventId?: string }>,
  response: Response,
) {
  response.status(200)
  response.set({
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'X-Accel-Buffering': 'no',
  })
  response.write('retry: 1500\n\n')
  response.flushHeaders()

  const heartbeat = setInterval(() => response.write(': heartbeat\n\n'), 15_000)
  request.on('close', () => {
    clearInterval(heartbeat)
    unsubscribeFromReviewSession(request.params.sessionId, response)
  })

  const headerEventId = request.get('Last-Event-ID')
  const lastEventId = Number(request.query.lastEventId ?? headerEventId ?? 0) || 0
  const subscribed = subscribeToReviewSession(request.params.sessionId, response, lastEventId)

  if (!subscribed) {
    clearInterval(heartbeat)
    response.write(
      `event: failed\ndata: ${JSON.stringify({ message: 'Review session not found' })}\n\n`,
    )
    response.end()
  }
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
