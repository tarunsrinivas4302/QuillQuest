import { Toaster } from "react-hot-toast"
export const Toast = () => (<Toaster
    toastOptions={{
        duration: 1500,
        position: 'bottom-right',
        style: {
            background: '#333',
            color: '#fff',
        },
        success: {
            iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
            },
            duration: 1500,
            style: {
                background: '#4caf50',
                color: '#fff',
            },
        },
        error: {
            duration: 1500,
            style: {
                background: '#f44336',
                color: '#fff',
            },
        },
        loading: {
            duration: 1500,
            style: {
                background: '#2196F3',
                color: '#fff',
            },
        },
        default: {
            duration: 1500,
            style: {
                background: '#333',
                color: '#fff',
            },
        },
    }}></Toaster>)