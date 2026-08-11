import type { CodeLanguage } from '@/types/editor'

interface ReviewSessionResponse {
  sessionId: string
}

export async function createReviewStreamSession(code: string, language: CodeLanguage) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/review/stream-sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language, rules: [] }),
  })

  if (!response.ok) throw new Error(`Unable to create Review stream (${response.status})`)

  const payload = (await response.json()) as ReviewSessionResponse
  if (!payload.sessionId) throw new Error('Review stream session ID is missing')
  return payload.sessionId
}

export function getReviewStreamUrl(sessionId: string, lastEventId: string) {
  const query = lastEventId ? `?lastEventId=${encodeURIComponent(lastEventId)}` : ''
  return `${import.meta.env.VITE_API_BASE_URL}/review/stream/${encodeURIComponent(sessionId)}${query}`
}
