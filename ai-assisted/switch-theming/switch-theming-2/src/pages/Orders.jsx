import { orders } from "../data/mockData";
import Badge from "../components/UI/Badge";

const statusVariant = (s) => {
  if (s === "Delivered") return "active";
  if (s === "Pending") return "default";
  return "inactive";
};

export default function Orders() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Orders</h1>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <div
          className="grid text-xs font-semibold px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "140px 1fr 120px 100px 120px 120px",
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-muted)",
          }}
        >
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Items</div>
          <div>Total</div>
          <div>Status</div>
        </div>
        {orders.map((o) => (
          <div
            key={o.id}
            className="grid items-center px-4 py-3 border-b last:border-b-0 text-sm"
            style={{ gridTemplateColumns: "140px 1fr 120px 100px 120px 120px", borderColor: "var(--border)" }}
          >
            <div className="font-mono text-xs" style={{ color: "var(--accent)" }}>{o.id}</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{o.customer}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{o.date}</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{o.items}</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>$ {o.total.toFixed(2)}</div>
            <div><Badge label={o.status} variant={statusVariant(o.status)} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
