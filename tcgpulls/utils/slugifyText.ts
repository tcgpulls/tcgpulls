const slugifyText = (text: string) => {
  return text
    .normalize("NFD") // Decompose combined graphemes into base characters and diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};

export default slugifyText;
