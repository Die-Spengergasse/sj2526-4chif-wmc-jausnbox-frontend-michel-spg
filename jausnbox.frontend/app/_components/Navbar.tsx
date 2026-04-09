"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/recipes", label: "Rezepte" },
    ...(user ? [{ href: "/recipes/add", label: "Rezept hinzufügen" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/recipes") {
      return pathname === "/recipes" || pathname === "/recipes/";
    }
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="header mb-3 bg-white dark:bg-gray-800 rounded-lg top-0">
      <div className="flex items-center justify-between px-8 py-3">
        {/* Logo links */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Jausnbox Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="font-semibold text-xl text-gray-800 dark:text-gray-100">
            Jausnbox
          </span>
        </Link>

        {/* Desktop Navigation zentriert */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center space-x-6">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      p-3 border-b-2 duration-200 cursor-pointer
                      border-emerald-500 border-opacity-0 
                      hover:border-opacity-100 hover:text-emerald-500
                      dark:border-emerald-400 dark:hover:text-emerald-400
                      aria-[current=page]:text-emerald-500 
                      aria-[current=page]:border-emerald-500 
                      dark:aria-[current=page]:text-emerald-400 
                      dark:aria-[current=page]:border-emerald-400
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Login/Logout */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-gray-400">Laden...</span>
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors cursor-pointer px-2 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Abmelden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
              >
                Registrieren
              </Link>
            </>
          )}
        </div>

        {/* Burger Button (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-8 py-4 space-y-3">
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`
                        block py-2 px-3 rounded-md transition-colors
                        hover:bg-emerald-50 hover:text-emerald-600
                        dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400
                        ${active
                          ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 font-medium"
                          : "text-gray-700 dark:text-gray-200"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {isLoading ? (
              <span className="text-sm text-gray-400">Laden...</span>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full w-fit">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors cursor-pointer px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors py-2 px-3"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors text-center"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}