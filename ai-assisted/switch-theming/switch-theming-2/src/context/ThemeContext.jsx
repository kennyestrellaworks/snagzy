import { createContext, useContext, useEffect, useState } from "react";
import themesConfig from "../config/themes.json";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const defaultTheme = themesConfig.themes.find((t) => t.isDefault) || themesConfig.themes[0];
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem("snagzy-theme");
    return themesConfig.themes.find((t) => t.name === saved) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem("snagzy-theme", activeTheme.name);
  }, [activeTheme]);

  const switchTheme = (name) => {
    const theme = themesConfig.themes.find((t) => t.name === name);
    if (theme) setActiveTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, themes: themesConfig.themes, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
