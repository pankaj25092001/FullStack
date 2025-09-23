"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center font-extrabold text-2xl tracking-tight 
                     bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 
                     bg-clip-text text-transparent select-none"
        >
          Yule
        </Link>

        {/* Navigation / Actions */}
        <nav className="flex items-center gap-5">
          {/* Log In */}
          <Link href="/login">
            <Button
              variant="outline"
              className="rounded-full border-2 border-pink-500/80 
                         text-pink-600 dark:text-pink-400 
                         hover:bg-pink-500 hover:text-white 
                         transition-all duration-300 ease-in-out"
            >
              Log In
            </Button>
          </Link>

          {/* Sign Up */}
          <Link href="/signup">
            <Button
              className="rounded-full px-6 font-semibold shadow-md 
                         bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 
                         text-white hover:scale-105 hover:shadow-lg 
                         transition-transform duration-300 ease-in-out"
            >
              Sign Up
            </Button>
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative flex h-8 w-16 items-center rounded-full 
                         bg-gray-200 dark:bg-gray-700 px-1 transition-colors duration-300"
            >
              <span
                className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  theme === "light" ? "translate-x-0" : "translate-x-8"
                }`}
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-pink-500" />
                ) : (
                  <Moon className="h-4 w-4 text-indigo-400" />
                )}
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
