'use server';
import { revalidatePath } from 'next/cache'; 
import { recipeSchema, formatZodErrors } from '../_lib/validation';

export async function createRecipe(formData: FormData) {
  // Validierung der Formulardaten mit Zod 
  // FormData extrahieren 
  const rawIngredients: { name: string; quantity: string }[] = [];
  let i = 0;
  while (formData.has(`ingredients[${i}][name]`)) {
    rawIngredients.push({
      name: formData.get(`ingredients[${i}][name]`) as string,
      quantity: formData.get(`ingredients[${i}][quantity]`) as string,
    });
    i++;
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    duration: Number(formData.get('duration')),
    instructions: formData.get('instructions') as string,
    ingredients: rawIngredients,
  };

  // Server-seitige Validation mit Zod 
  const result = recipeSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(result.error),
    };
  }

  try {
    const response = await fetch('http://localhost:3001/api/recipes', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Fehler beim Speichern');
    }

    const data = await response.json();

    // Cache invalidieren nach erfolgreichem Speichern
    revalidatePath('/recipes');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fehler beim Speichern',
    };
  }
}

export async function updateRecipe(id: number, formData: FormData) {
  const rawIngredients: { name: string; quantity: string }[] = [];
  let i = 0;
  while (formData.has(`ingredients[${i}][name]`)) {
    rawIngredients.push({
      name: formData.get(`ingredients[${i}][name]`) as string,
      quantity: formData.get(`ingredients[${i}][quantity]`) as string,
    });
    i++;
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    duration: Number(formData.get('duration')),
    instructions: formData.get('instructions') as string,
    ingredients: rawIngredients,
  };

  // Server-seitige Validation mit Zod
  const result = recipeSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(result.error),
    };
  }

  try {
    const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.status === 401) {
      return {
        success: false,
        error: 'Nicht eingeloggt. Bitte zuerst anmelden.',
      };
    }

    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren');
    }

    const data = await response.json();
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
    };
  }
}

export async function deleteRecipe(id: string) {
  try {
    const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Fehler beim Löschen');
    }

    revalidatePath('/recipes');
  } catch (error) {
    throw error;
  }
}