import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import axios from "axios";

const BlogEditor = ({ blogData = null }) => {
  const [title, setTitle] = useState(blogData?.title || "");
  const [category, setCategory] = useState(blogData?.category || "");
  const [tags, setTags] = useState(blogData?.tags?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(null);
  const [editorContent, setEditorContent] = useState(blogData?.content || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    console.log("BlogEditor mounted", editor);
  }, [editor]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/api/v1/blogs/editor-image", formData);
      return res.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      return null;
    }
  };

  const handleEditorImageInsert = async (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;

    try {
      const url = await handleImageUpload(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error("Error inserting image:", error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (coverImage) formData.append("image", coverImage);

    const blogPayload = {
      title,
      content: editorContent,
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(tag => tag),
    };

    for (const key in blogPayload) {
      formData.append(key, 
        key === "tags" ? JSON.stringify(blogPayload[key]) : blogPayload[key]
      );
    }

    try {
      // Uncomment when API is ready
      // const response = await axios.post("/api/v1/blogs", formData);
      // alert("Blog saved successfully!");
      console.log("Blog data to be submitted:", blogPayload);
      alert("Save functionality is currently disabled");
    } catch (err) {
      alert("Error saving blog: " + err.response?.data?.error || err.message);
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Create / Edit Blog</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border border-gray-300 rounded"
      />

      <div className="mb-4">
        <label className="block font-semibold mb-2">Main Blog Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
          className="w-full"
        />
      </div>

      <div className="border rounded">
        <EditorContent editor={editor} className="min-h-[300px] p-4" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Insert Image into Content</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleEditorImageInsert}
          className="w-full" 
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
      >
        Save Blog
      </button>
    </div>
  );
};

export default BlogEditor;