"use client";

import { useState, useRef } from "react";
import { createRecipe } from "../_actions/recipe";
import {
  recipeSchema,
  formatZodErrors,
  type FieldErrors,
} from "../_lib/validation";

interface Ingredient {
  name: string;
  quantity: string;
}

export default function AddRecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false); // erst nach Submit validieren
  const [dragActive, setDragActive] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: "name" | "quantity",
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Bild darf maximal 5MB groß sein");
      return false;
    }
    if (!file.type.startsWith("image/")) {
      setError("Bitte wählen Sie ein Bild aus");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setImageFile(file);
      setError("");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setImageFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    setError("");

    // Client-seitige Validation
    const rawData = {
      title,
      description,
      duration: Number(duration),
      instructions,
      ingredients,
    };

    const validation = recipeSchema.safeParse(rawData);
    if (!validation.success) {
      setFieldErrors(formatZodErrors(validation.error));
      setLoading(false);
      return;
    }

    setFieldErrors({}); // Validation bestanden → Fehler löschen

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("instructions", instructions);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      ingredients.forEach((ingredient: Ingredient, index: number) => {
        formData.append(`ingredients[${index}][name]`, ingredient.name);
        formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      });

      // Server Action aufrufen
      const result = await createRecipe(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccessMessage("Rezept erfolgreich hinzugefügt!");
      setShowForm(false);

      setTitle("");
      setDescription("");
      setDuration("");
      setInstructions("");
      setIngredients([{ name: "", quantity: "" }]);
      setImageFile(null);

      setTimeout(() => {
        setSuccessMessage("");
        setShowForm(true);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Speichern des Rezepts",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fehler nur anzeigen wenn schon submitted UND Fehler vorhanden
  const showError = (name: string) => submitted && !!fieldErrors[name];

  const FieldError = ({ name }: { name: string }) => {
    if (!showError(name)) return null;
    return (
      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
        {fieldErrors[name]}
      </p>
    );
  };

  // Border-Klasse: rot nur wenn submitted UND Fehler vorhanden, aber bei Focus normal
  const borderClass = (name: string) =>
    showError(name)
      ? "border-red-500 dark:border-red-500 focus:border-orange-500 dark:focus:border-orange-400"
      : "border-gray-300 dark:border-slate-700";

  const inputClass = (name: string) =>
    showError(name)
      ? "border-red-500 dark:border-red-500 focus:border-orange-500 dark:focus:border-orange-400"
      : "border-gray-300 dark:border-slate-700";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Neues Rezept hinzufügen
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Teilen Sie Ihr liebstes Rezept mit der Community
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
            <p className="text-green-800 dark:text-green-300 font-medium">
              ✓ {successMessage}
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              {showForm ? "Ausblenden" : "Anzeigen"}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
            <p className="text-red-800 dark:text-red-300 font-medium">
              {error}
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              {showForm ? "Ausblenden" : "Anzeigen"}
            </button>
          </div>
        )}

        {/* Form - Toggle mit Animation */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Titel *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="z.B. Spaghetti Carbonara"
                className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition ${inputClass("title")}`}
              />
              <FieldError name="title" />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Beschreibung *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreiben Sie das Rezept..."
                rows={4}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition resize-none ${inputClass("description")}`}
              />
              <FieldError name="description" />
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Dauer (Minuten) *
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition ${inputClass("duration")}`}
              />
              <FieldError name="duration" />
            </div>

            {/* Instructions */}
            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Zubereitung *
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Schritt-für-Schritt Anleitung..."
                rows={6}
                className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition resize-none ${inputClass("instructions")}`}
              />
              <FieldError name="instructions" />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Bild hochladen
              </label>

              <input
                ref={fileInputRef}
                id="image-input"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition ${
                  dragActive
                    ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-orange-400 dark:hover:border-orange-400"
                }`}
              >
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    Klicken zum Hochladen
                  </span>
                  <br />
                  <span className="text-gray-500 dark:text-gray-500">
                    oder Drag & Drop
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF bis 5MB
                </p>
              </div>

              {imageFile && (
                <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    <span className="font-medium">{imageFile.name}</span>{" "}
                    ausgewählt {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Zutaten *
              </label>
              <div className="space-y-3">
                {ingredients.map((ingredient: Ingredient, index: number) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={ingredient.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateIngredient(index, "name", e.target.value)
                        }
                        className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition ${inputClass(`ingredients.${index}.name`)}`}
                      />
                      <FieldError name={`ingredients.${index}.name`} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Menge"
                        value={ingredient.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateIngredient(index, "quantity", e.target.value)
                        }
                        className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition ${inputClass(`ingredients.${index}.quantity`)}`}
                      />
                      <FieldError name={`ingredients.${index}.quantity`} />
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition font-semibold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition font-medium"
                >
                  + Zutat hinzufügen
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Wird gespeichert..." : "Rezept speichern"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
