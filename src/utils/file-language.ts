import type { CodeLanguage } from '@/types/editor'

export function getLanguageFromFileName(fileName: string): CodeLanguage {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'js' || extension === 'mjs' || extension === 'cjs') return 'javascript'
  if (extension === 'jsx' || extension === 'tsx') return 'react'
  if (extension === 'vue') return 'vue'

  return 'typescript'
}
