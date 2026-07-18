import { ChevronLeft, ChevronDown, Palette } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import themesData from "../themes.json";

const THEME_LABELS = themesData.themes.reduce((acc, theme) => {
  acc[theme.name] = theme.label;
  return acc;
}, {});

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTheme, setActiveTheme, themes } = useTheme();
  const [showThemes, setShowThemes] = useState(false);
  const [showUser, setShowUser] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setActiveTheme(savedTheme);
    } else {
      setActiveTheme("ocean-breeze");
      localStorage.setItem("selectedTheme", "ocean-breeze");
    }
  }, [setActiveTheme]);

  // Handle theme selection and save to localStorage
  const handleThemeSelect = (themeName) => {
    setActiveTheme(themeName);
    localStorage.setItem("selectedTheme", themeName);
    setShowThemes(false);
  };

  const pageName = location.pathname.replace("/", "") || "dashboard";
  const isAgentView = location.pathname === "/inventory";

  return (
    <header
      className="h-14 flex items-center px-5 border-b flex-shrink-0 sticky top-0 z-10"
      style={{ background: "var(--bg-header)", borderColor: "var(--border)" }}
    >
      {/* Left: breadcrumb-style navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={18} />
        </button>
        {isAgentView && (
          <>
            <span
              className="text-sm font-medium px-3 py-1 rounded cursor-pointer"
              style={{
                background: "var(--bg-badge)",
                color: "var(--text-primary)",
              }}
            >
              Agent View
            </span>
            <span
              className="text-sm px-3 py-1 rounded cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
            >
              Back
            </span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Theme switcher */}
      <div className="relative mr-4">
        <button
          onClick={() => {
            setShowThemes((p) => !p);
            setShowUser(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "var(--bg-badge)",
            color: "var(--text-secondary)",
          }}
        >
          <Palette size={15} />
          {THEME_LABELS[activeTheme] || activeTheme}
          <ChevronDown size={14} />
        </button>
        {showThemes && (
          <div
            className="absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg border overflow-hidden z-50"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => handleThemeSelect(t.name)}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{
                  background:
                    activeTheme === t.name
                      ? "var(--bg-sidebar-active)"
                      : "transparent",
                  color:
                    activeTheme === t.name
                      ? "var(--text-sidebar-active)"
                      : "var(--text-primary)",
                }}
              >
                {THEME_LABELS[t.name] || t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      <div className="relative">
        <button
          onClick={() => {
            setShowUser((p) => !p);
            setShowThemes(false);
          }}
          className="flex items-center gap-2"
        >
          <img
            src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1"
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-2"
            style={{ ringColor: "var(--accent)" }}
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Welcome
            </p>
            <p
              className="text-sm font-semibold leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Kenny Estrella
            </p>
          </div>
          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        </button>
      </div>

      {/* Backdrop */}
      {(showThemes || showUser) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowThemes(false);
            setShowUser(false);
          }}
        />
      )}
    </header>
  );
}
