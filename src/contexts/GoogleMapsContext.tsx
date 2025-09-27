'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import GooglePlacesService, { Store } from '@/services/googlePlaces'

interface GoogleMapsContextType {
  isLoaded: boolean
  placesService: GooglePlacesService | null
  findNearbyStores: (location: { lat: number; lng: number }, radius?: number) => Promise<Store[]>
  getStoreDetails: (placeId: string) => Promise<any>
  error: string | null
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  placesService: null,
  findNearbyStores: async () => [],
  getStoreDetails: async () => null,
  error: null
})

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider')
  }
  return context
}

interface GoogleMapsProviderProps {
  children: React.ReactNode
  apiKey: string
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children, apiKey }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [placesService, setPlacesService] = useState<GooglePlacesService | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    loader.load().then(() => {
      // Create a hidden div for the map service initialization
      const mapDiv = document.createElement('div')
      mapDiv.style.display = 'none'
      document.body.appendChild(mapDiv)

      // Initialize a hidden map for the Places service
      const hiddenMap = new google.maps.Map(mapDiv, {
        center: { lat: 40.7589, lng: -73.9851 }, // Default to NYC
        zoom: 10
      })

      const service = new GooglePlacesService(apiKey)
      service.initializeService(hiddenMap)

      setMap(hiddenMap)
      setPlacesService(service)
      setIsLoaded(true)
    }).catch((error) => {
      console.error('Error loading Google Maps:', error)
      setError('Failed to load Google Maps')
    })
  }, [apiKey])

  const findNearbyStores = async (location: { lat: number; lng: number }, radius?: number): Promise<Store[]> => {
    if (!placesService) {
      throw new Error('Places service not available')
    }
    return placesService.findNearbyPetStores(location, radius)
  }

  const getStoreDetails = async (placeId: string) => {
    if (!placesService) {
      throw new Error('Places service not available')
    }
    return placesService.getPlaceDetails(placeId)
  }

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        placesService,
        findNearbyStores,
        getStoreDetails,
        error
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  )
}
