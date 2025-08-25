import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Code, Image as ImageIcon, Undo, Redo, Check, Link as LinkIcon, Heading3, Heading4 } from 'lucide-react';
import { useAutosave } from '@/hooks/useAutoSave';
import useFetch from '@/hooks/useFetch';
import toast from 'react-hot-toast'
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';

const RichTextEditor = ({ title, tags, coverImage, validationErrors , content , setContent }) => {
  const inlineFileInputRef = useRef();
  const { autosaveStatus, handleContentChange } = useAutosave({ title, content, tags, coverImage });
  const { fetchData } = useFetch();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 rounded p-2 font-mono text-sm overflow-x-auto',
          },
        },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-none min-h-[24rem] p-4',
      },
    },
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      handleContentChange(html);
    },
  });

  const handleInlineImageUpload = () => {
    inlineFileInputRef.current.click();
  };

  const insertInlineImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append('cnt-image', file);
    try {
      const response = await fetchData('uploadImage', formData);
      if (response?.url) {
        editor.chain().focus().setImage({ src: response.url, alt: 'Blog image' }).run();
      } else {
        toast.error('Image upload failed.');
      }
    } catch (error) {
      toast.error('Image upload error.');
      console.error(error);
    }
  };



  const toolbarButton = (action, icon, title, isActive = false, disabled = false) => (
    <button
      onClick={action}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition ${isActive ? 'bg-gray-100' : ''}`}
    >
      {icon}
    </button>
  );


  if (!editor) {
    return <div className="flex items-center justify-center h-64 bg-gray-100">Loading editor...</div>;
  }
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b">
        {toolbarButton(() => editor.chain().focus().toggleBold().run(), <Bold size={18} />, 'Bold', editor?.isActive('bold'))}
        {toolbarButton(() => editor.chain().focus().toggleItalic().run(), <Italic size={18} />, 'Italic', editor?.isActive('italic'))}
        {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={16} />, 'Heading 1', editor?.isActive('heading', { level: 1 }))}
        {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={15} />, 'Heading 2', editor?.isActive('heading', { level: 2 }))}
        {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={14} />, 'Heading 3', editor?.isActive('heading', { level: 3 }))}
        {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 4 }).run(), <Heading4 size={13} />, 'Heading 4', editor?.isActive('heading', { level: 4 }))}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {toolbarButton(() => editor.chain().focus().toggleBulletList().run(), <List size={18} />, 'Bullet List', editor?.isActive('bulletList'))}
        {toolbarButton(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={18} />, 'Numbered List', editor?.isActive('orderedList'))}
        {toolbarButton(() => editor.chain().focus().toggleCodeBlock().run(), <Code size={18} />, 'Code Block', editor?.isActive('codeBlock'))}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Image Upload */}
        <button onClick={handleInlineImageUpload} className="p-2 rounded hover:bg-gray-100 transition" title="Insert Image">
          <ImageIcon size={18} />
          <input type="file" ref={inlineFileInputRef} name="" onChange={insertInlineImage} accept="image/*" className="hidden" />
        </button>

        {/* Link */}
        {toolbarButton(() => {
          const url = window.prompt('Enter link URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }, <LinkIcon size={18} />, 'Insert Link', editor?.isActive('link'))}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        {toolbarButton(() => editor.chain().focus().undo().run(), <Undo size={18} />, 'Undo', false, !editor?.can().undo())}
        {toolbarButton(() => editor.chain().focus().redo().run(), <Redo size={18} />, 'Redo', false, !editor?.can().redo())}

        {/* Autosave Status */}
        <div className="ml-auto flex items-center text-sm text-gray-500">
          {autosaveStatus && (
            <>
              <Check size={14} className="text-green-500 mr-1" />
              {autosaveStatus}
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className={`border-t ${validationErrors.content ? 'border-red-300' : 'border-transparent'}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Error Message */}
      {validationErrors.content && (
        <p className="mt-1 text-red-500 px-4">{validationErrors.content}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
