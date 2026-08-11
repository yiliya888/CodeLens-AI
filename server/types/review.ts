export type ReviewSeverity = 'error' | 'warning' | 'info'

export type ReviewCategory = 'performance' | 'security' | 'quality'

export interface ReviewRequest {
  code: string
  language: string
  rules: string[]
}

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

export interface ErrorResponse {
  message: string
}
