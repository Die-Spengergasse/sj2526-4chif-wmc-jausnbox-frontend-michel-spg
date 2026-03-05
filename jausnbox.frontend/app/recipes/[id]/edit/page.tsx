import { notFound } from "next/navigation";
import { Recipe } from "../../../_types/Recipe";
import EditRecipeForm from "../../../_components/EditRecipeForm";

async function getRecipe(id: string): Promise<Recipe | null> {
  const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EditRecipeForm recipe={recipe} />
    </div>
  );
}