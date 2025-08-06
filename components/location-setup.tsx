"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Location data structure
const locationData = {
  "Andhra Pradesh": {
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool", "Nellore", "Kadapa", "Rajahmundry"],
    climate: "Tropical",
    majorCrops: ["Rice", "Cotton", "Sugarcane", "Groundnut", "Chili"],
    soilTypes: ["Black Cotton", "Red Sandy", "Alluvial"],
  },
  Punjab: {
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Ferozepur", "Gurdaspur"],
    climate: "Semi-Arid",
    majorCrops: ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize"],
    soilTypes: ["Alluvial", "Sandy Loam", "Clay Loam"],
  },
  Maharashtra: {
    districts: ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad", "Solapur", "Kolhapur", "Satara"],
    climate: "Tropical Monsoon",
    majorCrops: ["Cotton", "Sugarcane", "Soybean", "Wheat", "Rice", "Onion"],
    soilTypes: ["Black Cotton", "Red", "Laterite"],
  },
  "Uttar Pradesh": {
    districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Bareilly", "Aligarh"],
    climate: "Subtropical",
    majorCrops: ["Wheat", "Rice", "Sugarcane", "Potato", "Mustard"],
    soilTypes: ["Alluvial", "Black", "Red Sandy"],
  },
  Gujarat: {
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand"],
    climate: "Semi-Arid",
    majorCrops: ["Cotton", "Groundnut", "Wheat", "Rice", "Sugarcane"],
    soilTypes: ["Black Cotton", "Sandy", "Saline"],
  },
  Haryana: {
    districts: ["Gurgaon", "Faridabad", "Karnal", "Panipat", "Ambala", "Hisar", "Rohtak", "Sonipat"],
    climate: "Semi-Arid",
    majorCrops: ["Wheat", "Rice", "Cotton", "Sugarcane", "Mustard"],
    soilTypes: ["Alluvial", "Sandy", "Clay"],
  },
  Karnataka: {
    districts: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary"],
    climate: "Tropical",
    majorCrops: ["Rice", "Cotton", "Sugarcane", "Ragi", "Maize"],
    soilTypes: ["Red", "Black", "Laterite"],
  },
  "Tamil Nadu": {
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    climate: "Tropical",
    majorCrops: ["Rice", "Cotton", "Sugarcane", "Groundnut", "Millets"],
    soilTypes: ["Red", "Black", "Alluvial"],
  },
}

interface LocationData {
  state: string
  district: string
  pincode: string
  farmSize: string
  soilType: string
  farmingExperience: string
  primaryCrops: string[]
}

interface LocationSetupProps {
  isOpen: boolean
  onClose: () => void
  onLocationSet: (data: LocationData) => void
  currentLocation?: LocationData | null
}

export function LocationSetup({ isOpen, onClose, onLocationSet, currentLocation }: LocationSetupProps) {
  const [formData, setFormData] = useState<LocationData>({
    state: currentLocation?.state || "",
    district: currentLocation?.district || "",
    pincode: currentLocation?.pincode || "",
    farmSize: currentLocation?.farmSize || "",
    soilType: currentLocation?.soilType || "",
    farmingExperience: currentLocation?.farmingExperience || "",
    primaryCrops: currentLocation?.primaryCrops || [],
  })
  const [isDetecting, setIsDetecting] = useState(false)
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  const availableDistricts = formData.state
    ? locationData[formData.state as keyof typeof locationData]?.districts || []
    : []
  const stateInfo = formData.state ? locationData[formData.state as keyof typeof locationData] : null
  const availableSoilTypes = stateInfo?.soilTypes || []
  const suggestedCrops = stateInfo?.majorCrops || []

  const detectLocation = async () => {
    setIsDetecting(true)
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Simulate reverse geocoding (in real app, use Google Maps API or similar)
          setTimeout(() => {
            // Mock location detection
            setFormData({
              ...formData,
              state: "Punjab",
              district: "Ludhiana",
              pincode: "141001",
            })
            setIsDetecting(false)
            toast({
              title: "Location Detected!",
              description: "We've detected your location. Please verify the details.",
            })
          }, 2000)
        },
        (error) => {
          setIsDetecting(false)
          toast({
            title: "Location Detection Failed",
            description: "Please enter your location manually.",
            variant: "destructive",
          })
        },
      )
    } catch (error) {
      setIsDetecting(false)
      toast({
        title: "Error",
        description: "Unable to detect location. Please enter manually.",
        variant: "destructive",
      })
    }
  }

  const handleStateChange = (state: string) => {
    setFormData({
      ...formData,
      state,
      district: "",
      soilType: "",
      primaryCrops: [],
    })
  }

  const toggleCrop = (crop: string) => {
    const updatedCrops = formData.primaryCrops.includes(crop)
      ? formData.primaryCrops.filter((c) => c !== crop)
      : [...formData.primaryCrops, crop]

    setFormData({ ...formData, primaryCrops: updatedCrops })
  }

  const handleSubmit = () => {
    if (!formData.state || !formData.district || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required location details.",
        variant: "destructive",
      })
      return
    }

    onLocationSet(formData)
    toast({
      title: "Location Saved!",
      description: "Your farming profile has been updated. You'll now get personalized recommendations.",
    })
    onClose()
  }

  const nextStep = () => {
    if (step === 1 && (!formData.state || !formData.district || !formData.pincode)) {
      toast({
        title: "Complete Location Details",
        description: "Please fill in your state, district, and pincode.",
        variant: "destructive",
      })
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-green-600" />
            Set Up Your Farm Location
          </DialogTitle>
          <DialogDescription>
            Help us provide personalized weather, crop, and market recommendations for your area.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>

          {/* Step 1: Location Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📍 Location Details</CardTitle>
                <CardDescription>Enter your farm's location for accurate local recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Button onClick={detectLocation} disabled={isDetecting} variant="outline">
                    {isDetecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="mr-2 h-4 w-4" />
                        Auto-Detect Location
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={handleStateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(locationData).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                      disabled={!formData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      type="text"
                      placeholder="e.g., 141001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      maxLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Select
                      value={formData.farmSize}
                      onValueChange={(value) => setFormData({ ...formData, farmSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select farm size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt; 2 acres)</SelectItem>
                        <SelectItem value="medium">Medium (2-10 acres)</SelectItem>
                        <SelectItem value="large">Large (10-50 acres)</SelectItem>
                        <SelectItem value="commercial">Commercial (&gt; 50 acres)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {stateInfo && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Region Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Climate:</span> {stateInfo.climate}
                      </div>
                      <div>
                        <span className="font-medium">Major Crops:</span> {stateInfo.majorCrops.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Farm Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌾 Farm Details</CardTitle>
                <CardDescription>Tell us about your farming setup for better recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select
                      value={formData.soilType}
                      onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSoilTypes.map((soil) => (
                          <SelectItem key={soil} value={soil}>
                            {soil}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Farming Experience</Label>
                    <Select
                      value={formData.farmingExperience}
                      onValueChange={(value) => setFormData({ ...formData, farmingExperience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (&lt; 2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-10 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (10+ years)</SelectItem>
                        <SelectItem value="expert">Expert (20+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Crop Selection */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌱 Primary Crops</CardTitle>
                <CardDescription>Select the crops you currently grow or plan to grow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Recommended crops for your region:</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCrops.map((crop) => (
                      <Badge
                        key={crop}
                        variant={formData.primaryCrops.includes(crop) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-green-100"
                        onClick={() => toggleCrop(crop)}
                      >
                        {formData.primaryCrops.includes(crop) && <CheckCircle className="mr-1 h-3 w-3" />}
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Other crops:</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Vegetables", "Fruits", "Pulses", "Spices", "Flowers"].map((crop) => (
                      <Badge
                        key={crop}
                        variant={formData.primaryCrops.includes(crop) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-green-100"
                        onClick={() => toggleCrop(crop)}
                      >
                        {formData.primaryCrops.includes(crop) && <CheckCircle className="mr-1 h-3 w-3" />}
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                {formData.primaryCrops.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Selected Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.primaryCrops.map((crop) => (
                        <Badge key={crop} variant="default">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Previous
            </Button>
            <div className="flex space-x-2">
              {step < 3 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Location
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
