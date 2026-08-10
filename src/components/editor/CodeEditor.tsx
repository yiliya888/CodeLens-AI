import Editor from '@monaco-editor/react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { editor } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import type { CodeLanguage } from '@/types/editor'

type MonacoApi = typeof import('monaco-editor')

interface CodeEditorProps {
  value: string
  language: CodeLanguage
  onChange: (value: string) => void
  autoSaveKey?: string
  filePath?: string
}

const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 24
const DEFAULT_FONT_SIZE = 14
const AUTO_SAVE_DELAY = 500

const languageConfig: Record<
  CodeLanguage,
  { monacoLanguage: string; path: string; label: string }
> = {
  javascript: {
    monacoLanguage: 'javascript',
    path: 'file:///workspace/main.js',
    label: 'JavaScript',
  },
  typescript: {
    monacoLanguage: 'typescript',
    path: 'file:///workspace/main.ts',
    label: 'TypeScript',
  },
  react: {
    monacoLanguage: 'typescript',
    path: 'file:///workspace/App.tsx',
    label: 'React',
  },
  vue: {
    monacoLanguage: 'html',
    path: 'file:///workspace/App.vue',
    label: 'Vue',
  },
}

function getInitialTheme() {
  return document.documentElement.classList.contains('dark')
}

export function CodeEditor({
  value,
  language,
  onChange,
  autoSaveKey = 'codelens-editor-draft',
  filePath,
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [isDark, setIsDark] = useState(getInitialTheme)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const { setEditor, clearEditor } = useMonacoEditor()
  const config = languageConfig[language]
  const storageKey = `${autoSaveKey}:${language}`

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(getInitialTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (mountedEditorRef.current) clearEditor(mountedEditorRef.current)
    }
  }, [clearEditor])

  function restoreDraft() {
    if (value) return

    const savedValue = localStorage.getItem(storageKey)
    if (savedValue) onChange(savedValue)
  }

  function handleChange(nextValue: string | undefined) {
    const code = nextValue ?? ''
    onChange(code)

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, code)
    }, AUTO_SAVE_DELAY)
  }

  function handleMount(editorInstance: editor.IStandaloneCodeEditor, monacoInstance: MonacoApi) {
    mountedEditorRef.current = editorInstance
    setEditor(editorInstance, monacoInstance)
    restoreDraft()
  }

  function decreaseFontSize() {
    setFontSize((size) => Math.max(MIN_FONT_SIZE, size - 1))
  }

  function increaseFontSize() {
    setFontSize((size) => Math.min(MAX_FONT_SIZE, size + 1))
  }

  return (
    <div className="bg-editor flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-border bg-muted/20 flex h-10 shrink-0 items-center border-b px-2">
        <span className="px-2 text-xs font-medium">{config.label}</span>
        <span className="text-muted-foreground mr-1 ml-auto text-[11px] tabular-nums">
          {fontSize}px
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={decreaseFontSize}
          disabled={fontSize === MIN_FONT_SIZE}
          aria-label="减小字体"
          title="减小字体"
        >
          <Minus className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setFontSize(DEFAULT_FONT_SIZE)}
          disabled={fontSize === DEFAULT_FONT_SIZE}
          aria-label="重置字体大小"
          title="重置字体大小"
        >
          <RotateCcw className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={increaseFontSize}
          disabled={fontSize === MAX_FONT_SIZE}
          aria-label="增大字体"
          title="增大字体"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          onMount={handleMount}
          path={filePath ?? config.path}
          language={config.monacoLanguage}
          value={value}
          onChange={handleChange}
          theme={isDark ? 'vs-dark' : 'light'}
          loading={
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Loading editor…
            </div>
          }
          options={{
            automaticLayout: true,
            fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            fontSize,
            lineHeight: Math.round(fontSize * 1.65),
            minimap: { enabled: false },
            padding: { top: 14 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  )
}
