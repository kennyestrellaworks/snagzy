import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  IoColorPaletteSharp,
  Logout,
  Settings,
  User,
} from "./SVG";
import themesData from "../data/themes.json";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const THEME_LABELS = themesData.themes.reduce((acc, theme) => {
  acc[theme.name] = theme.label;
  return acc;
}, {});

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { getUserById } = useData();
  const loggedInUser = getUserById("people43210987nopqrstu");

  const { activeTheme, setActiveTheme, themes } = useTheme();
  const [showThemes, setShowThemes] = useState(false);

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

  const navigate = useNavigate();
  // const location = useLocation();

  const handleBack = () => {
    // Browser history, this maintains the correct stack
    navigate(-1);
  };

  // Determine if back button should be disabled
  const isBackDisabled = () => {
    return window.history.length <= 1;
  };

  // Get button text
  const getButtonText = () => {
    return "Back";
  };

  return (
    <header
      className="w-full top-0 z-60 border-b p-2"
      style={{ background: "var(--bg-header)", borderColor: "var(--border)" }}
    >
      <div className="flex w-full h-10 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Agent View
          </h1>
          <div className="flex">
            <button
              className="header-back-button px-3 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBack}
              disabled={isBackDisabled()}
              title={
                isBackDisabled() ? "No page to go back to" : getButtonText()
              }
            >
              {getButtonText()}
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="relative mr-4">
              <button
                onClick={() => setShowThemes((p) => !p)}
                className="theme-switcher-button flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <IoColorPaletteSharp className="w-4 h-4" />
                {THEME_LABELS[activeTheme] || activeTheme}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showThemes && (
                <>
                  {/* Backdrop: covers whole screen and closes dropdown on click */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowThemes(false)}
                  />
                  {/* Dropdown menu */}
                  <div className="theme-switcher-dropdown absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg overflow-hidden z-20">
                    {themes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => handleThemeSelect(t.name)}
                        className={`theme-switcher-dropdown-button w-full text-left px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeTheme === t.name ? "theme-switcher-dropdown-button-active" : ""}`}
                      >
                        {THEME_LABELS[t.name] || t.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Profile button  */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="profile-dropdown flex gap-1 items-center px-2 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  src={loggedInUser.image}
                  alt={loggedInUser.firstName + " " + loggedInUser.lastName}
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden md:block text-left">
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Welcome
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {loggedInUser.firstName + " " + loggedInUser.lastName}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="profile-dropdown-button absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p
                        className="text-sm font-medium leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {loggedInUser.firstName + " " + loggedInUser.lastName}
                      </p>
                      <p
                        className="text-xs leading-tight"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {loggedInUser.contact.email}
                      </p>
                      <p
                        className="text-xs leading-tight"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {loggedInUser.jobTitle}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <button className="profile-dropdown-links w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors cursor-pointer">
                        <User className="w-4 h-4" />
                        <Link to="/" className="leading-tight">
                          Profile
                        </Link>
                      </button>

                      <button className="profile-dropdown-links w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <Link to="/" className="leading-tight">
                          Settings
                        </Link>
                      </button>

                      {/* <div className="border-t border-gray-200 my-1" /> */}
                      <div
                        className="border-t my-1"
                        style={{ border: "var(--text-secondary)" }}
                      />

                      <button className="profile-dropdown-link-sign-out w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors cursor-pointer">
                        <Logout className="w-4 h-4" />
                        <span className="leading-tight">Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
