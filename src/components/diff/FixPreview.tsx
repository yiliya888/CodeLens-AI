import { Check, X } from 'lucide-react'

import { DiffViewer } from '@/components/diff/DiffViewer'
import { Button } from '@/components/ui/button'
import type { CodeLanguage } from '@/types/editor'
import type { FixSuggestion } from '@/types/review'

interface FixPreviewProps {
  fileName: string
  language: CodeLanguage
  suggestion: FixSuggestion
  onAccept: () => void
  onReject: () => void
}

export function FixPreview({
  fileName,
  language,
  suggestion,
  onAccept,
  onReject,
}: FixPreviewProps) {
  return (
    <div className="border-border bg-background fixed inset-4 z-60 flex min-h-0 flex-col overflow-hidden rounded-xl border shadow-2xl sm:inset-8 lg:inset-12">
      <header className="border-border flex h-12 shrink-0 items-center border-b px-3">
        <div className="min-w-0">
          <h2 className="text-xs font-semibold">Fix Preview</h2>
          <p className="text-muted-foreground truncate text-[10px]">{fileName}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReject}>
            <X />
            Reject
          </Button>
          <Button size="sm" onClick={onAccept}>
            <Check />
            Accept Change
          </Button>
        </div>
      </header>

      <DiffViewer before={suggestion.before} after={suggestion.after} language={language} />
    </div>
  )
}
