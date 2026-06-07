export type RecipeCategory = "Menu classique" | "Burgers du moment";

export type CategoryFilter = "Toutes" | RecipeCategory;

export type Ingredient = {
  name: string;
  quantity: number | null;
  unit: string | null;
  scalable: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  category: RecipeCategory;
  baseServings: number;
  imageUrl: string;
  prepTime: string;
  difficulty: string;
  ingredients: Ingredient[];
  steps: string[];
};

const UNIT_LABELS: Record<string, string> = {
  g: "g",
  kg: "kg",
  ml: "ml",
  L: "L",
  cl: "cl",
  pièce: "pièce(s)",
  tranche: "tranche(s)",
  feuille: "feuille(s)",
  rondelle: "rondelle(s)",
  c_a_s: "c. à soupe",
  c_a_c: "c. à café",
};

function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(1).replace(".", ",");
}

function convertWeight(grams: number): string {
  if (grams >= 1000) {
    return `${formatNumber(grams / 1000)} kg`;
  }
  return `${formatNumber(grams)} g`;
}

function convertVolume(ml: number): string {
  if (ml >= 1000) {
    return `${formatNumber(ml / 1000)} L`;
  }
  if (ml >= 100 && ml % 10 === 0) {
    return `${formatNumber(ml / 10)} cl`;
  }
  return `${formatNumber(ml)} ml`;
}

function formatAmount(quantity: number, unit: string): string {
  if (unit === "g") {
    return convertWeight(quantity);
  }
  if (unit === "ml") {
    return convertVolume(quantity);
  }
  if (unit === "L") {
    return `${formatNumber(quantity)} L`;
  }
  if (unit === "cl") {
    return convertVolume(quantity * 10);
  }
  const label = UNIT_LABELS[unit] ?? unit;
  return `${formatNumber(quantity)} ${label}`;
}

export function getScaleFactor(recipe: Recipe, targetServings: number): number {
  return targetServings / recipe.baseServings;
}

const COUNT_UNITS = new Set([
  "pièce",
  "tranche",
  "feuille",
  "rondelle",
]);

export function formatIngredient(
  ingredient: Ingredient,
  scaleFactor: number,
): string {
  if (!ingredient.scalable || ingredient.quantity === null) {
    return ingredient.name;
  }

  const scaledQuantity = ingredient.quantity * scaleFactor;
  const unit = ingredient.unit ?? "";

  if (COUNT_UNITS.has(unit)) {
    if (scaledQuantity === 1) {
      return `1 ${ingredient.name}`;
    }
    return `${formatNumber(scaledQuantity)} ${ingredient.name}`;
  }

  const amount = formatAmount(scaledQuantity, unit);
  return `${amount} de ${ingredient.name}`;
}

export const CATEGORY_ORDER: RecipeCategory[] = [
  "Menu classique",
  "Burgers du moment",
];

export const FILTER_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "Toutes", label: "Toutes" },
  { value: "Menu classique", label: "Menu classique" },
  { value: "Burgers du moment", label: "Burgers du moment" },
];

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getRecipeSearchableText(recipe: Recipe): string {
  const parts = [
    recipe.title,
    recipe.category,
    recipe.prepTime,
    recipe.difficulty,
    ...recipe.ingredients.map((ingredient) => ingredient.name),
    ...recipe.steps,
  ];

  return normalizeSearchText(parts.join(" "));
}

export function recipeMatchesSearch(recipe: Recipe, query: string): boolean {
  const tokens = normalizeSearchText(query.trim())
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const haystack = getRecipeSearchableText(recipe);
  return tokens.every((token) => haystack.includes(token));
}
