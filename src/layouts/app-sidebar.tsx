import { ChevronDown, FileCode2, Folder, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface AppSidebarProps {
  isOpen: boolean
}

export function AppSidebar({ isOpen }: AppSidebarProps) {
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
        <Button variant="ghost" size="icon" className="ml-auto size-7" aria-label="搜索">
          <Search className="size-3.5" />
        </Button>
      </div>

      <div className="border-border/70 min-w-60 border-t py-1.5">
        <div className="flex h-7 items-center gap-1.5 px-2 text-xs font-medium">
          <ChevronDown className="size-3.5" />
          <span className="truncate">CODELENS-AI</span>
        </div>
        <div className="text-muted-foreground flex h-7 items-center gap-2 px-5 text-xs">
          <Folder className="size-3.5 text-blue-400" />
          <span>src</span>
        </div>
        <div className="text-muted-foreground flex h-7 items-center gap-2 px-8 text-xs">
          <FileCode2 className="size-3.5 text-sky-400" />
          <span>workspace.tsx</span>
        </div>
      </div>

      <div className="border-border/70 text-muted-foreground mt-auto min-w-60 border-t p-3 text-[11px]">
        Workspace
      </div>
    </aside>
  )
}
