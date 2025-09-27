interface PlaceResult {
  place_id?: string
  name?: string
  vicinity?: string
  geometry?: {
    location: {
      lat: number | (() => number)
      lng: number | (() => number)
    }
  }
  rating?: number
  opening_hours?: {
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  formatted_phone_number?: string
  website?: string
  price_level?: number
}

interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  formatted_phone_number?: string
  website?: string
  price_level?: number
  reviews?: Array<{
    rating: number
    text: string
    author_name: string
    time: number
  }>
}

export interface Store {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  isOpen: boolean
  hasGreenies: boolean
  hasTikiCat: boolean
  phone?: string
  website?: string
  coordinates: {
    lat: number
    lng: number
  }
  image?: string
  priceLevel?: number
  reviews?: Array<{
    rating: number
    text: string
    author_name: string
    time: number
  }>
}

class GooglePlacesService {
  private apiKey: string
  private service: google.maps.places.PlacesService | null = null

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  initializeService(map: google.maps.Map) {
    this.service = new google.maps.places.PlacesService(map)
  }

  async findNearbyPetStores(location: { lat: number; lng: number }, radius: number = 5000): Promise<Store[]> {
    return new Promise((resolve, reject) => {
      if (!this.service) {
        reject(new Error('Places service not initialized'))
        return
      }

      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: 'pet_store',
        keyword: 'pet store pet supplies'
      }

      this.service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const stores = results
            .filter(place => place.place_id && place.name && place.geometry?.location)
            .map(place => this.convertPlaceToStore(place as any, location))
          resolve(stores)
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          // No results found - return empty array instead of error
          resolve([])
        } else {
          console.warn(`Places search failed: ${status}`)
          // Return empty array instead of rejecting to prevent app crashes
          resolve([])
        }
      })
    })
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    return new Promise((resolve, reject) => {
      if (!this.service) {
        reject(new Error('Places service not initialized'))
        return
      }

      const request = {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'opening_hours',
          'photos',
          'formatted_phone_number',
          'website',
          'price_level',
          'reviews'
        ]
      }

      this.service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place as any)
        } else {
          resolve(null)
        }
      })
    })
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`
  }

  private convertPlaceToStore(place: any, userLocation: { lat: number; lng: number }): Store {
    // Validate coordinates before calculating distance
    const placeLat = place.geometry?.location ? 
      (typeof place.geometry.location.lat === 'function' 
        ? place.geometry.location.lat() 
        : place.geometry.location.lat) : 0
    const placeLng = place.geometry?.location ? 
      (typeof place.geometry.location.lng === 'function' 
        ? place.geometry.location.lng() 
        : place.geometry.location.lng) : 0
    
    // Ensure all coordinates are valid numbers
    const validPlaceLat = (typeof placeLat === 'number' && !isNaN(placeLat) && isFinite(placeLat)) ? placeLat : 0
    const validPlaceLng = (typeof placeLng === 'number' && !isNaN(placeLng) && isFinite(placeLng)) ? placeLng : 0
    const validUserLat = (typeof userLocation.lat === 'number' && !isNaN(userLocation.lat) && isFinite(userLocation.lat)) ? userLocation.lat : 0
    const validUserLng = (typeof userLocation.lng === 'number' && !isNaN(userLocation.lng) && isFinite(userLocation.lng)) ? userLocation.lng : 0

    const distance = this.calculateDistance(
      validUserLat,
      validUserLng,
      validPlaceLat,
      validPlaceLng
    )

    // For now, we'll simulate inventory data based on store names/types
    // In a real app, you'd need to integrate with store APIs or maintain a database
    const hasGreenies = this.simulateInventory(place.name, 'greenies')
    const hasTikiCat = this.simulateInventory(place.name, 'tikicat')

    // Handle opening hours - use isOpen() method if available, fallback to open_now
    let isOpen = true
    try {
      if (place.opening_hours) {
        // Try to use the new isOpen() method if available
        if (typeof (place.opening_hours as any).isOpen === 'function') {
          isOpen = (place.opening_hours as any).isOpen()
        } else if ('open_now' in place.opening_hours) {
          // Fallback to deprecated open_now property
          isOpen = place.opening_hours.open_now ?? true
        }
      }
    } catch (error) {
      // If there's any error checking opening hours, default to open
      isOpen = true
    }

    return {
      id: place.place_id || 'unknown',
      name: place.name || 'Unknown Store',
      address: place.vicinity || 'Unknown Address',
      distance,
      rating: place.rating || 0,
      isOpen,
      hasGreenies,
      hasTikiCat,
      phone: place.formatted_phone_number,
      website: place.website,
      coordinates: {
        lat: validPlaceLat,
        lng: validPlaceLng
      },
      image: place.photos?.[0] ? this.getPhotoUrl(place.photos[0].photo_reference) : undefined,
      priceLevel: place.price_level
    }
  }

  private simulateInventory(storeName: string, product: 'greenies' | 'tikicat'): boolean {
    const name = storeName.toLowerCase()
    
    // Major chains are more likely to have popular products
    const majorChains = ['petsmart', 'petco', 'pet supplies plus', 'tractor supply']
    const isMajorChain = majorChains.some(chain => name.includes(chain))
    
    if (product === 'greenies') {
      // Greenies are very common, most pet stores carry them
      return isMajorChain ? Math.random() > 0.1 : Math.random() > 0.3
    } else {
      // Tiki Cat is premium, less common in smaller stores
      return isMajorChain ? Math.random() > 0.2 : Math.random() > 0.6
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in miles
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

export default GooglePlacesService
