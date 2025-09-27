'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductFiltersProps {
  showGreenies: boolean
  showTikiCat: boolean
  onGreeniesToggle: () => void
  onTikiCatToggle: () => void
  storeCount: number
}

export default function ProductFilters({ 
  showGreenies, 
  showTikiCat, 
  onGreeniesToggle, 
  onTikiCatToggle,
  storeCount 
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mx-4 mb-4"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter Products</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {storeCount} store{storeCount !== 1 ? 's' : ''} within 10 mi
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex space-x-4 mt-3">
              {/* Greenies Filter */}
              <motion.button
                onClick={onGreeniesToggle}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl transition-all duration-200 ${
                  showGreenies
                    ? 'bg-green-100 border-2 border-green-300 text-green-800'
                    : 'bg-gray-100 border-2 border-gray-200 text-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showGreenies ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Greenies</span>
              </motion.button>

              {/* Tiki Cat Filter */}
              <motion.button
                onClick={onTikiCatToggle}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl transition-all duration-200 ${
                  showTikiCat
                    ? 'bg-green-100 border-2 border-green-300 text-green-800'
                    : 'bg-gray-100 border-2 border-gray-200 text-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showTikiCat ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Tiki Cat</span>
              </motion.button>
            </div>

            {!showGreenies && !showTikiCat && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-amber-600 text-center mt-2 bg-amber-50 py-1 px-2 rounded-lg"
              >
                Select at least one product to see results
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
