import { useEffect, useRef } from 'react'

import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import type { CodeLanguage } from '@/types/editor'

interface DiffViewerProps {
  before: string
  after: string
  language: CodeLanguage
}

const monacoLanguage: Record<CodeLanguage, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'typescript',
  vue: 'html',
}

export function DiffViewer({ before, after, language }: DiffViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { monaco } = useMonacoEditor()

  useEffect(() => {
    if (!containerRef.current || !monaco) return

    const instanceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const originalModel = monaco.editor.createModel(
      before,
      monacoLanguage[language],
      monaco.Uri.parse(`inmemory://codelens/${instanceId}/before`),
    )
    const modifiedModel = monaco.editor.createModel(
      after,
      monacoLanguage[language],
      monaco.Uri.parse(`inmemory://codelens/${instanceId}/after`),
    )
    const diffEditor = monaco.editor.createDiffEditor(containerRef.current, {
      automaticLayout: true,
      enableSplitViewResizing: true,
      fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
      fontSize: 13,
      minimap: { enabled: false },
      originalEditable: false,
      readOnly: true,
      renderSideBySide: true,
      scrollBeyondLastLine: false,
    })

    diffEditor.setModel({ original: originalModel, modified: modifiedModel })

    return () => {
      diffEditor.dispose()
      originalModel.dispose()
      modifiedModel.dispose()
    }
  }, [after, before, language, monaco])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-border bg-muted/20 grid h-8 shrink-0 grid-cols-2 border-b text-[11px] font-medium">
        <div className="border-border flex items-center border-r px-3 text-red-400">
          <span className="mr-2 font-mono">−</span>
          Before
        </div>
        <div className="flex items-center px-3 text-emerald-400">
          <span className="mr-2 font-mono">+</span>
          After
        </div>
      </div>
      <div ref={containerRef} className="min-h-0 flex-1" />
    </div>
  )
}
