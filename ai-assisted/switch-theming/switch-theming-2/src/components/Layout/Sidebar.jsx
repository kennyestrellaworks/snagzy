import { NavLink } from "react-router-dom";
import {
  BarChart2, Package, Layers, Users, Store, ShoppingCart, Star
} from "lucide-react";

const iconMap = { BarChart2, Package, Layers, Users, Store, ShoppingCart, Star };

const navItems = [
  { label: "Analytics", icon: "BarChart2", path: "/analytics" },
  { label: "Products", icon: "Package", path: "/products" },
  { label: "Inventory", icon: "Layers", path: "/inventory" },
  { label: "Users", icon: "Users", path: "/users" },
  { label: "Stores", icon: "Store", path: "/stores" },
  { label: "Orders", icon: "ShoppingCart", path: "/orders" },
  { label: "Reviews", icon: "Star", path: "/reviews" },
];

export default function Sidebar() {
  return (
    <aside
      className="w-[200px] min-h-screen flex flex-col py-4 gap-1 flex-shrink-0"
      style={{ backgroundColor: "var(--bg-sidebar)" }}
    >
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "text-[var(--text-sidebar-active)] shadow-sm"
                  : "text-[var(--text-sidebar)] hover:opacity-80"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "var(--bg-sidebar-active)" }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  style={{ color: isActive ? "var(--text-sidebar-active)" : "var(--text-sidebar)" }}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
}
