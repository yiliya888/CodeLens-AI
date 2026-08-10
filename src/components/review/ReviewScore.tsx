import { CheckCircle2 } from 'lucide-react'

interface ReviewScoreProps {
  score: number
  summary: string
}

export function ReviewScore({ score, summary }: ReviewScoreProps) {
  return (
    <section className="border-border bg-muted/20 rounded-lg border p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10">
          <span className="text-lg font-semibold tracking-tight text-emerald-500">{score}</span>
          <span className="text-[9px] text-emerald-500/80">/ 100</span>
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Review completed
          </div>
          <p className="text-muted-foreground text-[11px] leading-4.5">{summary}</p>
        </div>
      </div>
    </section>
  )
}
