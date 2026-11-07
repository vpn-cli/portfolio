"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => { },
  setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
  };

  useEffect(() => {
    // Check URL override, saved local theme, or system preference
    try {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme") as Theme | null;
      if (themeParam === "light" || themeParam === "dark") {
        setThemeState(themeParam);
        applyTheme(themeParam);
        return;
      }
    } catch {
      // ignore URLSearchParams errors
    }

    try {
      const saved = localStorage.getItem("portfolio-theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
        applyTheme(saved);
        return;
      }
    } catch {
      // ignore localStorage errors
    }

    // Default to dark mode
    applyTheme("dark");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("portfolio-theme", t);
    } catch {
      // ignore localStorage errors
    }
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    trackEvent("theme_toggle", { to: next });
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

