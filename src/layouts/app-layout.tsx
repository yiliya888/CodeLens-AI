import { useEffect, useState } from 'react'

import { ReviewPanel } from '@/components/review/ReviewPanel'
import { useReviewHistoryRecorder } from '@/hooks/useReviewHistoryRecorder'
import { AppHeader } from '@/layouts/app-header'
import { AppSidebar } from '@/layouts/app-sidebar'
import { EditorPanel } from '@/layouts/editor-panel'

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useReviewHistoryRecorder()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="bg-background text-foreground flex h-dvh min-w-80 flex-col overflow-hidden">
      <AppHeader
        isDark={isDark}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((value) => !value)}
        onThemeToggle={() => setIsDark((value) => !value)}
      />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 top-12 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="关闭侧边栏"
          />
        )}
        <AppSidebar isOpen={isSidebarOpen} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          <EditorPanel />
          <ReviewPanel />
        </main>
      </div>
    </div>
  )
}
