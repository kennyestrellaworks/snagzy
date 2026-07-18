import { Star } from 'lucide-react';

const reviews = [
  { id: 1, product: 'Wireless Noise-Cancelling Headphones', customer: 'Kenny Estrella', rating: 5, comment: 'Amazing sound quality, exceeded expectations!', date: 'Jul 16, 2026' },
  { id: 2, product: 'Smart LED Desk Lamp', customer: 'Sarah Chen', rating: 4, comment: 'Great lamp, wish the brightness had more levels.', date: 'Jul 15, 2026' },
  { id: 3, product: 'Bluetooth Portable Speaker', customer: 'Marcus Johnson', rating: 5, comment: 'Perfect for outdoor gatherings. Highly recommend.', date: 'Jul 14, 2026' },
  { id: 4, product: 'Stainless Steel Water Bottle 750ml', customer: 'Priya Patel', rating: 3, comment: 'Good bottle but the cap leaks slightly when tipped.', date: 'Jul 13, 2026' },
  { id: 5, product: 'Running Shoes - Size 9', customer: 'David Kim', rating: 5, comment: 'Most comfortable running shoes I have owned.', date: 'Jul 12, 2026' },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={14}
          fill={n <= rating ? 'var(--yellow)' : 'none'}
          style={{ color: n <= rating ? 'var(--yellow)' : 'var(--text-muted)' }}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reviews</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Customer feedback and product ratings</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(r => (
          <div
            key={r.id}
            className="rounded-xl border p-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <Stars rating={r.rating} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.date}</span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>"{r.comment}"</p>
            <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{r.product}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>— {r.customer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
