import { MapPin, Trash2, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const formatCoordinates = (lat, lng) => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

export default function PinsList({ pins, onDeletePin, onSelectPin, selectedPinId }) {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = async (pin) => {
    const text = `${formatCoordinates(pin.latitude, pin.longitude)}${pin.address ? '\n' + pin.address : ''}`
    await navigator.clipboard.writeText(text)
    setCopiedId(pin.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openInGoogleMaps = (pin) => {
    window.open(`https://www.google.com/maps?q=${pin.latitude},${pin.longitude}`, '_blank')
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <MapPin className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-center">No pins yet</p>
        <p className="text-sm text-gray-500 text-center mt-1">
          Click "Add Pin" then click on the map
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
      {pins
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((pin) => (
          <div
            key={pin.id}
            onClick={() => onSelectPin && onSelectPin(pin)}
            className={`group relative p-4 rounded-lg transition-all cursor-pointer ${
              selectedPinId === pin.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <h3 className="font-medium text-gray-800 truncate">
                    {pin.label || 'Unnamed Location'}
                  </h3>
                </div>
                <p className="font-mono text-sm text-gray-600 mb-1">
                  {formatCoordinates(pin.latitude, pin.longitude)}
                </p>
                {pin.address && (
                  <p className="text-sm text-gray-500 truncate pr-8" title={pin.address}>
                    {pin.address}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(pin.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(pin)
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  title="Copy coordinates"
                >
                  {copiedId === pin.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openInGoogleMaps(pin)
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeletePin(pin.id)
                  }}
                  className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-500"
                  title="Delete pin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
