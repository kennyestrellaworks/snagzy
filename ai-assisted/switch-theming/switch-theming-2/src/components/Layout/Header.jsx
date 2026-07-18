import { ChevronLeft, ChevronDown, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const themeLabels = {
  "ocean-breeze": "Ocean Breeze",
  "deep-cyan": "Deep Cyan",
  "midnight-mode": "Midnight Mode",
  "space-obsidian": "Space Obsidian",
  "urban-concrete": "Urban Concrete",
  "industrial-slate": "Industrial Slate",
};

export default function Header() {
  const navigate = useNavigate();
  const { themes, activeTheme, switchTheme } = useTheme();
  const [showThemes, setShowThemes] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-20"
      style={{ backgroundColor: "var(--bg-header)", borderColor: "var(--border)" }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-base shadow"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            S
          </div>
          <span className="text-lg font-extrabold tracking-tight" style={{ color: "var(--logo-text)" }}>
            Snagzy
          </span>
        </div>

        {/* Nav breadcrumb */}
        <div className="flex items-center gap-2 ml-2">
          <button
            className="text-sm px-3 py-1 rounded-md font-medium transition hover:opacity-80"
            style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-badge)" }}
          >
            Agent View
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-md font-medium transition hover:opacity-80"
            style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-badge)" }}
          >
            <ChevronLeft size={14} />
            Back
          </button>
        </div>
      </div>

      {/* Right: Theme picker + User */}
      <div className="flex items-center gap-4">
        {/* Theme switcher */}
        <div className="relative">
          <button
            onClick={() => setShowThemes((v) => !v)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition hover:opacity-80"
            style={{
              backgroundColor: "var(--bg-badge)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <Palette size={14} />
            <span className="hidden sm:inline">{themeLabels[activeTheme.name] || activeTheme.name}</span>
            <ChevronDown size={12} />
          </button>

          {showThemes && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl shadow-xl border overflow-hidden z-50"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => { switchTheme(theme.name); setShowThemes(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition hover:opacity-80"
                  style={{
                    backgroundColor:
                      activeTheme.name === theme.name ? "var(--bg-sidebar-active)" : "transparent",
                    color:
                      activeTheme.name === theme.name
                        ? "var(--text-sidebar-active)"
                        : "var(--text-primary)",
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 border"
                    style={{
                      backgroundColor: theme.variables["--accent"],
                      borderColor: theme.variables["--border"],
                    }}
                  />
                  {themeLabels[theme.name] || theme.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-2">
          <img
            src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40"
            alt="Kenny Estrella"
            className="w-8 h-8 rounded-full object-cover ring-2"
            style={{ ringColor: "var(--accent)" }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Welcome</span>
            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
              Kenny Estrella
              <ChevronDown size={12} style={{ color: "var(--text-muted)" }} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
