import { create } from 'zustand'

import type { CodeFile } from '@/types/editor'
import { getLanguageFromFileName } from '@/utils/file-language'

interface FileStore {
  files: CodeFile[]
  activeFileId: string | null
  addFile: (name: string) => void
  deleteFile: (id: string) => void
  setActiveFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
}

const initialFile: CodeFile = {
  id: 'welcome-file',
  name: 'App.tsx',
  language: 'react',
  content: '',
}

function createFileId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useFileStore = create<FileStore>((set) => ({
  files: [initialFile],
  activeFileId: initialFile.id,

  addFile: (name) =>
    set((state) => {
      const normalizedName = name.trim()
      if (!normalizedName) return state

      const existingFile = state.files.find((file) => file.name === normalizedName)
      if (existingFile) return { activeFileId: existingFile.id }

      const file: CodeFile = {
        id: createFileId(),
        name: normalizedName,
        language: getLanguageFromFileName(normalizedName),
        content: '',
      }

      return {
        files: [...state.files, file],
        activeFileId: file.id,
      }
    }),

  deleteFile: (id) =>
    set((state) => {
      const fileIndex = state.files.findIndex((file) => file.id === id)
      if (fileIndex === -1) return state

      const files = state.files.filter((file) => file.id !== id)
      if (state.activeFileId !== id) return { files }

      const nextActiveFile = files[Math.min(fileIndex, files.length - 1)]
      return {
        files,
        activeFileId: nextActiveFile?.id ?? null,
      }
    }),

  setActiveFile: (id) =>
    set((state) => (state.files.some((file) => file.id === id) ? { activeFileId: id } : state)),

  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) => (file.id === id ? { ...file, content } : file)),
    })),
}))
