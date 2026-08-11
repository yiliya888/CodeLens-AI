import { ArrowLeft, CalendarClock, FileCode2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { BrandLogo } from '@/components/brand-logo'
import { HistoryList } from '@/components/history/HistoryList'
import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/stores/history-store'

export function HistoryPage() {
  const navigate = useNavigate()
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const histories = useHistoryStore((state) => state.histories)
  const removeHistory = useHistoryStore((state) => state.removeHistory)
  const getHistory = useHistoryStore((state) => state.getHistory)
  const selectedHistory = selectedHistoryId ? getHistory(selectedHistoryId) : undefined

  function handleRemove(id: string) {
    removeHistory(id)
    if (selectedHistoryId === id) setSelectedHistoryId(null)
  }

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <header className="border-border flex h-12 items-center border-b px-3">
        <BrandLogo />
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => void navigate('/')}>
          <ArrowLeft />
          Workspace
        </Button>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {selectedHistory ? (
          <section>
            <Button
              variant="ghost"
              size="sm"
              className="mb-5 -ml-2"
              onClick={() => setSelectedHistoryId(null)}
            >
              <ArrowLeft />
              Back to history
            </Button>

            <div className="border-border bg-card rounded-xl border p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="border-border bg-muted/30 flex size-10 items-center justify-center rounded-lg border">
                  <FileCode2 className="size-4 text-sky-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-base font-semibold">{selectedHistory.fileName}</h1>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[11px]">
                    <CalendarClock className="size-3" />
                    {new Date(selectedHistory.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-emerald-500">{selectedHistory.score}</p>
                  <p className="text-muted-foreground text-[10px]">/ 100</p>
                </div>
              </div>

              <p className="text-muted-foreground mt-5 text-xs leading-5">
                {selectedHistory.result.summary}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold">Issues</h2>
                <span className="text-muted-foreground text-[11px]">{selectedHistory.issues}</span>
              </div>
              <div className="space-y-2">
                {selectedHistory.result.issues.map((issue) => (
                  <article key={issue.id} className="border-border bg-card rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{issue.title}</span>
                      <span className="text-muted-foreground ml-auto text-[10px] capitalize">
                        {issue.severity} · {issue.category} · Line {issue.line}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-[11px] leading-4">
                      {issue.description}
                    </p>
                    <p className="bg-muted/25 text-muted-foreground mt-2 rounded-md p-2 text-[10px] leading-4">
                      {issue.suggestion}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section>
            <div className="mb-6">
              <h1 className="text-xl font-semibold tracking-tight">Review History</h1>
              <p className="text-muted-foreground mt-1 text-xs">查看已完成的代码审查记录。</p>
            </div>
            <HistoryList
              histories={histories}
              onOpen={setSelectedHistoryId}
              onRemove={handleRemove}
            />
          </section>
        )}
      </main>
    </div>
  )
}
