'use server';
import { revalidatePath } from 'next/cache';

export async function createRecipe(formData: FormData) {
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
    // revalidatePath('/recipes');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fehler beim Speichern',
    };
  }
}
