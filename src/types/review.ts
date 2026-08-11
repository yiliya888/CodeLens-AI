export type ReviewStatus = 'idle' | 'reviewing' | 'streaming' | 'completed' | 'error'

export type ReviewSeverity = 'error' | 'warning' | 'info'

export type ReviewCategory = 'performance' | 'security' | 'quality'

export interface FixSuggestion {
  before: string
  after: string
}

export interface ReviewIssue {
  id: string
  line: number
  severity: ReviewSeverity
  category: ReviewCategory
  title: string
  description: string
  suggestion: string
  fixSuggestion?: FixSuggestion
}

export interface ReviewResult {
  score: number
  summary: string
  issues: ReviewIssue[]
}
