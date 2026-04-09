"use client";

import { useAuth } from "../_context/AuthContext";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

interface RecipeActionsProps {
  recipeId: number;
}

export default function RecipeActions({ recipeId }: RecipeActionsProps) {
  const { user, isLoading } = useAuth();

  // Nicht eingeloggt oder noch am Laden → nichts anzeigen
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="flex gap-2 md:justify-end md:items-center">
      <EditButton id={recipeId} />
      <DeleteButton id={recipeId} />
    </div>
  );
}