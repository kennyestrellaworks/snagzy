import { reviews } from "../data/mockData";
import StarRating from "../components/UI/StarRating";

export default function Reviews() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Reviews</h1>
      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-xl p-4 flex gap-4"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
          >
            <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{r.author}</span>
                  <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>on {r.product}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold" style={{ color: "var(--yellow)" }}>{r.rating.toFixed(1)}</span>
                  <StarRating rating={r.rating} />
                </div>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{r.comment}</p>
              <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{r.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
