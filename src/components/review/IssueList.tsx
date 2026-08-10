import { IssueCard } from '@/components/review/IssueCard'
import type { ReviewIssue } from '@/types/review'

interface IssueListProps {
  issues: ReviewIssue[]
  selectedIssueId: string | null
  onSelectIssue: (issue: ReviewIssue) => void
}

export function IssueList({ issues, selectedIssueId, onSelectIssue }: IssueListProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          Issues
        </h2>
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px]">
          {issues.length}
        </span>
      </div>
      <div className="space-y-2">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            isSelected={selectedIssueId === issue.id}
            onSelect={onSelectIssue}
          />
        ))}
      </div>
    </section>
  )
}
