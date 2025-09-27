'use client'

import { useState, useEffect } from 'react'
import MapView from '@/components/MapView'
import StoreCard from '@/components/StoreCard'
import SearchBar from '@/components/SearchBar'
import CatLogo from '@/components/CatLogo'
import LandingPage from '@/components/LandingPage'
import LocationHeader from '@/components/LocationHeader'
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
  
  // Product filters (both selected by default)
  const [showGreenies, setShowGreenies] = useState(true)
  const [showTikiCat, setShowTikiCat] = useState(true)
  
  // Loading and error states
  const [isLocating, setIsLocating] = useState(false)
  const [isLoadingStores, setIsLoadingStores] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissedError, setDismissedError] = useState(false)

  // Filter stores based on search query and product availability
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesProducts = (showGreenies && store.hasGreenies) || 
                           (showTikiCat && store.hasTikiCat)
    
    return matchesSearch && matchesProducts
  })

  // Load stores when user location or filters change
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

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      if (!window.google || !window.google.maps) {
        return 'Current Location'
      }
      
      const geocoder = new google.maps.Geocoder()
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results)
          } else {
            reject(new Error(`Geocoding failed: ${status}`))
          }
        })
      })
      
      if (result[0]) {
        // Extract city and state from the result
        const addressComponents = result[0].address_components
        const city = addressComponents.find(c => c.types.includes('locality'))?.long_name
        const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name
        
        return city && state ? `${city}, ${state}` : result[0].formatted_address
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
    }
    return 'Current Location'
  }

  const handleLocationRequest = async () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          
          // Get location name
          const name = await reverseGeocode(coords.lat, coords.lng)
          setLocationName(name)
          setHasLocationPermission(true)
          setIsLocating(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Clear Creek County, Colorado coordinates
          const fallbackCoords = { lat: 39.7392, lng: -105.4917 }
          setUserLocation(fallbackCoords)
          setLocationName('Clear Creek County, Colorado')
          setHasLocationPermission(true)
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      // Fallback for browsers without geolocation
      const fallbackCoords = { lat: 39.7392, lng: -105.4917 }
      setUserLocation(fallbackCoords)
      setLocationName('Clear Creek County, Colorado')
      setHasLocationPermission(true)
      setIsLocating(false)
    }
  }

  const handleLocationChange = async (location: string, coordinates: { lat: number; lng: number }) => {
    setUserLocation(coordinates)
    setLocationName(location)
  }

  const handleExpandSearch = () => {
    const newRadius = searchRadius === 10 ? 15 : 25
    setSearchRadius(newRadius)
  }

  // Show loading screen while Google Maps is loading
  if (!isLoaded) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <CatLogo />
          <div className="mt-4">
            <LoadingSpinner />
            <p className="mt-2 text-gray-600">Loading Poppy Treats...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error if Google Maps failed to load
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
    <main className={`relative h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Location Header */}
      <LocationHeader
        location={locationName}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        onLocationChange={handleLocationChange}
      />

      {/* Left Sidebar - Nearby Stores */}
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 z-10 safe-area-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <CatLogo />
              <div>
                <h1 className="text-lg font-bold text-gray-800">PoppyTreats</h1>
                <p className="text-sm text-gray-600">For Chicken</p>
              </div>
            </div>
          </div>

          {/* Product Filters */}
          <div className="px-4 py-2">
            <ProductFilters
              showGreenies={showGreenies}
              showTikiCat={showTikiCat}
              onGreeniesToggle={() => setShowGreenies(!showGreenies)}
              onTikiCatToggle={() => setShowTikiCat(!showTikiCat)}
              storeCount={filteredStores.length}
            />
          </div>

          {/* Store List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">Nearby Stores</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {filteredStores.length} stores within {searchRadius} mi
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && !dismissedError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                    <button
                      onClick={() => setDismissedError(true)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoadingStores && (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600">Finding nearby pet stores...</span>
                </div>
              )}

              {/* No Stores Found */}
              {!isLoadingStores && filteredStores.length === 0 && (showGreenies || showTikiCat) && (
                <NoStoresFound
                  onExpandSearch={handleExpandSearch}
                  currentRadius={searchRadius}
                  newRadius={searchRadius === 10 ? 15 : 25}
                />
              )}

              {/* Store Cards */}
              {!isLoadingStores && filteredStores.length > 0 && (
                <div className="space-y-3">
                  {filteredStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      isSelected={selectedStore?.id === store.id}
                      onClick={() => setSelectedStore(store)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="absolute left-80 top-0 right-0 bottom-0">
        <MapView 
          userLocation={userLocation}
          stores={filteredStores}
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Orange notification banner like in screenshot */}
      {filteredStores.length === 0 && !isLoadingStores && (showGreenies || showTikiCat) && !dismissedError && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 max-w-md">
          <div className="bg-primary-500 text-white rounded-2xl p-4 shadow-lg text-center relative">
            <button
              onClick={() => setDismissedError(true)}
              className="absolute top-2 right-3 text-white/70 hover:text-white text-lg font-bold"
            >
              ×
            </button>
            <p className="font-medium mb-2 pr-6">
              No pet stores found within {searchRadius} miles of your location. Try expanding your search radius or using a different location.
            </p>
            <p className="text-sm opacity-90">
              Click "Your location" in the header to try a different area
            </p>
            <button
              onClick={handleExpandSearch}
              className="mt-3 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Expand search to {searchRadius === 10 ? 15 : 25} mi
            </button>
          </div>
        </div>
      )}
    </main>
  )
}