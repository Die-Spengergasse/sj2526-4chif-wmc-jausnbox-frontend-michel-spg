"use client";
import { Recipe } from "../_types/Recipe";
import RecipeGrid from "../_components/RecipeGrid";
import { useEffect, useState } from "react";

async function getRecipes(): Promise<Recipe[] | null> {
  const response = await fetch("http://localhost:3001/api/recipes");
  if (!response.ok) return null;
  const result = await response.json();
  // console.log(result);
  return result;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecipes =
    recipes?.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  return (
    <div className="font-sans p-8">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <label htmlFor="searchTerm" className="sr-only">
            Rezepte suchen
          </label>
          <input
            type="text"
            name="searchTerm"
            id="searchTerm"
            placeholder="Search by name ..."
            className="mb-2 w-full p-2 border border-gray-300 rounded-lg 
                     dark:bg-gray-800 dark:border-gray-700 dark:text-white
                     dark:placeholder-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            aria-label="Rezepte suchen"
          />
        </div>

        <div className="text-2xl dark:text-white">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading recipes...</span>
            </div>
          ) : (
            `Recipes: ${recipes ? recipes.length : 0}`
          )}
        </div>

        {!isLoading && <RecipeGrid recipes={filteredRecipes} />}
      </main>
    </div>
  );
}
