/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

export const useAutosave = ({ title, content, tags, coverImage }) => {
  const [autosaveStatus, setAutosaveStatus] = useState('');
  
  const saveToStorage = useCallback(() => {
    const postData = {
      title,
      content,
      tags,
      coverImage
    };
    
    // Mock save to localStorage for demo purposes
    localStorage.setItem('blog-draft', JSON.stringify(postData));
    setAutosaveStatus('Draft saved');
    
    // Clear status after 2 seconds
    setTimeout(() => setAutosaveStatus(''), 2000);
  }, [title, content, tags, coverImage]);

  const handleContentChange = useCallback((newContent) => {
    // Clear previous autosave timeout
    if (window.autosaveTimeout) {
      clearTimeout(window.autosaveTimeout);
    }
    
    // Set new timeout for autosave
    window.autosaveTimeout = setTimeout(() => {
      saveToStorage();
    }, 1500);
  }, [saveToStorage]);

  // Set up autosave on title, tags, or coverImage change
  useEffect(() => {
    if (title || tags.length > 0 || coverImage) {
      handleContentChange(content);
    }
  }, [title, tags, coverImage, handleContentChange, content]);

  return {
    autosaveStatus,
    handleContentChange
  };
};