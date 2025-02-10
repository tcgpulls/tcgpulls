const slugifyText = (text: string) => {
  return (
    text
      // Insert a hyphen between a lowercase letter or digit and an uppercase letter
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      // Decompose combined graphemes into base characters and diacritics
      .normalize("NFD")
      // Remove diacritical marks
      .replace(/[\u0300-\u036f]/g, "")
      // Replace any whitespace (including multiple spaces) with a single hyphen
      .replace(/\s+/g, "-")
      // Convert everything to lowercase
      .toLowerCase()
  );
};

export default slugifyText;
