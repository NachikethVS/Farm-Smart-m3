"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LocationData {
  state: string
  district: string
  pincode: string
  farmSize: string
  soilType: string
  farmingExperience: string
  primaryCrops: string[]
}

interface LocationContextType {
  location: LocationData | null
  setLocation: (location: LocationData) => void
  isLocationSet: boolean
  showLocationSetup: boolean
  setShowLocationSetup: (show: boolean) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null)
  const [showLocationSetup, setShowLocationSetup] = useState(false)

  useEffect(() => {
    // Load location from localStorage on mount
    const savedLocation = localStorage.getItem("farmLocation")
    if (savedLocation) {
      setLocationState(JSON.parse(savedLocation))
    } else {
      // Show location setup if no location is saved
      setShowLocationSetup(true)
    }
  }, [])

  const setLocation = (newLocation: LocationData) => {
    setLocationState(newLocation)
    localStorage.setItem("farmLocation", JSON.stringify(newLocation))
  }

  const isLocationSet = location !== null

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        isLocationSet,
        showLocationSetup,
        setShowLocationSetup,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
