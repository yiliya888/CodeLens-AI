import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/app-layout'
import { HistoryPage } from '@/pages/history-page'

export const router = createBrowserRouter([
  { path: '/history', element: <HistoryPage /> },
  { path: '*', element: <AppLayout /> },
])
