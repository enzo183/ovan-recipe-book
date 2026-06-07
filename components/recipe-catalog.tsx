"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CATEGORY_ORDER,
  FILTER_OPTIONS,
  formatIngredient,
  getScaleFactor,
  recipeMatchesSearch,
  type CategoryFilter,
  type Recipe,
  type RecipeCategory,
} from "@/lib/recipe-utils";

const difficultyStyles: Record<string, string> = {
  Facile: "bg-emerald-100 text-emerald-800",
  Moyen: "bg-amber-100 text-amber-800",
  Difficile: "bg-rose-100 text-rose-800",
};

function SearchBar({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="recipe-search" className="text-sm font-semibold text-stone-100">
        Rechercher
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
          aria-hidden
        >
          ⌕
        </span>
        <input
          id="recipe-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nom, ingrédient, fromage, catégorie…"
          className="w-full rounded-xl border border-stone-700 bg-stone-900 py-3 pl-11 pr-10 text-stone-100 placeholder:text-stone-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
        {value && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-200"
          >
            ✕
          </button>
        )}
      </div>
      {value.trim() && (
        <p className="text-sm text-stone-400">
          {resultCount} burger{resultCount > 1 ? "s" : ""} trouvé
          {resultCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

function PortionsSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-sm font-semibold text-stone-100">
          Nombre de burgers
        </p>
        <p className="mt-0.5 text-sm text-stone-400">
          Les quantités s&apos;ajustent automatiquement (ex.&nbsp;: 1 steak → 4
          steaks pour 4 burgers).
        </p>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          aria-label="Moins de burgers"
          disabled={value <= 1}
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-600 bg-stone-800 text-lg font-medium text-stone-200 transition-colors hover:border-amber-500 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-[3rem] text-center text-xl font-bold tabular-nums text-amber-400">
          {value}
        </span>
        <button
          type="button"
          aria-label="Plus de burgers"
          onClick={() => onChange(value + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-600 bg-stone-800 text-lg font-medium text-stone-200 transition-colors hover:border-amber-500 hover:bg-stone-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

function CategoryFilterBar({
  value,
  onChange,
}: {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}) {
  return (
    <div
      className="flex flex-col gap-2 sm:gap-3"
      role="group"
      aria-label="Filtrer par catégorie"
    >
      <p className="text-sm font-semibold text-stone-100">Catégorie</p>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-600 text-white shadow-sm"
                  : "border border-stone-600 bg-stone-800 text-stone-300 hover:border-amber-500 hover:bg-stone-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  targetServings,
}: {
  recipe: Recipe;
  targetServings: number;
}) {
  const scaleFactor = getScaleFactor(recipe, targetServings);
  const scaledIngredients = useMemo(
    () =>
      recipe.ingredients.map((ingredient) =>
        formatIngredient(ingredient, scaleFactor),
      ),
    [recipe.ingredients, scaleFactor],
  );

  const difficultyClass =
    difficultyStyles[recipe.difficulty] ?? "bg-stone-100 text-stone-700";

  const servingsNote = `Pour ${targetServings} burger${targetServings > 1 ? "s" : ""}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-700/80 bg-stone-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-900/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${difficultyClass}`}
        >
          {recipe.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-stone-50 transition-colors group-hover:text-amber-400">
            {recipe.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-stone-400">
            <span aria-hidden>⏱</span>
            {recipe.prepTime}
            <span className="text-stone-600">·</span>
            <span className="font-medium text-amber-500">{servingsNote}</span>
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Ingrédients
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-stone-300">
            {scaledIngredients.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
            {scaledIngredients.length > 4 && (
              <li className="text-xs text-stone-500">
                + {scaledIngredients.length - 4} autres…
              </li>
            )}
          </ul>
        </div>

        <details className="mt-auto group/details">
          <summary className="cursor-pointer list-none text-sm font-medium text-amber-500 transition-colors hover:text-amber-400 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1">
              Voir toutes les quantités et les étapes
              <span className="transition-transform group-open/details:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <ul className="mt-3 space-y-1.5 border-t border-stone-800 pt-3 text-sm text-stone-300">
            {scaledIngredients.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-stone-300">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-400">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  );
}

function RecipeSection({
  category,
  recipes,
  targetServings,
  showHeading,
}: {
  category: RecipeCategory;
  recipes: Recipe[];
  targetServings: number;
  showHeading: boolean;
}) {
  if (recipes.length === 0) return null;

  return (
    <section aria-labelledby={`section-${category}`} className="space-y-6">
      {showHeading && (
        <div className="flex items-end justify-between gap-4 border-b border-stone-800 pb-3">
          <h2
            id={`section-${category}`}
            className="text-2xl font-bold tracking-tight text-stone-50"
          >
            {category}
          </h2>
          <span className="text-sm text-stone-400">
            {recipes.length} recette{recipes.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} targetServings={targetServings} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyResultsMessage({
  searchQuery,
  categoryFilter,
}: {
  searchQuery: string;
  categoryFilter: CategoryFilter;
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const message = hasSearch
    ? `Aucun burger ne correspond à « ${searchQuery.trim()} ».`
    : categoryFilter === "Toutes"
      ? "Aucun burger disponible pour le moment."
      : `Aucun burger dans « ${categoryFilter} » pour le moment.`;

  return (
    <p className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/60 px-6 py-10 text-center text-stone-400">
      {message}
    </p>
  );
}

export function RecipeCatalog({ recipes }: { recipes: Recipe[] }) {
  const [targetServings, setTargetServings] = useState(4);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("Toutes");
  const [searchQuery, setSearchQuery] = useState("");

  const searchedRecipes = useMemo(
    () => recipes.filter((recipe) => recipeMatchesSearch(recipe, searchQuery)),
    [recipes, searchQuery],
  );

  const recipesByCategory = useMemo(() => {
    const grouped: Record<RecipeCategory, Recipe[]> = {
      "Menu classique": [],
      "Burgers du moment": [],
    };
    for (const recipe of searchedRecipes) {
      grouped[recipe.category].push(recipe);
    }
    return grouped;
  }, [searchedRecipes]);

  const visibleCategories = useMemo(() => {
    if (categoryFilter === "Toutes") {
      return CATEGORY_ORDER;
    }
    return [categoryFilter];
  }, [categoryFilter]);

  const totalVisibleCount = searchedRecipes.filter((recipe) =>
    categoryFilter === "Toutes" ? true : recipe.category === categoryFilter,
  ).length;

  const hasVisibleRecipes = visibleCategories.some(
    (category) => recipesByCategory[category].length > 0,
  );

  return (
    <>
      <div className="mb-10 space-y-4">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-4 shadow-sm sm:p-5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={totalVisibleCount}
          />
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-4 shadow-sm sm:p-5">
          <CategoryFilterBar
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-4 shadow-sm sm:p-5">
          <PortionsSelector
            value={targetServings}
            onChange={setTargetServings}
          />
        </div>
      </div>

      {!hasVisibleRecipes ? (
        <EmptyResultsMessage
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
      ) : (
        <div className="space-y-14">
          {visibleCategories.map((category) => (
            <RecipeSection
              key={category}
              category={category}
              recipes={recipesByCategory[category]}
              targetServings={targetServings}
              showHeading={categoryFilter === "Toutes" && !searchQuery.trim()}
            />
          ))}
        </div>
      )}
    </>
  );
}
