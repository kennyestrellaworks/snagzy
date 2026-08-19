import { useState } from 'react';
import CreatePost from '@/components/CreatePost.jsx';
import Posts from '@/components/Posts.jsx';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Posts Board</h1>
          <p className="text-sm text-gray-500 mt-1">
            Write and share posts with rich text formatting.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <CreatePost onCreated={() => setRefreshKey((k) => k + 1)} />
        <Posts refreshKey={refreshKey} />
      </main>
    </div>
  );
}

export default App;
