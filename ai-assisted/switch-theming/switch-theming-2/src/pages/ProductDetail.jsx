import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products } from "../data/mockData";
import StarRating from "../components/UI/StarRating";
import Badge from "../components/UI/Badge";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 rounded-lg font-medium"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm mb-4 hover:opacity-80"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div
        className="rounded-xl p-5 mb-5 flex gap-5"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 rounded-xl object-cover"
          style={{ border: "1px solid var(--border)" }}
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>
            <Badge label={product.status} variant={product.status === "Active" ? "active" : "inactive"} />
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {product.description}
          </p>
          <div className="flex gap-4 text-sm mt-2">
            <span style={{ color: "var(--text-muted)" }}>
              Stock: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{product.stockItems}</span>
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              Revenue: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>$ {product.revenue.toFixed(2)}</span>
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              Total Sold: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{product.totalSold}</span>
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>Variants</h2>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {product.variants.map((v) => (
          <div
            key={v.id}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-center justify-between">
              <Badge label={v.status} variant={v.status === "Active" ? "active" : "inactive"} />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {v.sku}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img src={v.image} alt={v.name} className="w-12 h-12 rounded object-cover" />
              <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{v.name}</div>
            </div>
            <div className="text-xs grid grid-cols-2 gap-1" style={{ color: "var(--text-muted)" }}>
              <span>Base: <span style={{ color: "var(--text-primary)" }}>${v.basePrice.toFixed(2)}</span></span>
              <span>Disc: <span style={{ color: "var(--text-primary)" }}>{v.discount}%</span></span>
              <span>Price: <span style={{ color: "var(--text-primary)" }}>${v.price.toFixed(2)}</span></span>
              <span>Stock: <span style={{ color: "var(--text-primary)" }}>{v.stock}</span></span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{v.reviews} Reviews</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold" style={{ color: "var(--yellow)" }}>{v.rating.toFixed(1)}</span>
                <StarRating rating={v.rating} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
