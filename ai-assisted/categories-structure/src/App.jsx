import { useState, useMemo, useRef, useCallback } from "react";
import { categoryItems } from "./categoryItems.js";
import "./App.css";

const CREATED_BY = "people43210987nopqrstu";
const ID_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function genBuildId() {
  let s = "";
  for (let i = 0; i < 24; i++)
    s += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  return "categorybuild" + s;
}

function nowISO() {
  return new Date().toISOString();
}

function makeBuild() {
  const ts = nowISO();
  return {
    _id: genBuildId(),
    isActive: true,
    parentId: null,
    children: [],
    createdBy: CREATED_BY,
    createdAt: ts,
    updatedAt: ts,
  };
}

export default function App() {
  const [builds, setBuilds] = useState([]);
  const [dragItemId, setDragItemId] = useState(null);
  const [overZone, setOverZone] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const itemMap = useMemo(() => {
    const m = new Map();
    categoryItems.forEach((i) => m.set(i._id, i));
    return m;
  }, []);

  const parentIds = useMemo(
    () => new Set(builds.filter((b) => b.parentId).map((b) => b.parentId)),
    [builds],
  );

  const flash = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const jsonOutput = useMemo(() => {
    const arr = builds.map((b) => ({
      _id: b._id,
      isActive: b.isActive,
      parentId: b.parentId,
      children: b.children,
      createdBy: b.createdBy,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));
    return JSON.stringify(arr, null, 2);
  }, [builds]);

  // ---- mutations ----
  const addBuild = useCallback(() => {
    setBuilds((prev) => [makeBuild(), ...prev]);
  }, []);

  const removeBuild = useCallback((id) => {
    setBuilds((prev) => prev.filter((b) => b._id !== id));
  }, []);

  const setParent = useCallback(
    (buildId, itemId) => {
      if (parentIds.has(itemId)) {
        flash("That item is already a parent in another build.");
        return;
      }
      setBuilds((prev) =>
        prev.map((b) =>
          b._id === buildId
            ? { ...b, parentId: itemId, updatedAt: nowISO() }
            : b,
        ),
      );
    },
    [parentIds, flash],
  );

  const addChild = useCallback(
    (buildId, itemId) => {
      setBuilds((prev) =>
        prev.map((b) => {
          if (b._id !== buildId) return b;
          if (b.parentId === itemId) {
            flash("The parent cannot also be a child of the same build.");
            return b;
          }
          if (b.children.includes(itemId)) {
            flash("That item is already a child here.");
            return b;
          }
          return {
            ...b,
            children: [...b.children, itemId],
            updatedAt: nowISO(),
          };
        }),
      );
    },
    [flash],
  );

  const removeChild = useCallback((buildId, itemId) => {
    setBuilds((prev) =>
      prev.map((b) =>
        b._id === buildId
          ? {
              ...b,
              children: b.children.filter((c) => c !== itemId),
              updatedAt: nowISO(),
            }
          : b,
      ),
    );
  }, []);

  // ---- drag handlers ----
  const onDragStart = (e, itemId) => {
    e.dataTransfer.setData("text/itemId", itemId);
    e.dataTransfer.effectAllowed = "copy";
    setDragItemId(itemId);
  };
  const onDragEnd = () => {
    setDragItemId(null);
    setOverZone(null);
  };

  const onDragOver = (e, zone) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOverZone(zone);
  };
  const onDragLeave = () => setOverZone(null);

  const onDrop = (e, zone) => {
    e.preventDefault();
    setOverZone(null);
    const itemId = e.dataTransfer.getData("text/itemId");
    if (!itemId) return;
    if (zone.type === "parent") setParent(zone.buildId, itemId);
    if (zone.type === "children") addChild(zone.buildId, itemId);
    if (zone.type === "new") {
      if (parentIds.has(itemId)) {
        flash("That item is already a parent in another build.");
        return;
      }
      const ts = nowISO();
      const b = {
        _id: genBuildId(),
        isActive: true,
        parentId: itemId,
        children: [],
        createdBy: CREATED_BY,
        createdAt: ts,
        updatedAt: ts,
      };
      setBuilds((prev) => [b, ...prev]);
    }
  };

  const isOver = (zone) =>
    overZone &&
    overZone.type === zone.type &&
    overZone.buildId === zone.buildId;

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      flash("Copied to clipboard.");
    } catch {
      flash("Copy failed.");
    }
  };

  const usedAsChild = useMemo(() => {
    const s = new Set();
    builds.forEach((b) => b.children.forEach((c) => s.add(c)));
    return s;
  }, [builds]);

  return (
    <div className="app">
      <div className="columns">
        {/* ===== BUILDER ===== */}
        <div className="col card">
          <div className="col-label">
            <span className="col-icon">
              <BuilderIcon />
            </span>
            BUILDER
          </div>
          <div className="col-title-row">
            <h2 className="col-title">Category Builder</h2>
            <button className="btn-new" onClick={addBuild}>
              <span>+</span> New Builder
            </button>
          </div>

          <div className="builder-body">
            {builds.length === 0 && (
              <div
                className={`empty-drop${isOver({ type: "new" }) ? " over" : ""}`}
                onDragOver={(e) => onDragOver(e, { type: "new" })}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, { type: "new" })}
              >
                Drag a category item here to create your first build
              </div>
            )}

            {builds.map((b, idx) => {
              const parent = b.parentId ? itemMap.get(b.parentId) : null;
              return (
                <div className="build-card" key={b._id}>
                  {/* PARENT row */}
                  <div className="row-label-row">
                    <span className="row-label">PARENT</span>
                    <button
                      className="remove-build"
                      title="Remove build"
                      onClick={() => removeBuild(b._id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {parent ? (
                    <div className="parent-row">
                      <span className="parent-chip">{parent.name}</span>
                      <span className="parent-id">{b.parentId}</span>
                    </div>
                  ) : (
                    <div
                      className={`parent-drop-zone${isOver({ type: "parent", buildId: b._id }) ? " over" : ""}`}
                      onDragOver={(e) =>
                        onDragOver(e, { type: "parent", buildId: b._id })
                      }
                      onDragLeave={onDragLeave}
                      onDrop={(e) =>
                        onDrop(e, { type: "parent", buildId: b._id })
                      }
                    >
                      Drop an item to set as parent
                    </div>
                  )}

                  {/* CHILDREN row */}
                  <div className="row-label-row mt8">
                    <span className="row-label">
                      CHILDREN
                      {b.children.length > 0 ? ` (${b.children.length})` : ""}
                    </span>
                    <button
                      className="add-child-btn"
                      onClick={() =>
                        flash(
                          "Drag an item from the Items panel to add a child.",
                        )
                      }
                    >
                      + Add child
                    </button>
                  </div>

                  <div
                    className={`children-zone${b.children.length === 0 ? " empty" : ""}${isOver({ type: "children", buildId: b._id }) ? " over" : ""}`}
                    onDragOver={(e) =>
                      onDragOver(e, { type: "children", buildId: b._id })
                    }
                    onDragLeave={onDragLeave}
                    onDrop={(e) =>
                      onDrop(e, { type: "children", buildId: b._id })
                    }
                  >
                    {b.children.length === 0 ? (
                      <span className="children-empty-hint">
                        Drag category items here to add as children
                      </span>
                    ) : (
                      b.children.map((cid) => {
                        const child = itemMap.get(cid);
                        if (!child) return null;
                        return (
                          <span className="child-chip" key={cid}>
                            {child.name}
                            <button
                              className="chip-remove"
                              onClick={() => removeChild(b._id, cid)}
                              title="Remove"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}

            {builds.length > 0 && (
              <div
                className={`new-drop-zone${isOver({ type: "new" }) ? " over" : ""}`}
                onDragOver={(e) => onDragOver(e, { type: "new" })}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, { type: "new" })}
              >
                + Drop here to create a new build
              </div>
            )}
          </div>
        </div>

        {/* ===== ITEMS ===== */}
        <div className="col card">
          <div className="col-label">
            <span className="col-icon">
              <LayersIcon />
            </span>
            ITEMS
          </div>
          <div className="col-title-row">
            <h2 className="col-title">Category Items</h2>
          </div>

          <div className="items-wrap">
            {categoryItems.map((item) => {
              const isParent = parentIds.has(item._id);
              const dragging = dragItemId === item._id;
              return (
                <span
                  key={item._id}
                  className={`item-pill${isParent ? " is-parent" : ""}${dragging ? " dragging" : ""}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, item._id)}
                  onDragEnd={onDragEnd}
                  title={item._id}
                >
                  {item.name}
                  {isParent && <span className="pill-label"> (parent)</span>}
                </span>
              );
            })}
          </div>
        </div>

        {/* ===== OUTPUT ===== */}
        <div className="col card">
          <div className="col-label">
            <span className="col-icon">
              <OutputIcon />
            </span>
            OUTPUT
          </div>
          <div className="col-title-row">
            <h2 className="col-title">Output Preview</h2>
            <button className="btn-copy" onClick={copyJSON}>
              <CopyIcon /> Copy JSON
            </button>
          </div>

          {builds.length === 0 ? (
            <div className="output-empty">
              Build output will appear here once you create a build.
            </div>
          ) : (
            <pre className="output-pre">{jsonOutput}</pre>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ---- inline SVG icons ----
function BuilderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function OutputIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h6M7 16h8" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
