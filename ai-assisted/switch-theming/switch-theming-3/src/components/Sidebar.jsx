import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  BarChart2,
  Package,
  Layers,
  Users,
  Store,
  ShoppingCart,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/inventory", icon: Layers, label: "Inventory" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/stores", icon: Store, label: "Stores" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/reviews", icon: Star, label: "Reviews" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex-shrink-0 flex flex-col h-screen sticky top-0 border-r transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-56"
      }`}
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className={`h-14 flex items-center px-5 border-b flex-shrink-0 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
        style={{ borderColor: "var(--border)" }}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "var(--accent)" }}
            >
              S
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--logo-text)" }}
            >
              Snagzy
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded transition-colors"
          style={{ color: "var(--text-sidebar)" }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive ? "rounded-none" : ""
              } ${isCollapsed ? "justify-center px-0" : ""}`
            }
            style={({ isActive }) => ({
              background: isActive ? "var(--bg-sidebar-active)" : "transparent",
              color: isActive
                ? "var(--text-sidebar-active)"
                : "var(--text-sidebar)",
            })}
            title={isCollapsed ? label : ""}
          >
            <Icon size={17} />
            {!isCollapsed && label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
