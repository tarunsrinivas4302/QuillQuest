import { useState, useEffect } from 'react';

// Suggested tags for autocomplete
const SUGGESTED_TAGS = [
  // Technology & Development
  'Technology', 'Programming', 'Web Development', 'App Development', 'AI', 'Machine Learning', 'Cybersecurity', 'DevOps', 'Cloud Computing', 'Blockchain', 'JavaScript', 'Python', 'React', 'UX/UI', 'Tutorial', 'Guide',
  // Lifestyle
  'Lifestyle', 'Travel', 'Health', 'Fitness', 'Nutrition', 'Mental Health', 'Wellness', 'Self Improvement', 'Productivity', 'Minimalism', 'Relationships', 'Parenting',
  // Business & Finance
  'Business', 'Entrepreneurship', 'Startups', 'Finance', 'Investing', 'Cryptocurrency', 'Marketing', 'E-commerce', 'Leadership', 'Economy', 'Career Advice',
  // Creative & Entertainment
  'Design', 'Art', 'Photography', 'Music', 'Movies', 'TV Shows', 'Books', 'Writing', 'Poetry', 'DIY', 'Crafts', 'Gaming',
  // Education & Academia
  'Education', 'Online Learning', 'Science', 'History', 'Math', 'Philosophy', 'Psychology', 'Research', 'Language Learning',
  // News & Opinion
  'News', 'Politics', 'Culture', 'Society', 'Opinion', 'Environment', 'Climate Change', 'Social Justice', 'Technology Policy',
  // Miscellaneous
  'Food', 'Recipes', 'Pets', 'Hobbies', 'Reviews', 'How-To', 'Personal Story', 'Inspiration', 'Life Hacks', 'Events'
];


export const useTags = (initialTags = []) => {
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Filter suggestions based on current tag input
    if (tagInput.trim()) {
      const filtered = SUGGESTED_TAGS.filter(
        tag => tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [tagInput, tags]);

  // useEffect(() => {
  //   window.addEventListener('keypress', handleKeyDown)
  // } , [])

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 20) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput.trim());
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
    
  };
  
  return {
    tags,
    setTags,
    tagInput,
    setTagInput,
    filteredSuggestions,
    showSuggestions,
    addTag,
    removeTag,
    handleTagInputKeyDown
  };
};