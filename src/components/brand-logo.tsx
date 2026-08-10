import { Braces } from 'lucide-react'

export function BrandLogo() {
  return (
    <div className="flex min-w-0 items-center gap-2.5" aria-label="CodeLens AI">
      <span className="border-border bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-md border shadow-sm">
        <Braces className="size-3.5" strokeWidth={2.25} />
      </span>
      <span className="truncate text-sm font-semibold tracking-[-0.02em]">CodeLens AI</span>
    </div>
  )
}
