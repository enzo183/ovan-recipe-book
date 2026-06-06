import recipesData from "@/data/recipes.json";
import { RecipeCatalog } from "@/components/recipe-catalog";
import type { Recipe } from "@/lib/recipe-utils";

const recipes = recipesData as Recipe[];

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50/80 via-stone-50 to-orange-50/50">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="mb-10 text-center sm:mb-14 sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
            Catalogue recettes
          </p>
          <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Catalogue burgers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 sm:mx-0">
            Filtrez le menu classique ou les burgers du moment, puis ajustez le
            nombre de burgers — les ingrédients suivent (1 steak par burger).
          </p>
        </header>

        <RecipeCatalog recipes={recipes} />
      </main>
    </div>
  );
}
