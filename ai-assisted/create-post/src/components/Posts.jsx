import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Posts({ refreshKey }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, title, content, category, created_at')
        .order('created_at', { ascending: false });

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const visible = filter === 'All' ? posts : posts.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-slate-500">No posts yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === c
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {visible.map((post) => (
          <article
            key={post.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {post.category}
              </span>
              <time className="text-xs text-slate-400">
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
            <div
              className="post-content mt-2 line-clamp-4 text-sm text-slate-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
