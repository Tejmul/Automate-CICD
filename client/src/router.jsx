import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './ui/layout/AppShell'
import { HomePage } from './ui/pages/HomePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },
])

