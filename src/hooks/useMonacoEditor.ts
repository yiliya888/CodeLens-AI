import type { editor } from 'monaco-editor'
import { create } from 'zustand'

type EditorInstance = editor.IStandaloneCodeEditor
type MonacoApi = typeof import('monaco-editor')

interface MonacoEditorStore {
  editor: EditorInstance | null
  monaco: MonacoApi | null
  setEditor: (editor: EditorInstance, monaco: MonacoApi) => void
  clearEditor: (editor: EditorInstance) => void
}

const useMonacoEditorStore = create<MonacoEditorStore>((set) => ({
  editor: null,
  monaco: null,
  setEditor: (editorInstance, monacoInstance) =>
    set({ editor: editorInstance, monaco: monacoInstance }),
  clearEditor: (editorInstance) =>
    set((state) => (state.editor === editorInstance ? { editor: null, monaco: null } : state)),
}))

export function useMonacoEditor() {
  const editorInstance = useMonacoEditorStore((state) => state.editor)
  const monaco = useMonacoEditorStore((state) => state.monaco)
  const setEditor = useMonacoEditorStore((state) => state.setEditor)
  const clearEditor = useMonacoEditorStore((state) => state.clearEditor)

  function getEditor() {
    return useMonacoEditorStore.getState().editor
  }

  function setPosition(lineNumber: number, column = 1) {
    getEditor()?.setPosition({ lineNumber, column })
  }

  function revealLineInCenter(lineNumber: number) {
    getEditor()?.revealLineInCenter(lineNumber)
  }

  return {
    editor: editorInstance,
    monaco,
    setEditor,
    clearEditor,
    getEditor,
    setPosition,
    revealLineInCenter,
  }
}
