import recipesData from "@/data/recipes.json";
import { RecipeCatalog } from "@/components/recipe-catalog";
import type { Recipe } from "@/lib/recipe-utils";

const recipes = recipesData as Recipe[];

export default function Home() {
  return (
    <div className="min-h-full bg-black">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="mb-10 text-center sm:mb-14 sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
            Les recettes du O'Van Burger
          </p>
          
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-400 sm:mx-0">
            Recherchez par nom ou ingrédient, filtrez par catégorie, puis
            ajustez le nombre de burgers.
          </p>
        </header>

        <RecipeCatalog recipes={recipes} />
      </main>
    </div>
  );
}
