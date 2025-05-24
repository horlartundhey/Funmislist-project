/**
 * Debug and log utility functions
 */

// Print a colored log message for easier debugging
const logDebug = (message, data = null) => {
  console.log('\x1b[36m%s\x1b[0m', '🔍 DEBUG: ' + message);
  if (data !== null) {
    console.log(data);
  }
};

// Check string similarity for typo detection
const stringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  // Simple Levenshtein distance implementation
  const matrix = [];
  
  // Increment along the first column of each row
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  // Increment each column in the first row
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the rest of the matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }
  
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1; // Both strings are empty
  
  // Convert distance to similarity score (0-1)
  return 1 - (matrix[str2.length][str1.length] / maxLength);
};

// Find potential typos between a value and an array of options
const findSimilarStrings = (value, options, threshold = 0.8) => {
  if (!value || !options || !options.length) return [];
  
  return options
    .map(option => ({
      value: option,
      similarity: stringSimilarity(value, option)
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};

module.exports = {
  logDebug,
  stringSimilarity,
  findSimilarStrings
};
