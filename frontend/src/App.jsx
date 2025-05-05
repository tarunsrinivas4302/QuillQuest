
import { RouterProvider } from 'react-router-dom'
import './App.css'
import AppRouter from '@/routes/index.jsx'
import AuthProvider from '@/context/auth-context';
import { Toast } from '@/components/common/toast';
function App() {
    const router = AppRouter();

    return <>
        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
        <Toast />
    </>
}

export default App
