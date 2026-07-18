export default function Badge({ label, variant = "default" }) {
  const styles = {
    active: {
      backgroundColor: "var(--green-bg)",
      color: "var(--green)",
    },
    inactive: {
      backgroundColor: "var(--red-bg)",
      color: "var(--red)",
    },
    default: {
      backgroundColor: "var(--bg-badge)",
      color: "var(--text-secondary)",
    },
  };

  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={styles[variant] || styles.default}
    >
      {label}
    </span>
  );
}
