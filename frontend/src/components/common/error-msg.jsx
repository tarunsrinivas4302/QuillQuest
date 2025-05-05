import React from 'react'

const ErrorMsg = ({ message }) => {
    return (
        <div>
            <p className='text-red-500 font-mono'>{message}</p>
        </div>
    )
}

export default ErrorMsg
