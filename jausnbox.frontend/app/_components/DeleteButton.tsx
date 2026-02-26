"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "../_actions/recipe";

export function DeleteButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteRecipe(id);
        router.push("/recipes");
      } catch (error) {
        alert("Fehler beim Löschen!");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      {/* Dezenter Trigger Button (wie Version 1) */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium 
             text-red-600 border border-red-200 rounded-lg
             hover:bg-red-50 hover:border-red-300 transition-all
             dark:text-red-400 dark:border-red-900/50 
             dark:hover:bg-red-950/30 dark:hover:border-red-800"
      >
        <svg
          className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
        <span>Rezept löschen</span>
      </button>

      {/* Das Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-800"
            role="dialog"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Rezept entfernen?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Möchtest du dieses Rezept wirklich aus deiner Sammlung löschen?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                Abbrechen
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 border border-red-200 
                 hover:bg-red-50 transition-colors disabled:opacity-50
                 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/30"
              >
                {isPending ? (
                  <span className="h-3 w-3 animate-spin border-2 border-red-600/30 border-t-red-600 rounded-full" />
                ) : null}
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
