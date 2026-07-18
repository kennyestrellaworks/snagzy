import React from "react";
import themesData from "../themes.json";

export const ColorPalette = () => {
  return (
    <div className="p-6" style={{ background: "var(--bg-base)" }}>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Color Palettes
      </h1>

      {/* Grid of 3 columns for themes */}
      <div className="grid grid-cols-3 gap-6">
        {themesData.themes.map((theme) => (
          <div key={theme.name}>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {theme.label}
            </h2>

            {/* Colors grid for this theme */}
            <div
              className="space-y-2"
              style={{
                background: theme.variables["--bg-base"],
                padding: "1rem",
                borderRadius: "0.5rem",
                border: `1px solid ${theme.variables["--border"]}`,
              }}
            >
              {Object.entries(theme.variables).map(
                ([variableName, hexValue]) => (
                  <div
                    key={variableName}
                    className="flex items-center gap-3 p-2 rounded"
                    style={{
                      background: theme.variables["--bg-surface"],
                      border: `1px solid ${theme.variables["--border"]}`,
                    }}
                  >
                    {/* Color Swatch */}
                    <div
                      className="w-8 h-8 rounded flex-shrink-0 border"
                      style={{
                        background: hexValue,
                        borderColor: theme.variables["--border"],
                      }}
                    />

                    {/* Variable Name and Hex Value */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-mono truncate"
                        style={{ color: theme.variables["--text-primary"] }}
                      >
                        {variableName}
                      </p>
                    </div>
                    <p
                      className="text-xs font-mono font-semibold flex-shrink-0"
                      style={{ color: theme.variables["--text-secondary"] }}
                    >
                      {hexValue}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
