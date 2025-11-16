export const useReadTime = () => {
  const calculateReadTime = (content, wordsPerMinute = 200) => {
    if (!content) return "5 min read";

    // Remove markdown syntax for more accurate word count
    const plainText = content
      .toString()
      .replace(/[#*`~\[\]()>]/g, "") // Remove markdown syntax
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();

    const wordCount = plainText.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return `${minutes} min read`;
  };

  return {
    calculateReadTime,
  };
};
