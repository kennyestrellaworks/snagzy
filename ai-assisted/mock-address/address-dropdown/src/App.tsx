import AddressDropdown from './components/AddressDropdown.jsx';
import { MapPinned } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-sm">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Address Explorer
            </h1>
            <p className="text-xs text-slate-500">
              Browse countries, cities, and their places
            </p>
          </div>
        </div>
      </header>
      <main className="px-6 py-10">
        <AddressDropdown />
      </main>
    </div>
  );
}

export default App;
