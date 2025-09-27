'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import CatLogo from './CatLogo'

interface LandingPageProps {
  onLocationPermissionGranted: () => void
  isLoading?: boolean
}

export default function LandingPage({ onLocationPermissionGranted, isLoading = false }: LandingPageProps) {
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

        {/* Location Request */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
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
        </motion.div>

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-500 leading-relaxed"
        >
          We'll only use your location to find nearby stores
        </motion.p>
      </motion.div>
    </div>
  )
}
