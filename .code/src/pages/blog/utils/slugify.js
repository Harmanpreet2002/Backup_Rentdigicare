function createSlug(title) {
  let initialSlug = title;
  initialSlug = initialSlug
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase();
  const timestamp = Date.now();
  const uniqueSlug = initialSlug + "-" + timestamp;

  return uniqueSlug;
}

export default createSlug;
