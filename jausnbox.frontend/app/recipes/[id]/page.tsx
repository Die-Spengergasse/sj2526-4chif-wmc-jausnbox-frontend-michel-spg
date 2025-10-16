import Link from "next/link";
import { notFound } from "next/navigation";
import { Recipe } from "../../_types/Recipe";

// kann auch ausgelagert werden in eine API Datei in einem Ordner lib oder service
async function getRecipe(id: string): Promise<Recipe | null> {
  const res = await fetch(`http://localhost:3001/api/recipes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // extracts the id from the params object.
  const recipe = await getRecipe(id);

  if (!recipe) {
    return notFound();
  }

  // Split instructions into steps by periods or newlines
  const instructionSteps = recipe.instructions
    ? recipe.instructions
        .split(/[.\n,]/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    : [];

  return (
    <div className="mx-auto max-w-5xl my-5">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors
                    dark:text-emerald-400 dark:hover:text-emerald-400"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Zurück zu den Rezepten
        </Link>
      </div>

      {/* Wrapper für das Rezept */}
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8
                      dark:bg-gray-800 dark:border-gray-700"
      >
        {/* Title */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl dark:text-white">
            {recipe.title}
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          {/* Image */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            {/* You can swap <img> for next/image if you configured remotePatterns */}
            {/* <img
              src={`http://localhost:4000/images/${recipe.image}`}
              alt={recipe.title}
              className="h-full w-full object-cover"
            /> */}
          </div>

          {/* Meta + times + rating */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-lg border border-gray-200 p-4
                              dark:bg-gray-900 dark:border-gray-700"
              >
                <p className="text-xs uppercase text-gray-500">
                  Zubereitungsdauer
                </p>
                <p className="text-lg font-semibold dark:text-emerald-400">
                  {recipe.duration} mins
                </p>
              </div>
            </div>

            {/* Ingredients */}
            <div
              className="rounded-xl border border-gray-200 p-5
                            dark:bg-gray-900 dark:border-gray-700"
            >
              <h2 className="mb-3 text-lg font-semibold dark:text-white">
                Zutaten für 2 Personen
              </h2>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="py-0.5">
                    {item.name} - {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="mt-8 rounded-xl border border-gray-200 p-5
                      dark:bg-gray-900 dark:border-gray-700"
        >
          <h2 className="mb-3 text-lg font-semibold dark:text-white">
            Zubereitung
          </h2>
          {instructionSteps.length > 0 ? (
            <ol className="list-decimal space-y-2 pl-5 text-gray-700 dark:text-gray-300">
              {instructionSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Keine Zubereitung vorhanden!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}