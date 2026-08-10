import { useEffect } from 'react'

import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import type { ReviewIssue, ReviewSeverity } from '@/types/review'

const MARKER_OWNER = 'codelens-review'

export function useEditorMarkers(issues: ReviewIssue[]) {
  const { editor, monaco } = useMonacoEditor()

  useEffect(() => {
    const model = editor?.getModel()
    if (!model || !monaco) return

    const severityMap: Record<ReviewSeverity, number> = {
      error: monaco.MarkerSeverity.Error,
      warning: monaco.MarkerSeverity.Warning,
      info: monaco.MarkerSeverity.Info,
    }

    monaco.editor.setModelMarkers(model, MARKER_OWNER, [])

    const markers = issues.map((issue) => {
      const lineNumber = Math.min(Math.max(issue.line, 1), model.getLineCount())

      return {
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: model.getLineMaxColumn(lineNumber),
        message: `${issue.title}\n${issue.description}`,
        severity: severityMap[issue.severity],
      }
    })

    monaco.editor.setModelMarkers(model, MARKER_OWNER, markers)

    return () => {
      monaco.editor.setModelMarkers(model, MARKER_OWNER, [])
    }
  }, [editor, issues, monaco])
}
