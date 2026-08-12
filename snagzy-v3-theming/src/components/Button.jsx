import { useState } from "react";

export function LoadMoreVariant({ onClick, children, style = {}, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: hover ? "#9dbee6" : "#BFDBFE", // darker blue on hover
        color: hover ? "#0a3abd" : "#1D4ED8",
        padding: "0.3rem 1.5rem",
        border: "none",
        borderRadius: "0.375rem",
        fontSize: ".8rem",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function LoadMoreProduct({ onClick, children, style = {}, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: hover ? "#2563eb" : "#1D4ED8", // darker blue on hover
        color: "#fff",
        padding: "0.5rem 1.5rem",
        border: "none",
        borderRadius: "0.375rem",
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
