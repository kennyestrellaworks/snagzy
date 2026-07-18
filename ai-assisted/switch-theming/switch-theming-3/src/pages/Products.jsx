import { Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const products = [
  { id: 'PRD-001', name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 249.99, variants: 3, status: 'Active' },
  { id: 'PRD-002', name: 'Smart LED Desk Lamp', category: 'Home', price: 59.99, variants: 2, status: 'Active' },
  { id: 'PRD-003', name: 'Stainless Steel Water Bottle 750ml', category: 'Accessories', price: 19.99, variants: 5, status: 'Active' },
  { id: 'PRD-004', name: 'Organic Cotton T-Shirt (M)', category: 'Apparel', price: 24.99, variants: 4, status: 'Draft' },
  { id: 'PRD-005', name: 'Bluetooth Portable Speaker', category: 'Electronics', price: 89.99, variants: 2, status: 'Active' },
  { id: 'PRD-006', name: 'Ceramic Coffee Mug Set (4pc)', category: 'Home', price: 34.99, variants: 1, status: 'Active' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your product catalog and variants</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
        >
          <Filter size={15} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            className="rounded-xl border p-4 transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-badge)' }}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  background: p.status === 'Active' ? 'var(--green-bg)' : 'var(--tag-store-bg)',
                  color: p.status === 'Active' ? 'var(--green)' : 'var(--tag-store-text)',
                }}
              >
                {p.status}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{p.category} · {p.variants} variants</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>${p.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
