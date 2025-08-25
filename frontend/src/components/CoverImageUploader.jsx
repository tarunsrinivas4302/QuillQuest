import { Upload, X } from 'lucide-react';
import React, { useRef } from 'react'

const CoverImageUploader = ({ coverImagePreview, setCoverImagePreview, setCoverImage }) => {
    const fileInputRef = useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                // Create a synthetic event object with files
                const event = { target: { files: [file] } };
                handleCoverImageUpload(event);
            }
        }
    };

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview image locally
        setCoverImagePreview(URL.createObjectURL(file));

        // Upload to Cloudinary (mock)
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'blog_images');

            // This would be your actual Cloudinary upload endpoint
            // const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
            //   method: 'POST',
            //   body: formData,
            // });
            // const data = await response.json();
            // setCoverImage(data.secure_url);

            // For demo purposes, just use the local preview
            setCoverImage(file);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    return (
        <div>
            <div
                className="mb-8 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCoverImageUpload}
                    accept="image/*"
                    className="hidden"
                />

                {coverImagePreview ? (
                    <div className="relative">
                        <img
                            src={coverImagePreview}
                            alt="Cover preview"
                            className="max-h-64 mx-auto rounded-lg object-cover"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCoverImage(null);
                                setCoverImagePreview('');
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="py-8">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                            Click to upload a cover image or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CoverImageUploader
