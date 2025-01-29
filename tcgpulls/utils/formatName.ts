const formatName = (name: string) => {
  if (!name) return "";

  return name
    .toLowerCase()
    .split(/([\s-'])/) // Split on spaces, hyphens, and apostrophes but keep delimiters
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
};

export default formatName;
