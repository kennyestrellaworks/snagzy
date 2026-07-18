import { Star } from "lucide-react";

export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={12}
            fill={filled ? "var(--yellow)" : "none"}
            style={{ color: filled || half ? "var(--yellow)" : "var(--border)" }}
          />
        );
      })}
    </div>
  );
}
