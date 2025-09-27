'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Store } from '@/services/googlePlaces'
import StoreCard from './StoreCard'
import ProductFilters from './ProductFilters'
import NoStoresFound from './NoStoresFound'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface MobileDrawerProps {
  stores: Store[]
  selectedStore: Store | null
  onStoreSelect: (store: Store | null) => void
  showGreenies: boolean
  showTikiCat: boolean
  onGreeniesToggle: () => void
  onTikiCatToggle: () => void
  isLoading: boolean
  error: string | null
  dismissedError: boolean
  onExpandSearch: () => void
  isDarkMode: boolean
}

export default function MobileDrawer({
  stores,
  selectedStore,
  onStoreSelect,
  showGreenies,
  showTikiCat,
  onGreeniesToggle,
  onTikiCatToggle,
  isLoading,
  error,
  dismissedError,
  onExpandSearch,
  isDarkMode
}: MobileDrawerProps) {
  const [drawerState, setDrawerState] = useState<'collapsed' | 'partial' | 'expanded'>('partial')
  const [dragY, setDragY] = useState(0)

  const filteredStores = stores.filter(store => {
    if (!showGreenies && !showTikiCat) return false
    if (showGreenies && showTikiCat) return store.hasGreenies || store.hasTikiCat
    if (showGreenies) return store.hasGreenies
    if (showTikiCat) return store.hasTikiCat
    return false
  })

  const getDrawerHeight = () => {
    switch (drawerState) {
      case 'collapsed': return 120
      case 'partial': return window.innerHeight * 0.4
      case 'expanded': return window.innerHeight * 0.85
      default: return window.innerHeight * 0.4
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y

    if (velocity > 500 || offset > 100) {
      // Dragging down
      if (drawerState === 'expanded') setDrawerState('partial')
      else if (drawerState === 'partial') setDrawerState('collapsed')
    } else if (velocity < -500 || offset < -100) {
      // Dragging up
      if (drawerState === 'collapsed') setDrawerState('partial')
      else if (drawerState === 'partial') setDrawerState('expanded')
    }
    setDragY(0)
  }

  const toggleDrawer = () => {
    if (drawerState === 'collapsed') setDrawerState('partial')
    else if (drawerState === 'partial') setDrawerState('expanded')
    else setDrawerState('partial')
  }

  return (
    <>
      {/* Backdrop for expanded state */}
      <AnimatePresence>
        {drawerState === 'expanded' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setDrawerState('partial')}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{
          height: getDrawerHeight(),
          y: dragY
        }}
        animate={{
          height: getDrawerHeight()
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={(event, info) => setDragY(info.offset.y)}
        onDragEnd={handleDragEnd}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className={`w-10 h-1 rounded-full ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`} />
        </div>

        {/* Header */}
        <div className="px-4 pb-2">
          <button
            onClick={toggleDrawer}
            className={`flex items-center justify-between w-full ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">
                {isLoading ? 'Searching...' : `${filteredStores.length} stores within 10 mi`}
              </h2>
            </div>
            {drawerState === 'expanded' ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {(drawerState === 'partial' || drawerState === 'expanded') && (
            <div className="px-4 h-full">
              {/* Product Filters - Only show in partial/expanded */}
              {(drawerState === 'partial' || drawerState === 'expanded') && (
                <div className="mb-4">
                  <ProductFilters
                    showGreenies={showGreenies}
                    showTikiCat={showTikiCat}
                    onGreeniesToggle={onGreeniesToggle}
                    onTikiCatToggle={onTikiCatToggle}
                    storeCount={filteredStores.length}
                  />
                </div>
              )}

              {/* Store List */}
              <div className="h-full overflow-y-auto pb-safe">
                {error && !dismissedError ? (
                  <NoStoresFound
                    onExpandSearch={onExpandSearch}
                    currentRadius={10}
                    newRadius={15}
                  />
                ) : filteredStores.length === 0 && !isLoading ? (
                  <NoStoresFound
                    onExpandSearch={onExpandSearch}
                    currentRadius={10}
                    newRadius={15}
                  />
                ) : (
                  <div className="space-y-3 pb-4">
                    {filteredStores.map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        isSelected={selectedStore?.id === store.id}
                        onClick={() => onStoreSelect(store)}
                        showDetails={selectedStore?.id === store.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
