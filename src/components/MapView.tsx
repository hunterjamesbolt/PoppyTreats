'use client'

import { useEffect, useRef, useState } from 'react'
import { Store } from '@/services/googlePlaces'

interface MapViewProps {
  userLocation: { lat: number; lng: number } | null
  stores: Store[]
  selectedStore: Store | null
  onStoreSelect: (store: Store | null) => void
  isDarkMode?: boolean
}

export default function MapView({ userLocation, stores, selectedStore, onStoreSelect, isDarkMode = false }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Validate coordinates and provide fallback
    const defaultCenter = { lat: 40.7589, lng: -73.9851 }
    const center = userLocation && 
                   !isNaN(userLocation.lat) && 
                   !isNaN(userLocation.lng) && 
                   isFinite(userLocation.lat) && 
                   isFinite(userLocation.lng) 
                   ? userLocation 
                   : defaultCenter

    // Dark mode styles from Google Maps documentation
    const darkModeStyles = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]

    // Light mode styles (cleaner)
    const lightModeStyles = [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ]

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: isDarkMode ? darkModeStyles : lightModeStyles,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    })

    mapInstanceRef.current = map
    infoWindowRef.current = new google.maps.InfoWindow()
  }, [userLocation])

  // Update map styles when dark mode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const darkModeStyles = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]

    const lightModeStyles = [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ]

    mapInstanceRef.current.setOptions({
      styles: isDarkMode ? darkModeStyles : lightModeStyles
    })
  }, [isDarkMode])

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return

    // Validate user location coordinates
    if (isNaN(userLocation.lat) || isNaN(userLocation.lng) || 
        !isFinite(userLocation.lat) || !isFinite(userLocation.lng)) {
      console.warn('Invalid user location coordinates:', userLocation)
      return
    }

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null)
    }

    // Create user location marker
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      }
    })

    userMarkerRef.current = userMarker

    // Center map on user location
    mapInstanceRef.current.setCenter(userLocation)
  }, [userLocation])

  // Update store markers
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Create markers for stores
    stores.forEach(store => {
      const marker = new google.maps.Marker({
        position: store.coordinates,
        map: mapInstanceRef.current,
        title: store.name,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: store.hasGreenies && store.hasTikiCat ? '#10B981' : 
                     store.hasGreenies || store.hasTikiCat ? '#F59E0B' : '#6B7280',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 1.5,
          anchor: new google.maps.Point(12, 24)
        }
      })

      // Add click listener
      marker.addListener('click', () => {
        onStoreSelect(store)
        
        // Show info window
        if (infoWindowRef.current) {
          const isDarkTheme = document.documentElement.classList.contains('dark')
          const bgClass = isDarkTheme ? 'bg-gray-800' : 'bg-white'
          const textClass = isDarkTheme ? 'text-gray-100' : 'text-gray-800'
          const subTextClass = isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          
          const content = `
            <div class="p-3 ${bgClass} rounded-lg shadow-lg">
              <h3 class="font-semibold ${textClass} mb-1">${store.name}</h3>
              <p class="text-sm ${subTextClass} mb-2">${store.address}</p>
              <div class="flex items-center space-x-2 text-sm mb-2">
                <span class="flex items-center">
                  <span class="text-yellow-500">★</span>
                  <span class="ml-1 ${textClass}">${store.rating.toFixed(1)}</span>
                </span>
                <span class="${store.isOpen ? 'text-green-500' : 'text-red-500'} font-medium">
                  ${store.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div class="flex space-x-2">
                <span class="px-2 py-1 text-xs rounded ${store.hasGreenies ? 'bg-green-500 text-white' : (isDarkTheme ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600')}">
                  Greenies ${store.hasGreenies ? '✓' : '✗'}
                </span>
                <span class="px-2 py-1 text-xs rounded ${store.hasTikiCat ? 'bg-green-500 text-white' : (isDarkTheme ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600')}">
                  Tiki Cat ${store.hasTikiCat ? '✓' : '✗'}
                </span>
              </div>
            </div>
          `
          
          infoWindowRef.current.setContent(content)
          infoWindowRef.current.open(mapInstanceRef.current, marker)
        }
      })

      markersRef.current.push(marker)
    })

    // Fit map to show all markers
    if (stores.length > 0 && userLocation) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng))
      stores.forEach(store => bounds.extend(new google.maps.LatLng(store.coordinates.lat, store.coordinates.lng)))
      mapInstanceRef.current!.fitBounds(bounds, 50)
    }
  }, [stores, onStoreSelect, userLocation])

  // Highlight selected store
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const store = stores[index]
      const isSelected = selectedStore?.id === store.id
      
      marker.setIcon({
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: isSelected ? '#F97316' : 
                   store.hasGreenies && store.hasTikiCat ? '#10B981' : 
                   store.hasGreenies || store.hasTikiCat ? '#F59E0B' : '#6B7280',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: isSelected ? 2 : 1.5,
        anchor: new google.maps.Point(12, 24)
      })
    })
  }, [selectedStore, stores])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  )
}
