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
  theme: "light",
  toggleTheme: () => { },
  setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from the class already on <html> (set by inline script), defaulting to "light"
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const applyTheme = (t: Theme) => {
    if (typeof document === "undefined") return;
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
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", t === "dark" ? "#0D0F12" : "#F4F5F7");
    }
  };

  useEffect(() => {
    // Check URL override
    try {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme") as Theme | null;
      if (themeParam === "light" || themeParam === "dark") {
        setTheme(themeParam);
        return;
      }
    } catch {
      // ignore URLSearchParams errors
    }

    const isHtmlDark = document.documentElement.classList.contains("dark");
    const currentTheme: Theme = isHtmlDark ? "dark" : "light";
    if (theme !== currentTheme) {
      setThemeState(currentTheme);
    }
    applyTheme(currentTheme);
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

