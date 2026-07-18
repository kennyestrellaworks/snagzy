import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';

const products = [
  { id: 'PRD-001', name: 'Wireless Noise-Cancelling Headphones', sku: 'WH-NC-001', category: 'Electronics', stock: 142, reorder: 25, price: 249.99, status: 'In Stock', store: 'Main Store', updated: '2 hours ago' },
  { id: 'PRD-002', name: 'Smart LED Desk Lamp', sku: 'LD-SM-002', category: 'Home', stock: 18, reorder: 20, price: 59.99, status: 'Low Stock', store: 'Downtown', updated: '5 hours ago' },
  { id: 'PRD-003', name: 'Stainless Steel Water Bottle 750ml', sku: 'WB-SS-003', category: 'Accessories', stock: 320, reorder: 50, price: 19.99, status: 'In Stock', store: 'Main Store', updated: '1 day ago' },
  { id: 'PRD-004', name: 'Organic Cotton T-Shirt (M)', sku: 'TS-OC-004', category: 'Apparel', stock: 0, reorder: 30, price: 24.99, status: 'Out of Stock', store: 'Westside', updated: '3 days ago' },
  { id: 'PRD-005', name: 'Bluetooth Portable Speaker', sku: 'SP-BT-005', category: 'Electronics', stock: 76, reorder: 25, price: 89.99, status: 'In Stock', store: 'Main Store', updated: '6 hours ago' },
  { id: 'PRD-006', name: 'Ceramic Coffee Mug Set (4pc)', sku: 'MG-CC-006', category: 'Home', stock: 12, reorder: 15, price: 34.99, status: 'Low Stock', store: 'Downtown', updated: '12 hours ago' },
  { id: 'PRD-007', name: 'Running Shoes - Size 9', sku: 'SH-RN-007', category: 'Footwear', stock: 54, reorder: 20, price: 119.99, status: 'In Stock', store: 'Westside', updated: '1 hour ago' },
  { id: 'PRD-008', name: 'Yoga Mat Premium 6mm', sku: 'YM-PR-008', category: 'Fitness', stock: 0, reorder: 25, price: 49.99, status: 'Out of Stock', store: 'Main Store', updated: '2 days ago' },
  { id: 'PRD-009', name: 'Leather Wallet Brown', sku: 'WL-LT-009', category: 'Accessories', stock: 88, reorder: 30, price: 79.99, status: 'In Stock', store: 'Downtown', updated: '4 hours ago' },
  { id: 'PRD-010', name: 'USB-C Fast Charger 65W', sku: 'CH-UC-010', category: 'Electronics', stock: 210, reorder: 40, price: 39.99, status: 'In Stock', store: 'Main Store', updated: '8 hours ago' },
  { id: 'PRD-011', name: 'Glass Water Pitcher 2L', sku: 'PT-GL-011', category: 'Home', stock: 7, reorder: 20, price: 27.99, status: 'Low Stock', store: 'Westside', updated: '3 days ago' },
  { id: 'PRD-012', name: 'Aromatic Scented Candle Set', sku: 'CD-SC-012', category: 'Home', stock: 145, reorder: 30, price: 22.99, status: 'In Stock', store: 'Downtown', updated: '1 day ago' },
];

const statusStyles = {
  'In Stock': { bg: 'var(--green-bg)', text: 'var(--green)' },
  'Low Stock': { bg: 'var(--tag-store-bg)', text: 'var(--tag-store-text)' },
  'Out of Stock': { bg: 'var(--red-bg)', text: 'var(--red)' },
};

const tabs = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Draft', 'Archived'];

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const perPage = 8;

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchTab = activeTab === 'All' || p.status === activeTab;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const counts = useMemo(() => ({
    All: products.length,
    'In Stock': products.filter(p => p.status === 'In Stock').length,
    'Low Stock': products.filter(p => p.status === 'Low Stock').length,
    'Out of Stock': products.filter(p => p.status === 'Out of Stock').length,
    Draft: 0,
    Archived: 0,
  }), []);

  const toggleAll = () => {
    if (selected.length === pageData.length) setSelected([]);
    else setSelected(pageData.map(p => p.id));
  };

  const toggleOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="p-5">
      {/* Title row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inventory</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage and track your product inventory across all stores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
          >
            <Download size={15} />
            Export
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            <Plus size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className="px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderColor: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {tab}
            <span
              className="ml-1.5 text-xs px-1.5 py-0.5 rounded"
              style={{
                background: activeTab === tab ? 'var(--bg-badge)' : 'transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products, SKU, ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none transition-colors"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
        >
          <Filter size={15} />
          Filters
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-badge)' }}>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === pageData.length && pageData.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Product</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>SKU</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Category</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Store</th>
                <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>Stock</th>
                <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>Price</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Updated</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(p => {
                const st = statusStyles[p.status];
                const lowWarn = p.stock > 0 && p.stock <= p.reorder;
                return (
                  <tr
                    key={p.id}
                    className="border-t transition-colors"
                    style={{
                      borderColor: 'var(--border)',
                      background: selected.includes(p.id) ? 'var(--bg-badge)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleOne(p.id)}
                        className="rounded"
                        style={{ accentColor: 'var(--accent)' }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--bg-badge)' }}
                        >
                          <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{p.sku}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: 'var(--tag-store-bg)', color: 'var(--tag-store-text)' }}
                      >
                        {p.store}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1">
                        {lowWarn && <AlertCircle size={13} style={{ color: 'var(--yellow)' }} />}
                        <span
                          className="font-semibold"
                          style={{ color: p.stock === 0 ? 'var(--red)' : lowWarn ? 'var(--yellow)' : 'var(--text-primary)' }}
                        >
                          {p.stock}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: st.bg, color: st.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.text }} />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{p.updated}</td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length} products
            {selected.length > 0 && <span className="ml-2" style={{ color: 'var(--accent)' }}>· {selected.length} selected</span>}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: n === page ? 'var(--accent)' : 'transparent',
                  color: n === page ? 'white' : 'var(--text-secondary)',
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
