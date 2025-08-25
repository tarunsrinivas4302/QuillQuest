import natural from "natural";
import stopword from "stopword";

export const extractKeywords = (text) => {
  if (!text) return [];
  
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text);

  // Remove common stopwords like "is", "the", "and"
  const filteredWords = stopword.removeStopwords(words);

  // Get top 10 unique words as keywords
  return [...new Set(filteredWords.slice(0, 10))];
};
