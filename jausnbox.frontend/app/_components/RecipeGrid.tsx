import { Recipe } from "../_types/Recipe";
import Link from "next/link";

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col
                     border border-gray-200
                     dark:bg-gray-800 dark:border-gray-700"
        >
          {/* <img
            src={recipe.image}
            alt={recipe.name}
            className="rounded-xl w-full h-48 object-cover mb-4"
          /> */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-1 dark:text-white">{recipe.title}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Dauer:</span>{" "}
              {recipe.duration} min
            </p>
          </div>
          <div className="mt-4">
            <Link href={`/recipes/${recipe.id}`}>
              <button className="w-full px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg 
                                shadow hover:bg-emerald-200 transition
                                dark:bg-gray-900 dark:text-emerald-400 
                                dark:hover:bg-gray-700 dark:border-gray-700">
                Details
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
