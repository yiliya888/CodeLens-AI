import { FilePlus2 } from 'lucide-react'

import { CodeEditor } from '@/components/editor/CodeEditor'
import { useFileStore } from '@/stores/file-store'

export function EditorPanel() {
  const activeFileId = useFileStore((state) => state.activeFileId)
  const activeFile = useFileStore((state) =>
    state.files.find((file) => file.id === state.activeFileId),
  )
  const updateFileContent = useFileStore((state) => state.updateFileContent)

  if (!activeFile || !activeFileId) {
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
      <CodeEditor
        key={activeFile.id}
        value={activeFile.content}
        language={activeFile.language}
        filePath={`/workspace/${activeFile.name}`}
        autoSaveKey={`codelens-file-${activeFile.id}`}
        onChange={(content) => updateFileContent(activeFile.id, content)}
      />
    </section>
  )
}
