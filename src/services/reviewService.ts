import type { CodeLanguage } from '@/types/editor'
import type { ReviewResult } from '@/types/review'

const REVIEW_DELAY = 2_000

function wait(delay: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delay))
}

function getMockResult(code: string, language: CodeLanguage): ReviewResult {
  const lineCount = Math.max(code.split('\n').length, 1)
  const languageName = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    react: 'React',
    vue: 'Vue',
  }[language]

  return {
    score: 85,
    summary: `${languageName} 代码结构清晰，整体可维护性良好。仍有少量性能、安全性和代码质量问题值得关注。`,
    issues: [
      {
        id: 'mock-performance-issue',
        line: Math.min(8, lineCount),
        severity: 'warning',
        category: 'performance',
        title: '避免在渲染过程中创建重复计算',
        description: '当前表达式可能在每次渲染时重新执行，增加不必要的计算成本。',
        suggestion: '将稳定的计算结果移到组件外部，或使用合适的缓存方式。',
      },
      {
        id: 'mock-security-issue',
        line: Math.min(14, lineCount),
        severity: 'error',
        category: 'security',
        title: '输入内容缺少明确的安全边界',
        description: '未经约束的输入可能在后续渲染或拼接过程中产生潜在风险。',
        suggestion: '在数据进入展示层之前完成校验，并避免直接渲染不可信内容。',
      },
      {
        id: 'mock-quality-issue',
        line: Math.min(21, lineCount),
        severity: 'info',
        category: 'quality',
        title: '复杂逻辑可以进一步拆分',
        description: '当前代码块承担了多个职责，后续扩展时可能增加理解和测试成本。',
        suggestion: '将独立职责提取为命名清晰的小函数或组件。',
      },
    ],
  }
}

export async function reviewCode(code: string, language: CodeLanguage): Promise<ReviewResult> {
  await wait(REVIEW_DELAY)
  return getMockResult(code, language)
}
