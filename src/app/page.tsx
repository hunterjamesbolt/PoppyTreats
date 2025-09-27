'use client'

import { useState, useEffect } from 'react'
import MapView from '@/components/MapView'
import StoreCard from '@/components/StoreCard'
import SearchBar from '@/components/SearchBar'
import CatLogo from '@/components/CatLogo'
import LandingPage from '@/components/LandingPage'
import LocationHeader from '@/components/LocationHeader'
import MobileHeader from '@/components/MobileHeader'
import MobileDrawer from '@/components/MobileDrawer'
import ProductFilters from '@/components/ProductFilters'
import NoStoresFound from '@/components/NoStoresFound'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useGoogleMaps } from '@/contexts/GoogleMapsContext'
import { Store } from '@/services/googlePlaces'
import { MapPin, Search, AlertCircle } from 'lucide-react'

export default function Home() {
  const { isLoaded, findNearbyStores, error: mapsError } = useGoogleMaps()
  
  // Location and app state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState('')
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Store data and filtering
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showStoreList, setShowStoreList] = useState(false)
  const [searchRadius, setSearchRadius] = useState(10) // miles
  const [showGreenies, setShowGreenies] = useState(true)
  const [showTikiCat, setShowTikiCat] = useState(true)
  
  // Loading and error states
  const [isLoadingStores, setIsLoadingStores] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissedError, setDismissedError] = useState(false)

  const filteredStores = stores.filter(store => {
    if (!showGreenies && !showTikiCat) return false
    if (showGreenies && showTikiCat) return store.hasGreenies || store.hasTikiCat
    if (showGreenies) return store.hasGreenies
    if (showTikiCat) return store.hasTikiCat
    return false
  })

  // Load nearby stores when location or filters change
  useEffect(() => {
    if (userLocation && isLoaded && (showGreenies || showTikiCat)) {
      loadNearbyStores(userLocation)
    }
  }, [userLocation, isLoaded, showGreenies, showTikiCat, searchRadius])

  const loadNearbyStores = async (location: { lat: number; lng: number }) => {
    setIsLoadingStores(true)
    setError(null)
    setDismissedError(false)
    try {
      const radiusInMeters = searchRadius * 1609.34 // Convert miles to meters
      const nearbyStores = await findNearbyStores(location, radiusInMeters)
      setStores(nearbyStores || []) // Ensure we always have an array
    } catch (err) {
      console.error('Error loading stores:', err)
      setError('Failed to load nearby pet stores. Please try again.')
      setStores([]) // Set empty array on error
    } finally {
      setIsLoadingStores(false)
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    if (!window.google) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          // Try to get city, state format
          const components = results[0].address_components
          let city = ''
          let state = ''
          
          for (const component of components) {
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name
            }
          }
          
          if (city && state) {
            resolve(`${city}, ${state}`)
          } else {
            resolve(results[0].formatted_address.split(',')[0])
          }
        } else {
          resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        }
      })
    })
  }

  const handleLocationRequest = async () => {
    setIsLocating(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(coords)
        setHasLocationPermission(true)
        
        // Get location name
        const locationName = await reverseGeocode(coords.lat, coords.lng)
        setLocationName(locationName)
        
        setIsLocating(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        setError('Unable to get your location. Please check your browser settings.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const handleLocationChange = async (location: string, coordinates: { lat: number; lng: number }) => {
    setUserLocation(coordinates)
    setLocationName(location)
  }

  const handleExpandSearch = () => {
    const newRadius = searchRadius === 10 ? 15 : 25
    setSearchRadius(newRadius)
  }

  const handleHomeClick = () => {
    setHasLocationPermission(false)
    setUserLocation(null)
    setLocationName('')
    setStores([])
    setSelectedStore(null)
    setError(null)
    setDismissedError(false)
  }

  // Show loading screen while Google Maps is loading
  if (!isLoaded) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center p-6">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading Google Maps...</p>
        </div>
      </main>
    )
  }

  // Show error screen if Google Maps failed to load
  if (mapsError) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Maps</h2>
          <p className="text-gray-600 mb-4">{mapsError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // Show landing page if no location permission yet
  if (!hasLocationPermission) {
    return (
      <LandingPage 
        onLocationPermissionGranted={handleLocationRequest}
        isLoading={isLocating}
      />
    )
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-primary-50 to-secondary-50'
    }`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Left Sidebar - Desktop only */}
        <div className={`w-96 flex-shrink-0 ${
          isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
        } backdrop-blur-sm border-r ${
          isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        } flex flex-col`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <CatLogo size={48} />
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  Poppy Treats
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Find treats for your cat
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4">
            <ProductFilters
              showGreenies={showGreenies}
              showTikiCat={showTikiCat}
              onGreeniesToggle={() => setShowGreenies(!showGreenies)}
              onTikiCatToggle={() => setShowTikiCat(!showTikiCat)}
              storeCount={filteredStores.length}
            />
          </div>

          {/* Store List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {error && !dismissedError ? (
              <NoStoresFound
                onExpandSearch={handleExpandSearch}
                currentRadius={searchRadius}
                newRadius={searchRadius === 10 ? 15 : 25}
              />
            ) : filteredStores.length === 0 && !isLoadingStores ? (
              <NoStoresFound
                onExpandSearch={handleExpandSearch}
                currentRadius={searchRadius}
                newRadius={searchRadius === 10 ? 15 : 25}
              />
            ) : (
              filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isSelected={selectedStore?.id === store.id}
                  onClick={() => setSelectedStore(store)}
                  showDetails={selectedStore?.id === store.id}
                />
              ))
            )}
          </div>

          {/* Loading indicator for desktop */}
          {isLoadingStores && (
            <div className="p-4 flex items-center justify-center">
              <LoadingSpinner />
              <span className={`ml-2 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Finding nearby stores...
              </span>
            </div>
          )}
        </div>

        {/* Map Container - Desktop */}
        <div className="flex-1 relative">
          {/* Desktop Location Header */}
          <LocationHeader
            location={locationName}
            isDarkMode={isDarkMode}
            onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
            onLocationChange={handleLocationChange}
          />

          <MapView
            userLocation={userLocation}
            stores={filteredStores}
            selectedStore={selectedStore}
            onStoreSelect={setSelectedStore}
            isDarkMode={isDarkMode}
          />

          {/* Expand search radius notification - Desktop */}
          {searchRadius > 10 && (
            <div className="absolute top-20 left-4 right-4">
              <div className={`${
                isDarkMode ? 'bg-orange-900/90 border-orange-700' : 'bg-orange-100 border-orange-300'
              } border rounded-xl p-3 backdrop-blur-sm`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`w-4 h-4 ${
                    isDarkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-orange-200' : 'text-orange-800'
                  }`}>
                    Expanded search to {searchRadius} miles
                  </p>
                  <button
                    onClick={handleExpandSearch}
                    className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-orange-800 hover:bg-orange-700 text-orange-200' 
                        : 'bg-orange-200 hover:bg-orange-300 text-orange-800'
                    }`}
                  >
                    {searchRadius === 15 ? 'Try 25 mi' : 'Reset to 10 mi'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-screen relative">
        {/* Mobile Header */}
        <MobileHeader
          location={locationName}
          isDarkMode={isDarkMode}
          onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
          onLocationChange={handleLocationChange}
          onHomeClick={handleHomeClick}
        />

        {/* Full Screen Map */}
        <MapView
          userLocation={userLocation}
          stores={filteredStores}
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
          isDarkMode={isDarkMode}
        />

        {/* Mobile Drawer */}
        <MobileDrawer
          stores={stores}
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
          showGreenies={showGreenies}
          showTikiCat={showTikiCat}
          onGreeniesToggle={() => setShowGreenies(!showGreenies)}
          onTikiCatToggle={() => setShowTikiCat(!showTikiCat)}
          isLoading={isLoadingStores}
          error={error}
          dismissedError={dismissedError}
          onExpandSearch={handleExpandSearch}
          isDarkMode={isDarkMode}
        />

        {/* Expand search radius notification - Mobile */}
        {searchRadius > 10 && (
          <div className="absolute top-20 left-4 right-4 z-40">
            <div className={`${
              isDarkMode ? 'bg-orange-900/90 border-orange-700' : 'bg-orange-100 border-orange-300'
            } border rounded-xl p-3 backdrop-blur-sm`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-4 h-4 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`} />
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-orange-200' : 'text-orange-800'
                }`}>
                  Expanded search to {searchRadius} miles
                </p>
                <button
                  onClick={handleExpandSearch}
                  className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-orange-800 hover:bg-orange-700 text-orange-200' 
                      : 'bg-orange-200 hover:bg-orange-300 text-orange-800'
                  }`}
                >
                  {searchRadius === 15 ? 'Try 25 mi' : 'Reset to 10 mi'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}