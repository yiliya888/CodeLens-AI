import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/app-layout'

export const router = createBrowserRouter([{ path: '*', element: <AppLayout /> }])
