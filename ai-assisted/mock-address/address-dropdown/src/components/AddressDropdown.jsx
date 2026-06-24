import { useState } from 'react';
import { ChevronDown, MapPin, Building2, Globe, Navigation } from 'lucide-react';
import { addressOptions } from './addressSelection.js';

const PlaceCard = ({ place }) => (
  <div className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-teal-300 hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
        <MapPin className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {place.localityDistrictNeighborhood}
        </p>
        <p className="mt-0.5 text-sm text-slate-600">{place.addressLine1}</p>
        <p className="text-sm text-slate-500">{place.addressLine2}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            <Navigation className="h-3 w-3" />
            {place.latitude}, {place.longitude}
          </span>
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
            {place.postalZipPinCode}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CitySection = ({ city, cityId, toggleCity, isCityOpen }) => {
  const open = isCityOpen(cityId);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60">
      <button
        onClick={() => toggleCity(cityId)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-100"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Building2 className="h-4 w-4" />
        </div>
        <span className="flex-1 text-sm font-semibold text-slate-800">
          {city.name}
        </span>
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {city.places.length} places
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
            {city.places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CountrySection = ({ country }) => {
  const [open, setOpen] = useState(false);
  const [openCities, setOpenCities] = useState({});

  const toggleCity = (id) =>
    setOpenCities((prev) => ({ ...prev, [id]: !prev[id] }));
  const isCityOpen = (id) => Boolean(openCities[id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-sm">
          <Globe className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-base font-semibold text-slate-900">
            {country.name}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {country.alpha_2} · {country.alpha_3}
          </span>
        </div>
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline">
          {country.cityTownSuburb.length} cities
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 p-4 pt-0">
            {country.cityTownSuburb.map((city) => (
              <CitySection
                key={city._id}
                city={city}
                cityId={city._id}
                toggleCity={toggleCity}
                isCityOpen={isCityOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressDropdown = () => {
  const [query, setQuery] = useState('');

  const filtered = addressOptions.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
      <div className="space-y-4">
        {filtered.map((country) => (
          <CountrySection key={country._id} country={country} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No countries match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressDropdown;
