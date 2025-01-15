/**
 * Converts a camelCase string into separate words.
 *
 * @param input - The camelCase string to transform.
 * @param capitalizeFollowUpWords - Whether to capitalize all words or just the first word.
 * @returns The transformed string with words separated.
 */
const camelCaseToWords = (
  input: string,
  capitalizeFollowUpWords: boolean = true,
): string => {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lower and upper case letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .replace(/\b\w/g, (str, idx) =>
      capitalizeFollowUpWords || idx === 0
        ? str.toUpperCase()
        : str.toLowerCase(),
    );
};

export default camelCaseToWords;
