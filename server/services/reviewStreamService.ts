import type { Response } from 'express'

import type { ReviewRequest } from '../types/review.js'

import { streamReviewWithLLM } from './llmService.js'

interface StreamEvent {
  id: number
  event: 'chunk' | 'reset' | 'complete' | 'failed'
  data: unknown
}

interface ReviewSession {
  id: string
  request: ReviewRequest
  events: StreamEvent[]
  subscribers: Set<Response>
  started: boolean
  finished: boolean
}

const sessions = new Map<string, ReviewSession>()
const SESSION_TTL = 5 * 60 * 1_000

function createSessionId() {
  return `review-stream-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function writeEvent(response: Response, streamEvent: StreamEvent) {
  response.write(`id: ${streamEvent.id}\n`)
  response.write(`event: ${streamEvent.event}\n`)
  response.write(`data: ${JSON.stringify(streamEvent.data)}\n\n`)
}

function emit(session: ReviewSession, event: StreamEvent['event'], data: unknown) {
  const streamEvent: StreamEvent = { id: session.events.length + 1, event, data }
  session.events.push(streamEvent)
  session.subscribers.forEach((response) => writeEvent(response, streamEvent))
}

function finish(session: ReviewSession) {
  session.finished = true
  session.subscribers.forEach((response) => response.end())
  session.subscribers.clear()
  setTimeout(() => sessions.delete(session.id), SESSION_TTL).unref()
}

async function runSession(session: ReviewSession) {
  try {
    const result = await streamReviewWithLLM(session.request, {
      onToken: (token) => emit(session, 'chunk', { content: token }),
      onRetry: () => emit(session, 'reset', {}),
    })
    emit(session, 'complete', result)
  } catch (error) {
    emit(session, 'failed', {
      message: error instanceof Error ? error.message : 'Review stream failed',
    })
  } finally {
    finish(session)
  }
}

export function createReviewSession(request: ReviewRequest) {
  const id = createSessionId()
  sessions.set(id, {
    id,
    request,
    events: [],
    subscribers: new Set(),
    started: false,
    finished: false,
  })
  setTimeout(() => sessions.delete(id), SESSION_TTL).unref()
  return id
}

export function subscribeToReviewSession(
  sessionId: string,
  response: Response,
  lastEventId: number,
) {
  const session = sessions.get(sessionId)
  if (!session) return false

  session.events
    .filter((event) => event.id > lastEventId)
    .forEach((event) => writeEvent(response, event))

  if (session.finished) {
    response.end()
    return true
  }

  session.subscribers.add(response)
  if (!session.started) {
    session.started = true
    void runSession(session)
  }

  return true
}

export function unsubscribeFromReviewSession(sessionId: string, response: Response) {
  sessions.get(sessionId)?.subscribers.delete(response)
}
