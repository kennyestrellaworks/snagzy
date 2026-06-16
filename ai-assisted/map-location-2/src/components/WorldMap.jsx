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
  const locationName = pin.city || pin.suburb || pin.district || pin.country || 'Location'

  return (
    <div className="min-w-[220px]">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-red-500" />
        <span className="font-semibold text-gray-800">{locationName}</span>
      </div>
      <div className="space-y-0.5 text-xs text-gray-600 mb-2">
        {pin.country && <p><span className="text-gray-400">Country:</span> {pin.country}</p>}
        {pin.city && <p><span className="text-gray-400">City:</span> {pin.city}</p>}
        {pin.suburb && <p><span className="text-gray-400">Suburb:</span> {pin.suburb}</p>}
        {pin.district && <p><span className="text-gray-400">District:</span> {pin.district}</p>}
        {pin.neighborhood && <p><span className="text-gray-400">Neighborhood:</span> {pin.neighborhood}</p>}
        {pin.address_line1 && <p><span className="text-gray-400">Address:</span> {pin.address_line1}</p>}
        {pin.address_line2 && <p><span className="text-gray-400">:</span> {pin.address_line2}</p>}
        {pin.postal_code && <p><span className="text-gray-400">Postal:</span> {pin.postal_code}</p>}
      </div>
      <div className="bg-slate-50 rounded px-2 py-1.5 mb-2">
        <p className="font-mono text-xs text-gray-600">{formatCoordinates(pin.latitude, pin.longitude)}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {new Date(pin.created_at).toLocaleDateString()}
        </p>
        <button
          onClick={() => onDelete(pin.id)}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default function WorldMap({ pins, onAddPin, onDeletePin, onSelectPin }) {
  const defaultCenter = [20, 0]
  const defaultZoom = 2

  const handleMapClick = useCallback(async (lat, lng) => {
    const addressData = {
      latitude: lat,
      longitude: lng,
      address: null,
      country: null,
      city: null,
      suburb: null,
      district: null,
      neighborhood: null,
      address_line1: null,
      address_line2: null,
      postal_code: null,
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      )
      const data = await response.json()

      if (data) {
        addressData.address = data.display_name || null
        const addr = data.address || {}

        addressData.country = addr.country || null
        addressData.city = addr.city || addr.town || addr.village || addr.municipality || null
        addressData.suburb = addr.suburb || addr.hamlet || null
        addressData.district = addr.district || addr.county || addr.state_district || null
        addressData.neighborhood = addr.neighbourhood || addr.residential || null
        addressData.postal_code = addr.postcode || null

        const houseNumber = addr.house_number || null
        const road = addr.road || null
        if (houseNumber && road) {
          addressData.address_line1 = `${houseNumber} ${road}`
        } else if (road) {
          addressData.address_line1 = road
        } else if (houseNumber) {
          addressData.address_line1 = houseNumber
        }

        const building = addr.building || null
        const unit = addr.unit || null
        if (building && unit) {
          addressData.address_line2 = `${building}, ${unit}`
        } else if (building) {
          addressData.address_line2 = building
        } else if (unit) {
          addressData.address_line2 = unit
        }
      }
    } catch (error) {
      console.error('Failed to fetch address:', error)
    }

    onAddPin(addressData)
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
