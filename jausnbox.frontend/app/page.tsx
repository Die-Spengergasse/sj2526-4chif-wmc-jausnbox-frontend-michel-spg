import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-items-center gap-16 sm:p-10">
      <div className="text-4xl font-bold text-center">
        Die Jausnbox für Rezeptideen
      </div>
      <div>
        <span className="text-5xl" role="img" aria-label="🍳🥗🍕🍰">
          🍳🥗🍕🍰
        </span>
      </div>
      <div className="text-center text-lg max-w-md">
        Entdeck’ dei Lieblingsrezepte – ob Kochneuling oder Haubenkoch, für alle
        is’ wos drin!
      </div>

      <Link
        href="/recipes"
        className="group relative inline-flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 px-6 py-3 text-lg font-medium transition-colors duration-300 overflow-hidden active:scale-[0.98]
                    dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800"
      >
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-10" />

        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-2">
          Rezepte entdecken
        </span>

        <HiArrowRight
          className="relative z-10 h-5 w-5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
