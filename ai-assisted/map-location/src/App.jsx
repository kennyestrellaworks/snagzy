import { useState, useEffect, useCallback } from 'react'
import { MapPin, Loader2, Globe, X } from 'lucide-react'
import WorldMap from './components/WorldMap'
import PinsList from './components/PinsList'
import { supabase } from './lib/supabase'

export default function App() {
  const [pins, setPins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPinId, setSelectedPinId] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const fetchPins = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPins(data || [])
    } catch (error) {
      console.error('Error fetching pins:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPins()
  }, [fetchPins])

  const handleAddPin = async (pinData) => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .insert([{
          latitude: pinData.latitude,
          longitude: pinData.longitude,
          address: pinData.address,
        }])
        .select()

      if (error) throw error
      setPins((prev) => [data[0], ...prev])
    } catch (error) {
      console.error('Error adding pin:', error)
    }
  }

  const handleDeletePin = async (pinId) => {
    try {
      const { error } = await supabase
        .from('pins')
        .delete()
        .eq('id', pinId)

      if (error) throw error
      setPins((prev) => prev.filter((p) => p.id !== pinId))
      if (selectedPinId === pinId) {
        setSelectedPinId(null)
      }
    } catch (error) {
      console.error('Error deleting pin:', error)
    }
  }

  const handleSelectPin = (pin) => {
    if (pin && pin.latitude && pin.longitude) {
      setSelectedPinId(pin.id)
    }
  }

  const selectedPin = pins.find((p) => p.id === selectedPinId)

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 shadow-lg flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">World Map Pins</h1>
            <p className="text-xs text-slate-400">Click to drop pins and explore locations</p>
          </div>
        </div>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex relative">
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-100">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-slate-600">Loading map...</span>
              </div>
            </div>
          ) : (
            <WorldMap
              pins={pins}
              onAddPin={handleAddPin}
              onDeletePin={handleDeletePin}
              onSelectPin={handleSelectPin}
            />
          )}
        </div>

        <aside
          className={`${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
          } absolute right-0 top-0 h-full w-full max-w-md bg-gray-50 border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-[1000] lg:relative lg:translate-x-0`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Saved Pins
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({pins.length})
                  </span>
                </h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <PinsList
                pins={pins}
                onDeletePin={handleDeletePin}
                onSelectPin={handleSelectPin}
                selectedPinId={selectedPinId}
              />
            </div>

            {selectedPin && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Selected:</p>
                  <p className="text-gray-800">
                    {selectedPin.label || 'Unnamed Location'}
                  </p>
                  <p className="font-mono text-xs text-gray-500 mt-1">
                    {selectedPin.latitude.toFixed(6)}, {selectedPin.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
