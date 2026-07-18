import { users } from "../data/mockData";
import Badge from "../components/UI/Badge";

export default function Users() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Users</h1>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <div
          className="grid text-xs font-semibold px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "60px 1fr 180px 160px 120px",
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-muted)",
          }}
        >
          <div></div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
        </div>
        {users.map((u) => (
          <div
            key={u.id}
            className="grid items-center px-4 py-3 border-b last:border-b-0 text-sm"
            style={{ gridTemplateColumns: "60px 1fr 180px 160px 120px", borderColor: "var(--border)" }}
          >
            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{u.name}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{u.email}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{u.role}</div>
            <div><Badge label={u.status} variant={u.status === "Active" ? "active" : "inactive"} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
