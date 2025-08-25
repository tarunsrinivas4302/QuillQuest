import React from 'react'
import { Outlet } from 'react-router-dom'

const EditorLayout = () => {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Outlet />
        </main>
    )
}

export default EditorLayout
