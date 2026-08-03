import { useState, useCallback } from 'react';
import MapView from './components/MapView.jsx';
import AddressCard from './components/AddressCard.jsx';
import CoordinateInput from './components/CoordinateInput.jsx';
import { MapPin, Map } from 'lucide-react';

const initialAddress = {
  _id: '',
  cityTownSuburbId: '',
  country: '',
  cityTownSuburb: '',
  localityDistrictNeighborhood: '',
  addressLine1: '',
  addressLine2: '',
  postalZipPinCode: '',
  latitude: '',
  longitude: '',
};

function generateId(prefix = 'place') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < 20; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function parseCoordinates(text) {
  const latMatch = text.match(/latitude\s*[:=]\s*["']?([-\d.]+)["']?/i);
  const lonMatch = text.match(/longitude\s*[:=]\s*["']?([-\d.]+)["']?/i);
  return {
    latitude: latMatch ? latMatch[1] : null,
    longitude: lonMatch ? lonMatch[1] : null,
  };
}

function mapNominatimToAddress(data) {
  const addr = data.address || {};
  const cityTownSuburb = addr.city || addr.town || addr.village || addr.suburb || addr.hamlet || '';
  return {
    _id: generateId('place'),
    cityTownSuburbId: cityTownSuburb ? generateId('city') : '',
    country: addr.country || '',
    cityTownSuburb,
    localityDistrictNeighborhood: addr.locality || addr.district || addr.neighbourhood || '',
    addressLine1: [addr.house_number, addr.road].filter(Boolean).join(' ') || '',
    addressLine2: [addr.suburb, addr.state, addr.postcode].filter(Boolean).join(' ') || '',
    postalZipPinCode: addr.postcode || '',
    latitude: String(data.lat || ''),
    longitude: String(data.lon || ''),
  };
}

export default function App() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupCount, setLookupCount] = useState(0);

  const handleLookup = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAddress(mapNominatimToAddress(data));
      setCoordinates({ latitude: parseFloat(data.lat), longitude: parseFloat(data.lon) });
      setLookupCount((c) => c + 1);
    } catch (err) {
      setError(err.message || 'Failed to reverse geocode');
      setAddress(initialAddress);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (text) => {
      const { latitude, longitude } = parseCoordinates(text);
      if (latitude && longitude) {
        handleLookup(latitude, longitude);
      } else {
        setError('Could not find valid latitude/longitude in the input');
      }
    },
    [handleLookup]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Geo Locator</h1>
            <p className="text-xs text-slate-500">Paste coordinates, discover the place</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Input */}
        <CoordinateInput onSubmit={handleSubmit} loading={loading} />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Map className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-slate-700">Location Map</span>
            </div>
            {coordinates.latitude != null && coordinates.longitude != null ? (
              <MapView
                key={lookupCount}
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
              />
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-400 text-sm">
                Enter coordinates to display the map
              </div>
            )}
          </div>

          {/* Address */}
          <AddressCard address={address} loading={loading} hasResult={lookupCount > 0} />
        </div>
      </main>
    </div>
  );
}
