import { MockProvider } from '@/services/ai/mockProvider'
import type { AIProvider, AIProviderName } from '@/services/ai/types'
import type { ReviewResult } from '@/types/review'

const deepseekPlaceholder: AIProvider = {
  reviewCode: () =>
    Promise.reject(new Error('DeepSeek provider is selected but has not been configured.')),
}

const providers: Record<AIProviderName, AIProvider> = {
  mock: new MockProvider(),
  deepseek: deepseekPlaceholder,
}

function resolveProviderName(value: string | undefined): AIProviderName {
  return value === 'deepseek' ? 'deepseek' : 'mock'
}

export function getAIProvider(): AIProvider {
  return providers[resolveProviderName(import.meta.env.VITE_AI_PROVIDER)]
}

export function reviewCode(code: string, language: string): Promise<ReviewResult> {
  return getAIProvider().reviewCode(code, language)
}
