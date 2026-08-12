import { createContext, useContext, useState, useEffect } from "react";
import themesData from "../data/themes.json";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const themes = themesData.themes;
  const defaultTheme = themes.find((t) => t.isDefault) || themes[0];
  const [activeTheme, setActiveTheme] = useState(defaultTheme.name);

  useEffect(() => {
    const theme = themes.find((t) => t.name === activeTheme) || defaultTheme;
    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
