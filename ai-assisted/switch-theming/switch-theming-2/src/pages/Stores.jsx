import { stores } from "../data/mockData";
import Badge from "../components/UI/Badge";

export default function Stores() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Stores</h1>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {stores.map((s) => (
          <div
            key={s.id}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-center justify-between">
              <img src={s.logo} alt={s.name} className="w-12 h-12 rounded-lg object-cover" />
              <Badge label={s.status} variant={s.status === "Active" ? "active" : "inactive"} />
            </div>
            <div>
              <div className="font-bold" style={{ color: "var(--text-primary)" }}>{s.name}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.location}</div>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Products</div>
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>{s.productCount}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Revenue</div>
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>$ {s.revenue.toFixed(0)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
