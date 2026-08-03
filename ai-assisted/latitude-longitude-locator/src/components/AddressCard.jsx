import { MapPin, Copy, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

function formatAddressObject(address) {
  const lines = [];
  lines.push(`            _id: "${address._id}",`);
  if (address.cityTownSuburbId) {
    lines.push(`            cityTownSuburbId: "${address.cityTownSuburbId}",`);
  }
  lines.push(`            latitude: "${address.latitude}",`);
  lines.push(`            longitude: "${address.longitude}",`);
  if (address.localityDistrictNeighborhood) {
    lines.push(`            localityDistrictNeighborhood: "${address.localityDistrictNeighborhood}",`);
  }
  if (address.addressLine1) {
    lines.push(`            addressLine1: "${address.addressLine1}",`);
  }
  if (address.addressLine2) {
    lines.push(`            addressLine2: "${address.addressLine2}",`);
  }
  if (address.postalZipPinCode) {
    lines.push(`            postalZipPinCode: "${address.postalZipPinCode}",`);
  }
  return `{\n${lines.join('\n')}\n          }`;
}

export default function AddressCard({ address, loading, hasResult }) {
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => formatAddressObject(address), [address]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-medium text-slate-700">Address Details</span>
        </div>
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-medium text-slate-700">Address Details</span>
        </div>
        <div className="flex items-center justify-center h-80 text-slate-400 text-sm">
          Look up a location to see address details
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-medium text-slate-700">Address Details</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <textarea
        readOnly
        value={formatted}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
        rows={10}
      />
    </div>
  );
}
