'use client'

import { motion } from 'framer-motion'
import { Store } from '@/services/googlePlaces'
import { Star, Clock, Phone, Navigation, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

interface StoreCardProps {
  store: Store
  isSelected?: boolean
  onClick?: () => void
  showDetails?: boolean
}

export default function StoreCard({ store, isSelected = false, onClick, showDetails = false }: StoreCardProps) {
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (store.phone) {
      window.location.href = `tel:${store.phone}`
    }
  }

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`
    window.open(url, '_blank')
  }

  const handleWebsite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (store.website) {
      window.open(store.website, '_blank')
    }
  }

  return (
    <motion.div
      className={`
        bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary-400 shadow-xl' : 'hover:shadow-xl'}
        ${showDetails ? 'mb-4' : ''}
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{store.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{store.address}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-gray-700">{store.rating.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Navigation className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{store.distance.toFixed(1)} mi</span>
              </div>
              
              <div className={`flex items-center space-x-1 ${store.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-medium">{store.isOpen ? 'Open' : 'Closed'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Product Availability */}
        <div className="flex space-x-4 mb-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            store.hasGreenies 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {store.hasGreenies ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Greenies</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            store.hasTikiCat 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {store.hasTikiCat ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Tiki Cat</span>
          </div>
        </div>

        {/* Action Buttons - Show when selected or in detail view */}
        {(isSelected || showDetails) && (
          <motion.div 
            className="flex space-x-2 pt-3 border-t border-gray-200/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {store.phone && (
              <button
                onClick={handleCall}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl transition-colors text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
            )}
            
            {store.website && (
              <button
                onClick={handleWebsite}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <span>Website</span>
              </button>
            )}
            
            <button
              onClick={handleDirections}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
