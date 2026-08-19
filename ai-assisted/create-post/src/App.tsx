import { useState } from 'react';
import CreatePost from '@/components/CreatePost.jsx';
import Posts from '@/components/Posts.jsx';

function App() {
  const [view, setView] = useState('feed');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
    setView('feed');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              Inkwell
            </span>
          </div>
          <nav className="flex gap-1">
            <NavButton active={view === 'feed'} onClick={() => setView('feed')}>
              Posts
            </NavButton>
            <NavButton active={view === 'create'} onClick={() => setView('create')}>
              New Post
            </NavButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {view === 'feed' ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-900">Latest Posts</h1>
              <button
                type="button"
                onClick={() => setView('create')}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                New Post
              </button>
            </div>
            <Posts refreshKey={refreshKey} />
          </div>
        ) : (
          <div className="space-y-8">
            <button
              type="button"
              onClick={() => setView('feed')}
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              &larr; Back to posts
            </button>
            <CreatePost onCreated={handleCreated} />
          </div>
        )}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

export default App;
