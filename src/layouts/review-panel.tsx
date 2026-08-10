import { ListFilter, MessageSquareText, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ReviewPanel() {
  return (
    <aside className="border-border bg-panel flex min-h-72 w-full shrink-0 flex-col border-t lg:min-h-0 lg:w-88 lg:border-t-0 lg:border-l xl:w-96">
      <div className="border-border flex h-10 shrink-0 items-center border-b px-3">
        <MessageSquareText className="text-muted-foreground mr-2 size-3.5" />
        <h2 className="text-xs font-medium">Review Panel</h2>
        <div className="ml-auto flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="size-7" aria-label="筛选">
            <ListFilter className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" aria-label="更多">
            <MoreHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-52 text-center">
          <div className="border-border bg-muted/30 mx-auto mb-3 flex size-9 items-center justify-center rounded-lg border">
            <MessageSquareText className="text-muted-foreground size-4" />
          </div>
          <p className="text-xs font-medium">Review workspace</p>
          <p className="text-muted-foreground mt-1 text-[11px] leading-4">
            Review details will appear in this panel.
          </p>
        </div>
      </div>
    </aside>
  )
}
