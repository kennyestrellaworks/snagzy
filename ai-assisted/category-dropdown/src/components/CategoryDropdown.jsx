import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categoryItems } from "../data/categoryItems";
import { categoryBuild } from "../data/categoryBuild";

// Build lookup maps from the data
const itemById = Object.fromEntries(categoryItems.map((i) => [i._id, i]));
const buildByParentId = Object.fromEntries(
  categoryBuild.filter((b) => b.isActive).map((b) => [b.parentId, b]),
);

// First-level items: each build entry's parentId, in the order they appear
const rootItems = categoryBuild
  .filter((b) => b.isActive)
  .map((b) => itemById[b.parentId])
  .filter(Boolean);

function SubMenuPanel({ item }) {
  const build = buildByParentId[item._id];
  const children = build
    ? build.children.map((id) => itemById[id]).filter(Boolean)
    : [];

  return (
    <div className="flex shadow-xl border border-gray-200 rounded-lg overflow-hidden bg-white min-w-[220px]">
      <div
        className="w-44 h-full flex-shrink-0 bg-gray-100 overflow-hidden"
        style={{ minHeight: Math.max(children.length * 44, 120) }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{ minHeight: Math.max(children.length * 44, 120) }}
        />
      </div>

      <ul className="min-w-[180px]">
        {children.map((child) => (
          <li
            key={child._id}
            className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none transition-colors duration-100 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50"
          >
            <span className="text-sm text-gray-700 font-medium whitespace-nowrap pr-3">
              {child.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const dropdownRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHoveredItemId(null);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [handleClose]);

  useEffect(() => () => clearCloseTimer(), []);

  const hoveredItem = hoveredItemId ? itemById[hoveredItemId] : null;
  const hoveredHasChildren = hoveredItem && !!buildByParentId[hoveredItem._id];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        className={`flex items-center gap-2.5 px-4 py-2.5 bg-white border rounded-md text-sm font-medium text-gray-700 transition-all duration-150 select-none min-w-[140px] justify-between ${
          isOpen
            ? "border-gray-400 shadow-sm ring-1 ring-gray-300"
            : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
        }`}
        onClick={() => {
          setIsOpen((v) => !v);
          if (isOpen) setHoveredItemId(null);
        }}
      >
        <span>Category</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 flex">
          {/* Primary list */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-[200px]">
            <ul>
              {rootItems.map((item) => {
                const isHovered = hoveredItemId === item._id;
                return (
                  <li
                    key={item._id}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors duration-100 border-b border-gray-100 last:border-b-0 ${
                      isHovered ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setHoveredItemId(item._id);
                    }}
                    onMouseLeave={() => {
                      closeTimerRef.current = setTimeout(
                        () => setHoveredItemId(null),
                        120,
                      );
                    }}
                  >
                    <span className="text-sm text-gray-700 font-medium">
                      {item.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sub-panel rendered inline to the right */}
          {hoveredItem && hoveredHasChildren && (
            <div
              className="ml-0 border-l-0"
              onMouseEnter={() => clearCloseTimer()}
              onMouseLeave={() => {
                closeTimerRef.current = setTimeout(
                  () => setHoveredItemId(null),
                  120,
                );
              }}
            >
              <SubMenuPanel item={hoveredItem} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
