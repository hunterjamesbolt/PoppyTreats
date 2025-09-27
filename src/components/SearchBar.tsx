'use client'

import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  disabled?: boolean
  placeholder?: string
}

export default function SearchBar({ 
  value, 
  onChange, 
  onFocus, 
  disabled = false,
  placeholder = "Search pet stores..." 
}: SearchBarProps) {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 
            rounded-2xl text-gray-800 placeholder-gray-500 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/95'}
          `}
        />
        {value && !disabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
