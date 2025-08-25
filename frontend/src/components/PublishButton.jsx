import { Save } from 'lucide-react'
import React from 'react'

const PublishButton = ({ handleSubmit, isSaving }) => {
    return (
        <div className="mt-8 flex justify-end">
            <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
                {isSaving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                    </>
                ) : (
                    <>
                        <Save size={18} className="mr-2" />
                        Publish Blog Post
                    </>
                )}
            </button>
        </div>)
}

export default PublishButton
