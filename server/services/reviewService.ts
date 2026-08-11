import type { ReviewRequest, ReviewResult } from '../types/review.js'

const MOCK_DELAY = 500

function wait(delay: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delay))
}

export async function reviewCode({ code, language, rules }: ReviewRequest): Promise<ReviewResult> {
  await wait(MOCK_DELAY)

  const lineCount = Math.max(code.split('\n').length, 1)
  const appliedRules = rules.length > 0 ? `，已应用 ${rules.length} 条检查规则` : ''

  return {
    score: 85,
    summary: `${language} Mock Review 已完成${appliedRules}。代码整体结构清晰，仍有少量问题可以改进。`,
    issues: [
      {
        id: 'mock-quality-issue',
        line: Math.min(3, lineCount),
        severity: 'warning',
        category: 'quality',
        title: '复杂逻辑可以进一步拆分',
        description: '当前代码块可能承担了多个职责，后续扩展时会增加维护成本。',
        suggestion: '将独立职责提取为命名清晰的小函数或组件。',
      },
      {
        id: 'mock-security-issue',
        line: Math.min(8, lineCount),
        severity: 'info',
        category: 'security',
        title: '明确输入数据边界',
        description: '外部输入应在进入业务逻辑前进行校验。',
        suggestion: '为输入数据增加明确的运行时校验。',
      },
    ],
  }
}
