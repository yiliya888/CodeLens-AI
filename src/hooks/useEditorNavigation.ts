import { useEffect, useRef } from 'react'

import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import type { ReviewIssue } from '@/types/review'

export function useEditorNavigation(selectedIssue: ReviewIssue | null) {
  const { editor, monaco, revealLineInCenter, setPosition } = useMonacoEditor()
  const decorationIdsRef = useRef<string[]>([])

  useEffect(() => {
    if (!editor || !monaco) return

    decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, [])

    if (!selectedIssue) return

    const model = editor.getModel()
    if (!model) return

    const lineNumber = Math.min(Math.max(selectedIssue.line, 1), model.getLineCount())
    decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, [
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'review-issue-line-highlight',
          linesDecorationsClassName: 'review-issue-line-indicator',
        },
      },
    ])

    return () => {
      decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, [])
    }
  }, [editor, monaco, selectedIssue])

  function navigateToIssue(issue: ReviewIssue) {
    const model = editor?.getModel()
    if (!editor || !model) return

    const lineNumber = Math.min(Math.max(issue.line, 1), model.getLineCount())
    revealLineInCenter(lineNumber)
    setPosition(lineNumber, 1)
    editor.focus()
  }

  return { navigateToIssue }
}
