import React from 'react'
import { useTags } from '@/hooks/useTags'
import { X } from 'lucide-react';

const TagsInput = () => {
    const {tags , removeTag , setTagInput , tagInput , handleTagInputKeyDown , showSuggestions , filteredSuggestions , addTag} = useTags();
    return (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (up to 20)
            </label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:border-blue-500">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                    >
                        <span>{tag}</span>
                        <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={tagInput}
                        name="tags"
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder={tags.length === 0 ? "Add tags (press Enter after each tag)" : ""}
                        className="w-full p-1 focus:outline-none"
                    />
                    {showSuggestions && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                            {filteredSuggestions.map((suggestion, i) => (
                                <div
                                    key={i}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => addTag(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
                Tags help readers discover your content
            </p>
        </div>
    )
}

export default TagsInput
