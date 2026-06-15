import { useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Trash2 } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createPinIcon(color = '#ef4444') {
  const iconHtml = `
    <div style="position: relative; width: 32px; height: 40px;">
      <svg width="32" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `
  return L.divIcon({
    html: iconHtml,
    className: 'custom-pin-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const formatCoordinates = (lat, lng) => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

function PinPopup({ pin, onDelete }) {
  return (
    <div className="min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-red-500" />
        <span className="font-semibold text-gray-800">
          {pin.label || 'Location'}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p className="font-mono">{formatCoordinates(pin.latitude, pin.longitude)}</p>
        {pin.address && (
          <p className="text-gray-500">{pin.address}</p>
        )}
        <p className="text-xs text-gray-400">
          Added {new Date(pin.created_at).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onDelete(pin.id)}
        className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Delete pin
      </button>
    </div>
  )
}

export default function WorldMap({ pins, onAddPin, onDeletePin, onSelectPin }) {
  const defaultCenter = [20, 0]
  const defaultZoom = 2

  const handleMapClick = useCallback(async (lat, lng) => {
    let address = null
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await response.json()
      if (data && data.display_name) {
        address = data.display_name
      }
    } catch (error) {
      console.error('Failed to fetch address:', error)
    }

    onAddPin({
      latitude: lat,
      longitude: lng,
      address,
    })
  }, [onAddPin])

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full"
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={handleMapClick} />

      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          icon={createPinIcon('#ef4444')}
          eventHandlers={{
            click: () => onSelectPin && onSelectPin(pin),
          }}
        >
          <Popup>
            <PinPopup pin={pin} onDelete={onDeletePin} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
