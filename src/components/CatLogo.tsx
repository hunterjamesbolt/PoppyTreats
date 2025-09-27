'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface CatLogoProps {
  size?: number
  className?: string
}

export default function CatLogo({ size = 48, className = '' }: CatLogoProps) {
  return (
    <motion.div
      className={`rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        rotate: [0, 2, -2, 0],
      }}
      transition={{ 
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <div className="w-full h-full relative p-1">
        <Image
          src="/poppy.png"
          alt="Poppy the cat"
          fill
          className="object-cover rounded-full"
          priority
        />
      </div>
    </motion.div>
  )
}
