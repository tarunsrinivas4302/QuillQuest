import { useState, useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

export const useBlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [tags, setTags] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const { title: savedTitle, content: savedContent, tags: savedTags } = JSON.parse(savedDraft);
        setTitle(savedTitle || '');
        if (editor && savedContent) {
          editor.commands.setContent(savedContent);
        }
        setTags(savedTags || []);
      } catch (error) {
        console.error('Error loading draft', error);
      }
    }
  }, [editor]);

  return {
    title,
    setTitle,
    content,
    setContent,
    coverImage,
    setCoverImage,
    coverImagePreview,
    setCoverImagePreview,
    tags,
    setTags,
    editor
  };
};