import { FilePlus2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { CodeEditor } from '@/components/editor/CodeEditor'
import { useFileStore } from '@/stores/file-store'
import type { CodeFile } from '@/types/editor'

interface ActiveFileEditorProps {
  file: CodeFile
}

function ActiveFileEditor({ file }: ActiveFileEditorProps) {
  const currentContentRef = useRef(file.content)
  const updateFileContent = useFileStore((state) => state.updateFileContent)

  useEffect(() => {
    const fileId = file.id

    return () => {
      updateFileContent(fileId, currentContentRef.current)
    }
  }, [file.id, updateFileContent])

  function handleChange(content: string) {
    currentContentRef.current = content
    updateFileContent(file.id, content)
  }

  return (
    <CodeEditor
      value={file.content}
      language={file.language}
      filePath={`/workspace/${file.name}`}
      autoSaveKey={`codelens-file-${file.id}`}
      onChange={handleChange}
    />
  )
}

export function EditorPanel() {
  const activeFile = useFileStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  )

  if (!activeFile) {
    return (
      <section className="bg-editor flex min-h-[55vh] min-w-0 flex-1 items-center justify-center lg:min-h-0">
        <div className="text-muted-foreground text-center">
          <FilePlus2 className="mx-auto mb-3 size-5" />
          <p className="text-xs">在侧边栏新建一个文件</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-editor min-h-[55vh] min-w-0 flex-1 lg:min-h-0">
      <ActiveFileEditor key={activeFile.id} file={activeFile} />
    </section>
  )
}
