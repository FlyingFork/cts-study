export const CATEGORY_VARIANTS = {
  Creational: 'creational',
  Structural: 'structural',
  Behavioral: 'behavioral',
};

export function categoryVariant(category) {
  return CATEGORY_VARIANTS[category] || 'default';
}
