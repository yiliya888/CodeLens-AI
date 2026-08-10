import { FileCode2, FilePlus2, Trash2 } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { useFileStore } from '@/stores/file-store'
import { cn } from '@/utils/cn'

interface AppSidebarProps {
  isOpen: boolean
}

const languageColors = {
  javascript: 'text-yellow-400',
  typescript: 'text-blue-400',
  react: 'text-sky-400',
  vue: 'text-emerald-400',
} as const

export function AppSidebar({ isOpen }: AppSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const files = useFileStore((state) => state.files)
  const activeFileId = useFileStore((state) => state.activeFileId)
  const addFile = useFileStore((state) => state.addFile)
  const deleteFile = useFileStore((state) => state.deleteFile)
  const setActiveFile = useFileStore((state) => state.setActiveFile)

  function openFileCreator() {
    setIsCreating(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleCreateFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fileNameValue = formData.get('fileName')
    const fileName = typeof fileNameValue === 'string' ? fileNameValue.trim() : ''

    if (fileName) addFile(fileName)
    setIsCreating(false)
  }

  return (
    <aside
      className={cn(
        'border-border bg-sidebar text-sidebar-foreground fixed inset-y-12 left-0 z-40 flex w-60 flex-col overflow-hidden border-r transition-[width,transform] duration-200 ease-out md:relative md:inset-auto md:z-auto',
        isOpen
          ? 'translate-x-0 md:w-60'
          : '-translate-x-full md:w-0 md:translate-x-0 md:border-r-0',
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex h-10 min-w-60 items-center px-3">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase">
          Explorer
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-7"
          onClick={openFileCreator}
          aria-label="新增文件"
          title="新增文件"
        >
          <FilePlus2 className="size-3.5" />
        </Button>
      </div>

      <div className="border-border/70 min-w-60 flex-1 overflow-y-auto border-t py-1.5">
        <div className="flex h-7 items-center px-3 text-[11px] font-semibold tracking-wide">
          CODELENS-AI
        </div>

        {isCreating && (
          <form className="px-2 py-1" onSubmit={handleCreateFile}>
            <input
              ref={inputRef}
              name="fileName"
              className="border-ring bg-background h-7 w-full rounded-sm border px-2 text-xs outline-none"
              placeholder="example.tsx"
              autoComplete="off"
              onBlur={() => setIsCreating(false)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setIsCreating(false)
              }}
            />
          </form>
        )}

        <div className="px-1">
          {files.map((file) => {
            const isActive = file.id === activeFileId

            return (
              <div
                key={file.id}
                className={cn(
                  'group flex h-7 cursor-default items-center rounded-sm px-2 text-xs transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
                onClick={() => setActiveFile(file.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setActiveFile(file.id)
                }}
              >
                <FileCode2 className={cn('mr-2 size-3.5', languageColors[file.language])} />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                    isActive && 'opacity-70',
                  )}
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteFile(file.id)
                  }}
                  aria-label={`删除 ${file.name}`}
                  title="删除文件"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            )
          })}
        </div>

        {files.length === 0 && (
          <p className="text-muted-foreground px-3 py-6 text-center text-[11px]">暂无文件</p>
        )}
      </div>

      <div className="border-border/70 text-muted-foreground min-w-60 border-t p-3 text-[11px]">
        {files.length} {files.length === 1 ? 'file' : 'files'}
      </div>
    </aside>
  )
}
