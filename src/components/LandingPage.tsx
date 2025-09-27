'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import CatLogo from './CatLogo'
import LocationAutocomplete from './LocationAutocomplete'

interface LandingPageProps {
  onLocationPermissionGranted: () => void
  onManualLocation?: (location: string, coordinates: { lat: number; lng: number }) => void
  onDevBypass?: () => void
  isLoading?: boolean
  error?: string | null
}

export default function LandingPage({ 
  onLocationPermissionGranted, 
  onManualLocation,
  onDevBypass,
  isLoading = false, 
  error = null 
}: LandingPageProps) {
  const [showManualEntry, setShowManualEntry] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-center mb-4">
            <CatLogo />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">PoppyTreats</h1>
          <p className="text-gray-600">A website to find food for Poppy</p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 space-y-3"
        >
          {!showManualEntry ? (
            <>
              <button
                onClick={onLocationPermissionGranted}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <MapPin className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Getting Location...' : 'Use My Location'}</span>
              </button>
              
              <button
                onClick={() => setShowManualEntry(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Enter Location Manually</span>
              </button>
              
              {/* Development bypass button */}
              {process.env.NODE_ENV === 'development' && onDevBypass && (
                <button
                  onClick={onDevBypass}
                  className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-2 px-6 rounded-2xl transition-all duration-200 active:scale-95 text-sm"
                >
                  🚀 Dev: Use San Francisco (Skip Location)
                </button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <LocationAutocomplete
                onLocationSelect={(location, coordinates) => {
                  if (onManualLocation) {
                    onManualLocation(location, coordinates)
                  }
                }}
                onCancel={() => setShowManualEntry(false)}
                isDarkMode={false}
              />
            </div>
          )}
        </motion.div>

        {/* Privacy Note */}
        {!showManualEntry && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-sm text-gray-500 leading-relaxed"
          >
            We'll only use your location to find nearby stores
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
