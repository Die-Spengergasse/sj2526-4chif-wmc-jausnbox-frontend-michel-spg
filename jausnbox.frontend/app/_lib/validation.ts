import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string()
    .min(1, 'Zutatname ist erforderlich')
    .max(100, 'Max. 100 Zeichen'),
  quantity: z.string()
    .min(1, 'Menge ist erforderlich')
    .max(50, 'Max. 50 Zeichen'),
});

export const recipeSchema = z.object({
  title: z
    .string()
    .min(1, 'Titel ist erforderlich')
    .max(200, 'Titel darf max. 200 Zeichen haben'),
  description: z
    .string()
    .min(1, 'Beschreibung ist erforderlich')
    .max(2000, 'Beschreibung darf max. 2000 Zeichen haben'),
  duration: z
    .number({ message: 'Bitte eine Zahl eingeben' })
    .int('Nur ganze Zahlen')
    .min(1, 'Dauer muss mindestens 1 Minute sein')
    .max(1440, 'Dauer darf max. 1440 Minuten (24h) sein'),
  instructions: z
    .string()
    .min(1, 'Zubereitung ist erforderlich')
    .max(10000, 'Zubereitung darf max. 10.000 Zeichen haben'),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'Mindestens eine Zutat erforderlich'),
});

// TypeScript-Type automatisch aus dem Schema ableiten
export type RecipeFormData = z.infer<typeof recipeSchema>;

// Hilfsfunktion: Zod-Errors in ein feldbasiertes Objekt umwandeln
export type FieldErrors = Partial<Record<string, string>>;

export function formatZodErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}