import { useEffect, useRef } from 'react'

import { createReviewStreamSession, getReviewStreamUrl } from '@/services/ai/reviewStreamService'
import { useFileStore } from '@/stores/file-store'
import { useReviewStore } from '@/stores/review-store'
import type { CodeFile } from '@/types/editor'
import type { ReviewResult } from '@/types/review'

const MAX_RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY = 1_500

interface ActiveStream {
  sessionId: string
  requestId: string
  fileId: string
  content: string
}

function createRequestId() {
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function parseEventData<T>(event: Event): T {
  return JSON.parse((event as MessageEvent<string>).data) as T
}

export function useReview(activeFile: CodeFile | undefined) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const lastEventIdRef = useRef('')
  const activeStreamRef = useRef<ActiveStream | null>(null)
  const currentResult = useReviewStore((state) => state.currentResult)
  const status = useReviewStore((state) => state.status)
  const selectedIssueId = useReviewStore((state) => state.selectedIssueId)
  const errorMessage = useReviewStore((state) => state.errorMessage)
  const streamingContent = useReviewStore((state) => state.streamingContent)
  const startReview = useReviewStore((state) => state.startReview)
  const startStreaming = useReviewStore((state) => state.startStreaming)
  const appendStreamingContent = useReviewStore((state) => state.appendStreamingContent)
  const resetStreamingContent = useReviewStore((state) => state.resetStreamingContent)
  const completeReview = useReviewStore((state) => state.completeReview)
  const failReview = useReviewStore((state) => state.failReview)
  const cancelReview = useReviewStore((state) => state.cancelReview)
  const selectIssue = useReviewStore((state) => state.selectIssue)
  const resetReview = useReviewStore((state) => state.resetReview)

  function disconnect() {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = null
  }

  function isCurrentSnapshot(stream: ActiveStream) {
    const fileState = useFileStore.getState()
    const latestFile = fileState.files.find((file) => file.id === stream.fileId)
    return fileState.activeFileId === stream.fileId && latestFile?.content === stream.content
  }

  function connect(stream: ActiveStream) {
    const source = new EventSource(getReviewStreamUrl(stream.sessionId, lastEventIdRef.current))
    eventSourceRef.current = source

    source.onopen = () => {
      startStreaming(stream.requestId)
    }

    source.addEventListener('chunk', (event) => {
      lastEventIdRef.current = (event as MessageEvent<string>).lastEventId
      const payload = parseEventData<{ content: string }>(event)
      appendStreamingContent(stream.requestId, payload.content)
    })

    source.addEventListener('reset', (event) => {
      lastEventIdRef.current = (event as MessageEvent<string>).lastEventId
      resetStreamingContent(stream.requestId)
    })

    source.addEventListener('complete', (event) => {
      lastEventIdRef.current = (event as MessageEvent<string>).lastEventId
      disconnect()
      if (!isCurrentSnapshot(stream)) {
        cancelReview(stream.requestId)
        return
      }
      completeReview(stream.requestId, parseEventData<ReviewResult>(event))
    })

    source.addEventListener('failed', (event) => {
      lastEventIdRef.current = (event as MessageEvent<string>).lastEventId
      disconnect()
      const payload = parseEventData<{ message: string }>(event)
      failReview(stream.requestId, payload.message)
    })

    source.onerror = () => {
      source.close()
      if (eventSourceRef.current === source) eventSourceRef.current = null
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        failReview(stream.requestId, 'Review stream disconnected after multiple retries.')
        return
      }

      reconnectAttemptsRef.current += 1
      reconnectTimerRef.current = setTimeout(() => connect(stream), RECONNECT_DELAY)
    }
  }

  useEffect(() => {
    disconnect()
    activeStreamRef.current = null
    resetReview()

    return disconnect
  }, [activeFile?.id, resetReview])

  async function review() {
    if (!activeFile) return

    disconnect()
    const requestId = createRequestId()
    startReview(requestId)

    try {
      const sessionId = await createReviewStreamSession(activeFile.content, activeFile.language)
      if (useReviewStore.getState().currentRequestId !== requestId) return

      const stream = {
        sessionId,
        requestId,
        fileId: activeFile.id,
        content: activeFile.content,
      }
      activeStreamRef.current = stream
      reconnectAttemptsRef.current = 0
      lastEventIdRef.current = ''
      connect(stream)
    } catch (error) {
      failReview(
        requestId,
        error instanceof Error ? error.message : 'Unable to start Review stream.',
      )
    }
  }

  return {
    currentResult,
    status,
    selectedIssueId,
    errorMessage,
    streamingContent,
    isLoading: status === 'reviewing' || status === 'streaming',
    review,
    selectIssue,
  }
}
