import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$84,329', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Orders', value: '1,429', change: '+8.2%', up: true, icon: ShoppingCart },
  { label: 'Products', value: '312', change: '-2.1%', up: false, icon: Package },
  { label: 'Active Users', value: '894', change: '+15.3%', up: true, icon: Users },
];

const chartData = [42, 58, 35, 70, 52, 88, 64, 95, 72, 80, 60, 78];

export default function Analytics() {
  const maxVal = Math.max(...chartData);
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Overview of your store performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl border p-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-badge)' }}>
                <s.icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <span
                className="flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded"
                style={{
                  background: s.up ? 'var(--green-bg)' : 'var(--red-bg)',
                  color: s.up ? 'var(--green)' : 'var(--red)',
                }}
              >
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Revenue Trend</h2>
        <div className="flex items-end justify-between gap-2 h-48">
          {chartData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(v / maxVal) * 100}%`,
                  background: 'var(--accent)',
                  opacity: 0.3 + (v / maxVal) * 0.7,
                }}
              />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>M{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
