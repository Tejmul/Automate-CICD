import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppShell() {
    return (
        <div className="app">
            <TopNav />
            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}

