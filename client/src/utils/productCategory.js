const categoryAliases = {
  fish: [
    "fish",
    "pet",
    "pets",
    "aquatic pet",
    "aquatic pets",
    "aquatic animal",
    "aquatic animals",
    "aquatic pet and animal",
    "aquatic pets and animals",
  ],
  plants: [
    "plant",
    "plants",
    "aquatic plant",
    "aquatic plants",
    "aquarium plant",
    "aquarium plants",
    "aquatic and aquarium plants",
  ],
  aquarium: [
    "aquarium",
    "aquarium product",
    "aquarium products",
    "aquarium accessory",
    "aquarium accessories",
    "aquarium products and accessories",
  ],
};

function categoryKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function normalizeProductCategory(value) {
  const key = categoryKey(value);
  return (
    Object.entries(categoryAliases).find(([, aliases]) =>
      aliases.includes(key),
    )?.[0] || key
  );
}

export function getProductCategoryLabel(value) {
  const category = normalizeProductCategory(value);
  if (category === "fish") return "Aquatic pets";
  if (category === "plants") return "Aquatic plants";
  if (category === "aquarium") return "Aquarium products";
  return value || "Uncategorized";
}
