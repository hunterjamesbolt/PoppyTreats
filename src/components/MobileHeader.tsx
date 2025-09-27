'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon } from 'lucide-react'
import CatLogo from './CatLogo'
import LocationAutocomplete from './LocationAutocomplete'

interface MobileHeaderProps {
  location: string
  isDarkMode: boolean
  onDarkModeToggle: () => void
  onLocationChange: (location: string, coordinates: { lat: number; lng: number }) => void
  onHomeClick: () => void
}

export default function MobileHeader({ 
  location, 
  isDarkMode, 
  onDarkModeToggle, 
  onLocationChange,
  onHomeClick
}: MobileHeaderProps) {
  const [showLocationInput, setShowLocationInput] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="absolute top-0 left-0 right-0 z-30 md:hidden safe-area-top">
        <div className="flex items-center justify-between p-4">
          {/* Home Button (Poppy Logo) */}
          <motion.button
            onClick={onHomeClick}
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CatLogo size={40} />
          </motion.button>

          {/* Location Display */}
          <motion.button
            onClick={() => setShowLocationInput(true)}
            className={`flex items-center space-x-2 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md transition-all duration-200 border max-w-48 ${
              isDarkMode 
                ? 'bg-gray-800/95 hover:bg-gray-700/95 border-gray-600/50' 
                : 'bg-white/95 hover:bg-white border-gray-200/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-start min-w-0">
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your location
              </span>
              <div className="flex items-center space-x-1 min-w-0">
                <span className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-primary-400' : 'text-primary-600'
                }`}>
                  {location}
                </span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </div>
          </motion.button>

          {/* Day/Night Toggle Button */}
          <motion.button
            onClick={onDarkModeToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/95 border-gray-600/50 text-yellow-400' 
                : 'bg-white/95 border-gray-200/50 text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Location Input Modal */}
      <AnimatePresence>
        {showLocationInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 md:hidden"
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
    </>
  )
}
