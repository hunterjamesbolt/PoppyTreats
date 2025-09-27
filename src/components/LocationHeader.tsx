'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon, MapPin } from 'lucide-react'
import LocationAutocomplete from './LocationAutocomplete'

interface LocationHeaderProps {
  location: string
  isDarkMode: boolean
  onDarkModeToggle: () => void
  onLocationChange: (location: string, coordinates: { lat: number; lng: number }) => void
}

export default function LocationHeader({ 
  location, 
  isDarkMode, 
  onDarkModeToggle, 
  onLocationChange 
}: LocationHeaderProps) {
  const [showLocationInput, setShowLocationInput] = useState(false)

  return (
    <div className="absolute top-0 right-0 z-30 safe-area-top safe-area-right">
      <div className="flex items-center space-x-2 p-4">
        {/* Location Display */}
        <motion.button
          onClick={() => setShowLocationInput(true)}
          className={`flex items-center space-x-2 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md transition-all duration-200 border ${
            isDarkMode 
              ? 'bg-gray-800/95 hover:bg-gray-700/95 border-gray-600/50' 
              : 'bg-white/95 hover:bg-white border-gray-200/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your location
          </span>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-semibold max-w-32 truncate ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}>
              {location}
            </span>
            <ChevronDown className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </motion.button>

        {/* Day/Night Toggle */}
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4 text-orange-500" />
          <motion.button
            onClick={onDarkModeToggle}
            className={`relative w-12 h-6 rounded-full shadow-sm border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500' 
                : 'bg-gray-200 border-gray-300'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{ x: isDarkMode ? 26 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <Moon className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Location Input Modal */}
      <AnimatePresence>
        {showLocationInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLocationInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl shadow-2xl p-6 w-full max-w-md ${
                isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Change Location
              </h3>
              <LocationAutocomplete
                onLocationSelect={(location, coordinates) => {
                  onLocationChange(location, coordinates)
                  setShowLocationInput(false)
                }}
                onCancel={() => setShowLocationInput(false)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
