import { Github } from 'lucide-react';
import React from 'react'

const OAuthBtn = ({ text }) => {

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
    const handleGitHubLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
    }
    const onClick = () => {
        if (text === "Sign in With Google") {
            handleGoogleLogin()
        } else if (text === "Sign in With Github") {
            handleGitHubLogin()
        }
    }

    let icon = null
    if (text === "Sign in With Google") {
        icon = <img src="google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
    } else if (text === "Sign in With Github") {
        icon = <Github />
    }
    return (
        <div>
            <button onClick={onClick} className="w-full my-2 flex cursor-pointer items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                {icon}
                {text}
            </button>
        </div>
    )
}

export default OAuthBtn
