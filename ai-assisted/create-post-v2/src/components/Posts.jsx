import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Inbox, RefreshCw, Trash2, Tag } from "lucide-react";

function sanitizeContent(html) {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("a").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
  return doc.body.innerHTML;
}

export default function Posts({ refreshKey = 0 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setPosts(data || []);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  const sanitizedPosts = useMemo(
    () => posts.map((p) => ({ ...p, content: sanitizeContent(p.content) })),
    [posts],
  );

  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    setDeletingId(null);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Inbox className="w-12 h-12 mb-3" />
        <p className="text-sm font-medium">No posts yet</p>
        <p className="text-xs">Create your first post above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          All Posts ({posts.length})
        </h2>
        <button
          onClick={fetchPosts}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {sanitizedPosts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
                <time className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>

              <div
                className="prose-content text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            <button
              onClick={() => handleDelete(post.id)}
              disabled={deletingId === post.id}
              className="p-2 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
              aria-label="Delete post"
              title="Delete post"
            >
              {deletingId === post.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
