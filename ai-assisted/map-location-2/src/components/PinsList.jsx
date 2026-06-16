import { MapPin, Trash2, ExternalLink, Copy, Check, Globe, Building2 } from 'lucide-react'
import { useState } from 'react'

const formatCoordinates = (lat, lng) => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

function AddressField({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="text-xs text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-700">{value}</span>
    </div>
  )
}

function PinAddress({ pin }) {
  const hasAnyAddress = pin.country || pin.city || pin.suburb || pin.district ||
    pin.neighborhood || pin.address_line1 || pin.address_line2 || pin.postal_code

  if (!hasAnyAddress) {
    return (
      <p className="text-sm text-gray-400 italic">
        No address data available
      </p>
    )
  }

  return (
    <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-100">
      <AddressField label="Country" value={pin.country} />
      <AddressField label="City / Town" value={pin.city} />
      <AddressField label="Suburb" value={pin.suburb} />
      <AddressField label="District" value={pin.district} />
      <AddressField label="Neighborhood" value={pin.neighborhood} />
      <AddressField label="Address Line 1" value={pin.address_line1} />
      <AddressField label="Address Line 2" value={pin.address_line2} />
      <AddressField label="Postal Code" value={pin.postal_code} />
    </div>
  )
}

function getLocationName(pin) {
  if (pin.city) return pin.city
  if (pin.suburb) return pin.suburb
  if (pin.district) return pin.district
  if (pin.country) return pin.country
  return 'Unnamed Location'
}

export default function PinsList({ pins, onDeletePin, onSelectPin, selectedPinId }) {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = async (pin) => {
    const lines = []
    if (pin.country) lines.push(`Country: ${pin.country}`)
    if (pin.city) lines.push(`City/Town: ${pin.city}`)
    if (pin.suburb) lines.push(`Suburb: ${pin.suburb}`)
    if (pin.district) lines.push(`District: ${pin.district}`)
    if (pin.neighborhood) lines.push(`Neighborhood: ${pin.neighborhood}`)
    if (pin.address_line1) lines.push(`Address Line 1: ${pin.address_line1}`)
    if (pin.address_line2) lines.push(`Address Line 2: ${pin.address_line2}`)
    if (pin.postal_code) lines.push(`Postal Code: ${pin.postal_code}`)
    lines.push(`Latitude: ${pin.latitude}`)
    lines.push(`Longitude: ${pin.longitude}`)

    const text = lines.join('\n')
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
          Click anywhere on the map to drop a pin
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
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
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-red-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getLocationName(pin)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(pin.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-mono text-gray-700">
                      {pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}
                    </span>
                  </div>

                  {pin.country && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700">
                        {[pin.country, pin.city, pin.suburb].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const details = e.currentTarget.nextElementSibling
                      details.classList.toggle('hidden')
                      e.currentTarget.querySelector('span').textContent =
                        details.classList.contains('hidden') ? 'Show details' : 'Hide details'
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    <span>Show details</span>
                  </button>
                  <div className="hidden mt-2">
                    <PinAddress pin={pin} />
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="font-mono text-xs text-gray-500">
                        {formatCoordinates(pin.latitude, pin.longitude)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(pin)
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  title="Copy address details"
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
