import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { products } from "../data/mockData";
import StarRating from "../components/UI/StarRating";
import Badge from "../components/UI/Badge";

export default function Products() {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Products</h1>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <div
          className="grid text-xs font-semibold px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "60px 1fr 120px 120px 100px 120px 80px",
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-muted)",
          }}
        >
          <div></div>
          <div>Name</div>
          <div>Store</div>
          <div>User</div>
          <div>Stock</div>
          <div>Revenue</div>
          <div>Status</div>
        </div>
        {products.map((p) => (
          <div
            key={p.id}
            className="grid items-center px-4 py-3 border-b last:border-b-0 text-sm cursor-pointer transition hover:opacity-80"
            style={{ gridTemplateColumns: "60px 1fr 120px 120px 100px 120px 80px", borderColor: "var(--border)" }}
            onClick={() => navigate(`/products/${p.id}`)}
          >
            <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
            <div>
              <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Eye size={11} style={{ color: "var(--text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>View details</span>
              </div>
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.store}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.user}</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.stockItems}</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>$ {p.revenue.toFixed(2)}</div>
            <div><Badge label={p.status} variant={p.status === "Active" ? "active" : "inactive"} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
