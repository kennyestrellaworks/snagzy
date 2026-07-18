import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Store, User, Activity } from "lucide-react";
import { products } from "../data/mockData";
import StarRating from "../components/UI/StarRating";
import Badge from "../components/UI/Badge";

function VariantIdBadge({ id }) {
  const short = id.length > 28 ? id.slice(0, 28) + "…" : id;
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono"
      style={{ backgroundColor: "var(--bg-badge)", color: "var(--accent)" }}
    >
      <Activity size={10} />
      <span className="truncate max-w-[220px]">{short}</span>
    </div>
  );
}

function ProductIdBadge({ id }) {
  const short = id.length > 28 ? id.slice(0, 28) + "…" : id;
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono"
      style={{ backgroundColor: "var(--bg-badge)", color: "var(--text-secondary)" }}
    >
      <span className="text-[10px]">&#9634;</span>
      <span className="truncate max-w-[220px]">{short}</span>
    </div>
  );
}

function TagBadge({ label, type }) {
  const style =
    type === "store"
      ? { backgroundColor: "var(--tag-store-bg)", color: "var(--tag-store-text)" }
      : { backgroundColor: "var(--tag-user-bg)", color: "var(--tag-user-text)" };
  const Icon = type === "store" ? Store : User;
  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={style}>
      <Icon size={10} />
      {label}
    </span>
  );
}

function SalesTrend({ amount, sold, trending }) {
  const Icon = trending ? TrendingUp : TrendingDown;
  const color = trending ? "var(--green)" : "var(--red)";
  const bg = trending ? "var(--green-bg)" : "var(--red-bg)";
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-sm"
      style={{ backgroundColor: bg, color }}
    >
      $ {amount.toFixed(2)}
      <Icon size={13} />
    </div>
  );
}

function ColorSwatch({ color }) {
  const colorMap = {
    Black: "#1a1a1a",
    White: "#f5f5f5",
    Indigo: "#4338ca",
    Blue: "#2563eb",
    Red: "#dc2626",
    Green: "#16a34a",
    Navy: "#1e3a5f",
  };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
      style={{ backgroundColor: colorMap[color] || "#666", color: "#fff" }}
    >
      {color}
    </span>
  );
}

function SizePill({ size }) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border"
      style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-badge)" }}
    >
      {size}
    </span>
  );
}

function VariantRow({ variant, isLast }) {
  return (
    <div
      className="grid border-b"
      style={{
        gridTemplateColumns: "1fr 160px 60px 180px 160px",
        borderColor: "var(--border)",
        backgroundColor: isLast ? "transparent" : undefined,
      }}
    >
      {/* Variant details */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <VariantIdBadge id={variant.id} />
          <Badge
            label={variant.status}
            variant={variant.status === "Active" ? "active" : "inactive"}
          />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <img
            src={variant.image}
            alt={variant.name}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
            style={{ border: "1px solid var(--border)" }}
          />
          <div>
            <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
              {variant.name}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              SKU: {variant.sku}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Color:</span>
              <ColorSwatch color={variant.color} />
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{variant.sizeLabel}:</span>
              <SizePill size={variant.size} />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="px-3 py-3 flex flex-col justify-center gap-0.5">
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Base Price:{" "}
          <span style={{ color: "var(--text-primary)" }} className="font-semibold">
            $ {variant.basePrice.toFixed(2)}
          </span>
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Discount:{" "}
          <span style={{ color: "var(--text-primary)" }} className="font-semibold">
            {variant.discount} %
          </span>
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Price:{" "}
          <span style={{ color: "var(--text-primary)" }} className="font-semibold">
            $ {variant.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stock */}
      <div className="px-3 py-3 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {variant.stock}
        </span>
      </div>

      {/* Sales */}
      <div className="px-3 py-3 flex flex-col gap-1 justify-center">
        <SalesTrend amount={variant.salesAmount} trending={variant.salesTrending} />
        <span className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {variant.totalSold} Sold
        </span>
        {variant.monthlySales.map((ms, i) => (
          <div key={i} className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {ms.month}
            <span style={{ color: "var(--text-secondary)" }} className="mx-1">
              $ {ms.amount.toFixed(2)}
            </span>
            {ms.sold} Sold
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div className="px-3 py-3 flex flex-col gap-1 justify-center">
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {variant.reviews} Reviews
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--yellow)" }}
          >
            {variant.rating.toFixed(1)}
          </span>
          <StarRating rating={variant.rating} />
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visibleVariants = showAll ? product.variants : product.variants.slice(0, 3);

  return (
    <div
      className="rounded-xl overflow-hidden mb-4 shadow-sm"
      style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
    >
      {/* Column headers */}
      <div
        className="grid text-xs font-semibold px-0 border-b"
        style={{
          gridTemplateColumns: "260px 1fr 160px 60px 180px 160px",
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-base)",
          color: "var(--text-muted)",
        }}
      >
        <div className="px-4 py-2">Product Details</div>
        <div className="px-4 py-2">Variants</div>
        <div className="px-3 py-2">Pricing Details</div>
        <div className="px-3 py-2">Stock</div>
        <div className="px-3 py-2">Sales</div>
        <div className="px-3 py-2">Review &amp; Rating</div>
      </div>

      {/* Product + Variants row */}
      <div className="flex">
        {/* Product details (left sticky column) */}
        <div
          className="w-[260px] flex-shrink-0 p-4 flex flex-col gap-2 border-r"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <ProductIdBadge id={product.id} />
            <Badge
              label={product.status}
              variant={product.status === "Active" ? "active" : "inactive"}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <TagBadge label={product.store} type="store" />
            <TagBadge label={product.user} type="user" />
          </div>
          <div className="flex items-start gap-2 mt-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              style={{ border: "1px solid var(--border)" }}
            />
            <div>
              <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                {product.name}
              </div>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {product.description}
              </p>
            </div>
          </div>

          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Stock:{" "}
            <span style={{ color: "var(--text-secondary)" }} className="font-semibold">
              {product.stockItems} Items
            </span>
          </div>

          <SalesTrend amount={product.revenue} trending={product.trending} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {product.totalSold} Sold
          </span>

          {product.monthlySales.map((ms, i) => (
            <div key={i} className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {ms.month}
              <span style={{ color: "var(--text-secondary)" }} className="mx-1">
                $ {ms.amount.toFixed(2)}
              </span>
              {ms.sold} Sold
            </div>
          ))}
        </div>

        {/* Variants */}
        <div className="flex-1 flex flex-col">
          {visibleVariants.map((variant, i) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              isLast={i === visibleVariants.length - 1 && !product.extraVariants}
            />
          ))}

          {/* More button */}
          {product.extraVariants > 0 && !showAll && (
            <div
              className="flex justify-center py-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowAll(true)}
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition hover:opacity-80"
                style={{ backgroundColor: "var(--bg-badge)", color: "var(--text-secondary)" }}
              >
                More +{product.extraVariants}
              </button>
            </div>
          )}
          {showAll && (
            <div
              className="flex justify-center py-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowAll(false)}
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition hover:opacity-80"
                style={{ backgroundColor: "var(--bg-badge)", color: "var(--text-secondary)" }}
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
        Analytics
      </h1>
      <div>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
