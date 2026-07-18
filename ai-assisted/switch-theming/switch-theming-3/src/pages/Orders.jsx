import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const orders = [
  { id: 'ORD-2024-001', customer: 'Kenny Estrella', date: 'Jul 17, 2026', items: 3, total: 329.97, status: 'Delivered' },
  { id: 'ORD-2024-002', customer: 'Sarah Chen', date: 'Jul 16, 2026', items: 1, total: 249.99, status: 'Shipped' },
  { id: 'ORD-2024-003', customer: 'Marcus Johnson', date: 'Jul 15, 2026', items: 5, total: 154.95, status: 'Processing' },
  { id: 'ORD-2024-004', customer: 'Priya Patel', date: 'Jul 14, 2026', items: 2, total: 179.98, status: 'Delivered' },
  { id: 'ORD-2024-005', customer: 'David Kim', date: 'Jul 13, 2026', items: 4, total: 289.96, status: 'Cancelled' },
  { id: 'ORD-2024-006', customer: 'Emily Rodriguez', date: 'Jul 12, 2026', items: 1, total: 89.99, status: 'Shipped' },
  { id: 'ORD-2024-007', customer: 'James Wilson', date: 'Jul 11, 2026', items: 7, total: 524.93, status: 'Processing' },
];

const statusStyles = {
  Delivered: { bg: 'var(--green-bg)', text: 'var(--green)' },
  Shipped: { bg: 'var(--bg-badge)', text: 'var(--accent)' },
  Processing: { bg: 'var(--tag-store-bg)', text: 'var(--tag-store-text)' },
  Cancelled: { bg: 'var(--red-bg)', text: 'var(--red)' },
};

export default function Orders() {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Track and manage customer orders</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> New Order
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-badge)' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Order ID</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Customer</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Date</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>Items</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>Total</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const st = statusStyles[o.status];
              return (
                <tr key={o.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: 'var(--accent)' }}>{o.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{o.customer}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.date}</td>
                  <td className="px-4 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>{o.items}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: st.bg, color: st.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.text }} />
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
