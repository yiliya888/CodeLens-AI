import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/app-layout'

export const router = createBrowserRouter([
  {
    path: '/history',
    lazy: async () => {
      const { HistoryPage } = await import('@/pages/history-page')
      return { Component: HistoryPage }
    },
  },
  { path: '*', element: <AppLayout /> },
])
