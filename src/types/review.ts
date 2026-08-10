export type ReviewStatus = 'idle' | 'reviewing' | 'completed' | 'error'

export type ReviewSeverity = 'error' | 'warning' | 'info'

export type ReviewCategory = 'performance' | 'security' | 'quality'

export interface ReviewIssue {
  id: string
  line: number
  severity: ReviewSeverity
  category: ReviewCategory
  title: string
  description: string
  suggestion: string
}

export interface ReviewResult {
  score: number
  summary: string
  issues: ReviewIssue[]
}
