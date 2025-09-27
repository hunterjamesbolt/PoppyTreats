'use client'

import { motion } from 'framer-motion'
import { MapPin, RotateCcw } from 'lucide-react'

interface NoStoresFoundProps {
  onExpandSearch: () => void
  currentRadius: number
  newRadius: number
}

export default function NoStoresFound({ onExpandSearch, currentRadius, newRadius }: NoStoresFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mx-4 text-center"
    >
      <div className="mb-4">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No pet stores found within {currentRadius} miles of your location.
        </h3>
        <p className="text-gray-600 text-sm">
          Try expanding your search radius or using a different location.
        </p>
      </div>

      <div className="space-y-3">
        <motion.button
          onClick={onExpandSearch}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Expand search to {newRadius} mi</span>
        </motion.button>

        <p className="text-xs text-gray-500">
          Click "Your location" in the header to try a different area
        </p>
      </div>
    </motion.div>
  )
}
