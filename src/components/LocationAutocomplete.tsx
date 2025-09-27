'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useGoogleMaps } from '@/contexts/GoogleMapsContext'

interface LocationAutocompleteProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lng: number }) => void
  onCancel: () => void
  isDarkMode?: boolean
}

export default function LocationAutocomplete({ onLocationSelect, onCancel, isDarkMode = false }: LocationAutocompleteProps) {
  const { isLoaded } = useGoogleMaps()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    // Initialize the autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }, // Restrict to US for now
      fields: ['place_id', 'formatted_address', 'geometry', 'name']
    })

    // Add place changed listener
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      
      if (place && place.geometry && place.geometry.location) {
        const location = place.formatted_address || place.name || ''
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        
        onLocationSelect(location, coordinates)
      }
    })

    // Focus the input
    inputRef.current.focus()

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [isLoaded, onLocationSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter city or ZIP code"
          className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
              : 'border-gray-200 bg-white text-gray-800 placeholder-gray-500'
          }`}
        />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
              isDarkMode 
                ? 'text-gray-500 hover:text-gray-300' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex space-x-3">
        <motion.button
          onClick={onCancel}
          className={`flex-1 py-2 px-4 border rounded-xl transition-colors ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
      </div>

      <p className={`text-xs text-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Start typing to see suggestions
      </p>
    </div>
  )
}
