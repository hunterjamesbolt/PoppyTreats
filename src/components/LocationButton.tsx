'use client'

import { MapPin, Loader } from 'lucide-react'
import { motion } from 'framer-motion'

interface LocationButtonProps {
  onClick: () => void
  isLoading?: boolean
  className?: string
}

export default function LocationButton({ onClick, isLoading = false, className = '' }: LocationButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 
        text-white rounded-full shadow-lg flex items-center justify-center
        transition-all duration-200 active:scale-95
        ${className}
      `}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-5 h-5" />
        </motion.div>
      ) : (
        <MapPin className="w-5 h-5" />
      )}
    </motion.button>
  )
}
