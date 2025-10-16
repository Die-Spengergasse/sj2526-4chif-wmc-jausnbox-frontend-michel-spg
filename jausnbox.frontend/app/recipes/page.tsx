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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecipes();
      setRecipes(data);
      // console.log("recipes:", recipes);
    };

    fetchData().catch((error) =>
      console.error("Error fetching recipes:", error)
    );
  }, []);

  // Filter recipes based on search term (computed, not stored)
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
            className="mb-2 w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            aria-label="Rezepte suchen"
          />
        </div>

        <div className="text-2xl">Recipes: {recipes ? recipes.length : 0}</div>
        <RecipeGrid recipes={filteredRecipes} />
      </main>
    </div>
  );
}
