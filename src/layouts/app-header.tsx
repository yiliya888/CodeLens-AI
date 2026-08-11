import { History, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  isDark: boolean
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  onThemeToggle: () => void
}

export function AppHeader({
  isDark,
  isSidebarOpen,
  onSidebarToggle,
  onThemeToggle,
}: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="border-border bg-background/90 relative z-50 flex h-12 shrink-0 items-center border-b px-2.5 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarToggle}
        aria-label={isSidebarOpen ? '折叠侧边栏' : '展开侧边栏'}
        title={isSidebarOpen ? '折叠侧边栏' : '展开侧边栏'}
      >
        {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>

      <div className="ml-1.5">
        <BrandLogo />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void navigate('/history')}
          aria-label="Review History"
          title="Review History"
        >
          <History />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
          title={isDark ? '浅色主题' : '深色主题'}
        >
          {isDark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="outline" size="sm" aria-label="GitHub" title="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.57-.3-5.27-1.29-5.27-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.4-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </Button>
      </div>
    </header>
  )
}
