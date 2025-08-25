import React from 'react'

const TitleInput = ({title , setTitle , validationErrors}) => {
  return (
    <div className="mb-6">
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter your blog title"
      className={`w-full p-4 text-2xl font-bold border-b-2 focus:outline-none focus:border-blue-500 ${
        validationErrors.title ? 'border-red-500' : 'border-gray-200'
      }`}
    />
    {validationErrors.title && (
      <p className="mt-1 text-red-500">{validationErrors.title}</p>
    )}
  </div>  )
}

export default TitleInput
