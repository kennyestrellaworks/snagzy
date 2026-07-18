import { Plus, MapPin, Phone, Store as StoreIcon } from 'lucide-react';

const stores = [
  { id: 1, name: 'Main Store', address: '123 Market St, San Francisco, CA', phone: '(415) 555-0100', products: 156, status: 'Active' },
  { id: 2, name: 'Downtown', address: '456 5th Ave, New York, NY', phone: '(212) 555-0120', products: 98, status: 'Active' },
  { id: 3, name: 'Westside', address: '789 Sunset Blvd, Los Angeles, CA', phone: '(310) 555-0180', products: 72, status: 'Active' },
  { id: 4, name: 'Northside', address: '321 Oak St, Chicago, IL', phone: '(312) 555-0140', products: 0, status: 'Inactive' },
];

export default function Stores() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Stores</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your physical store locations</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} /> Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map(s => (
          <div
            key={s.id}
            className="rounded-xl border p-5 transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-badge)' }}>
                <StoreIcon size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  background: s.status === 'Active' ? 'var(--green-bg)' : 'var(--red-bg)',
                  color: s.status === 'Active' ? 'var(--green)' : 'var(--red)',
                }}
              >
                {s.status}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                {s.address}
              </p>
              <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                {s.phone}
              </p>
              <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <StoreIcon size={14} style={{ color: 'var(--text-muted)' }} />
                {s.products} products
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
