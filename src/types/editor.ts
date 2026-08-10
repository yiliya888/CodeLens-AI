export type CodeLanguage = 'javascript' | 'typescript' | 'react' | 'vue'

export interface CodeFile {
  id: string
  name: string
  language: CodeLanguage
  content: string
}
