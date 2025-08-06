"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, Beaker, Leaf, TrendingUp, MapPin, Phone, Globe, Star, ShoppingCart, ExternalLink } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Comprehensive crop categories with NPK requirements
const cropCategories = {
  "cereals-millets": {
    name: "🌾 Cereals & Millets",
    crops: {
      rice: { name: "Rice", n: 2.8, p: 1.4, k: 1.2, icon: "🌾" },
      wheat: { name: "Wheat", n: 2.5, p: 1.2, k: 1.0, icon: "🌾" },
      maize: { name: "Maize (Corn)", n: 3.0, p: 1.5, k: 1.3, icon: "🌽" },
      barley: { name: "Barley", n: 2.2, p: 1.0, k: 0.9, icon: "🌾" },
      sorghum: { name: "Sorghum (Jowar)", n: 2.4, p: 1.1, k: 1.0, icon: "🌾" },
      pearl_millet: { name: "Pearl Millet (Bajra)", n: 2.0, p: 0.9, k: 0.8, icon: "🌾" },
      finger_millet: { name: "Finger Millet (Ragi)", n: 2.2, p: 1.0, k: 0.9, icon: "🌾" },
      foxtail_millet: { name: "Foxtail Millet", n: 1.8, p: 0.8, k: 0.7, icon: "🌾" },
      oats: { name: "Oats", n: 2.3, p: 1.1, k: 1.0, icon: "🌾" }
    }
  },
  "pulses-legumes": {
    name: "🌱 Pulses & Legumes",
    crops: {
      chickpea: { name: "Chickpea (Gram)", n: 1.5, p: 1.8, k: 1.2, icon: "🫛" },
      green_gram: { name: "Green Gram (Moong)", n: 1.2, p: 1.5, k: 1.0, icon: "🫛" },
      black_gram: { name: "Black Gram (Urad)", n: 1.3, p: 1.6, k: 1.1, icon: "🫛" },
      pigeon_pea: { name: "Pigeon Pea (Arhar/Toor)", n: 1.8, p: 2.0, k: 1.4, icon: "🫛" },
      lentil: { name: "Lentil (Masur)", n: 1.4, p: 1.7, k: 1.2, icon: "🫛" },
      pea: { name: "Pea", n: 1.6, p: 1.9, k: 1.3, icon: "🫛" },
      cowpea: { name: "Cowpea", n: 1.3, p: 1.5, k: 1.1, icon: "🫛" }
    }
  },
  "vegetables": {
    name: "🥦 Vegetables",
    crops: {
      potato: { name: "Potato", n: 3.5, p: 1.8, k: 4.0, icon: "🥔" },
      onion: { name: "Onion", n: 3.2, p: 1.6, k: 2.8, icon: "🧅" },
      tomato: { name: "Tomato", n: 4.0, p: 2.0, k: 3.5, icon: "🍅" },
      cabbage: { name: "Cabbage", n: 3.8, p: 1.9, k: 3.2, icon: "🥬" },
      cauliflower: { name: "Cauliflower", n: 3.6, p: 1.8, k: 3.0, icon: "🥦" },
      carrot: { name: "Carrot", n: 2.8, p: 1.4, k: 2.5, icon: "🥕" },
      spinach: { name: "Spinach", n: 4.2, p: 2.1, k: 3.8, icon: "🥬" },
      brinjal: { name: "Brinjal (Eggplant)", n: 3.4, p: 1.7, k: 3.0, icon: "🍆" },
      okra: { name: "Okra (Ladyfinger)", n: 3.0, p: 1.5, k: 2.5, icon: "🌶️" },
      cucumber: { name: "Cucumber", n: 2.8, p: 1.4, k: 2.2, icon: "🥒" }
    }
  },
  "fruits": {
    name: "🍎 Fruits",
    crops: {
      mango: { name: "Mango", n: 2.5, p: 1.2, k: 2.8, icon: "🥭" },
      banana: { name: "Banana", n: 4.5, p: 2.2, k: 5.0, icon: "🍌" },
      apple: { name: "Apple", n: 2.2, p: 1.1, k: 2.5, icon: "🍎" },
      papaya: { name: "Papaya", n: 3.0, p: 1.5, k: 3.2, icon: "🫐" },
      guava: { name: "Guava", n: 2.8, p: 1.4, k: 3.0, icon: "🍐" },
      pomegranate: { name: "Pomegranate", n: 2.6, p: 1.3, k: 2.8, icon: "🍎" },
      grapes: { name: "Grapes", n: 3.2, p: 1.6, k: 3.5, icon: "🍇" },
      watermelon: { name: "Watermelon", n: 2.4, p: 1.2, k: 2.0, icon: "🍉" },
      muskmelon: { name: "Muskmelon", n: 2.2, p: 1.1, k: 1.8, icon: "🍈" },
      pineapple: { name: "Pineapple", n: 2.8, p: 1.4, k: 3.0, icon: "🍍" }
    }
  },
  "cash-industrial": {
    name: "🧪 Cash & Industrial Crops",
    crops: {
      sugarcane: { name: "Sugarcane", n: 4.5, p: 2.2, k: 4.8, icon: "🎋" },
      cotton: { name: "Cotton", n: 5.0, p: 2.5, k: 3.0, icon: "🌿" },
      groundnut: { name: "Groundnut", n: 2.2, p: 2.8, k: 2.0, icon: "🥜" },
      mustard: { name: "Mustard", n: 3.5, p: 1.8, k: 1.5, icon: "🌻" },
      soybean: { name: "Soybean", n: 2.0, p: 2.5, k: 1.8, icon: "🫘" },
      sunflower: { name: "Sunflower", n: 3.8, p: 1.9, k: 2.2, icon: "🌻" },
      sesame: { name: "Sesame", n: 2.8, p: 1.4, k: 1.2, icon: "🌰" },
      castor: { name: "Castor", n: 3.2, p: 1.6, k: 1.8, icon: "🌰" },
      tobacco: { name: "Tobacco", n: 4.2, p: 2.1, k: 3.5, icon: "🍃" },
      jute: { name: "Jute", n: 3.0, p: 1.5, k: 2.0, icon: "🌿" },
      areca_nut: { name: "Areca Nut", n: 2.5, p: 1.2, k: 2.8, icon: "🥥" }
    }
  }
}

// Fertilizer suppliers data
const fertilizerSuppliers = {
  online: [
    {
      name: "BigHaat",
      type: "Online Marketplace",
      website: "https://www.bighaat.com",
      phone: "1800-3000-2434",
      rating: 4.5,
      features: ["Home Delivery", "Bulk Orders", "Expert Consultation", "Quality Guarantee"],
      speciality: "Wide range of fertilizers and agricultural inputs"
    },
    {
      name: "AgroStar",
      type: "Online Platform",
      website: "https://www.agrostar.in",
      phone: "1800-200-0797",
      rating: 4.3,
      features: ["Free Delivery", "Crop Advisory", "Quality Products", "Easy Returns"],
      speciality: "Personalized crop solutions and fertilizers"
    },
    {
      name: "Kisan Network",
      type: "Digital Platform",
      website: "https://www.kisannetwork.com",
      phone: "1800-120-4050",
      rating: 4.2,
      features: ["Direct from Manufacturers", "Competitive Prices", "Technical Support"],
      speciality: "Direct sourcing from fertilizer manufacturers"
    },
    {
      name: "DeHaat",
      type: "Agri-tech Platform",
      website: "https://www.dehaat.co.in",
      phone: "1800-1036-110",
      rating: 4.4,
      features: ["End-to-end Solutions", "Credit Facility", "Doorstep Delivery"],
      speciality: "Complete agricultural ecosystem including fertilizers"
    }
  ],
  physical: [
    {
      name: "IFFCO Cooperative Societies",
      type: "Cooperative Network",
      locations: "Pan India",
      phone: "1800-103-1967",
      rating: 4.6,
      features: ["Subsidized Rates", "Quality Assurance", "Wide Network", "Farmer Support"],
      speciality: "Government subsidized fertilizers through cooperative network"
    },
    {
      name: "Krishak Bharati Cooperative (KRIBHCO)",
      type: "Cooperative Society",
      locations: "Multiple States",
      phone: "011-26567373",
      rating: 4.4,
      features: ["Member Benefits", "Quality Products", "Technical Guidance"],
      speciality: "Cooperative fertilizer distribution with member benefits"
    },
    {
      name: "Local Agricultural Input Dealers",
      type: "Retail Stores",
      locations: "Village/Block Level",
      phone: "Contact Local Dealer",
      rating: 4.0,
      features: ["Local Support", "Credit Facility", "Immediate Availability"],
      speciality: "Nearest fertilizer retailers in your area"
    },
    {
      name: "Primary Agricultural Credit Societies (PACS)",
      type: "Credit Cooperative",
      locations: "Village Level",
      phone: "Contact Local PACS",
      rating: 4.2,
      features: ["Credit Support", "Subsidized Rates", "Community Based"],
      speciality: "Village-level cooperative societies providing fertilizers on credit"
    }
  ],
  manufacturers: [
    {
      name: "Tata Chemicals",
      type: "Manufacturer",
      website: "https://www.tatachemicals.com",
      phone: "1800-209-8100",
      rating: 4.7,
      features: ["Premium Quality", "Research Backed", "Technical Support"],
      speciality: "High-quality urea and complex fertilizers"
    },
    {
      name: "Coromandel International",
      type: "Manufacturer",
      website: "https://www.coromandel.biz",
      phone: "1800-425-2244",
      rating: 4.5,
      features: ["Customized Solutions", "Soil Testing", "Crop Specific"],
      speciality: "Specialized fertilizers and crop nutrition solutions"
    },
    {
      name: "Rashtriya Chemicals & Fertilizers (RCF)",
      type: "Public Sector",
      website: "https://www.rcfltd.com",
      phone: "022-2570-4000",
      rating: 4.3,
      features: ["Government Backed", "Quality Assurance", "Affordable Prices"],
      speciality: "Government fertilizer manufacturer with quality products"
    },
    {
      name: "National Fertilizers Limited (NFL)",
      type: "Public Sector",
      website: "https://www.nationalfertilizers.com",
      phone: "011-2436-8800",
      rating: 4.4,
      features: ["Reliable Supply", "Quality Standards", "Pan India Presence"],
      speciality: "Leading government fertilizer manufacturer"
    }
  ]
}

export default function FertilizerCalculator() {
  const [calculation, setCalculation] = useState<any>(null)
  const [showSuppliers, setShowSuppliers] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    crop: "",
    soilType: "",
    area: "",
    targetYield: "",
    currentNPK: { n: "", p: "", k: "" },
    soilPH: "",
  })
  const [availableCrops, setAvailableCrops] = useState<any>({})

  const { toast } = useToast()

  const handleCategoryChange = (category: string) => {
    setFormData({ ...formData, category, crop: "" })
    if (category && cropCategories[category as keyof typeof cropCategories]) {
      setAvailableCrops(cropCategories[category as keyof typeof cropCategories].crops)
    } else {
      setAvailableCrops({})
    }
  }

  const getSoilSpecificRecommendations = (soilType: string) => {
    const recommendations: { [key: string]: string[] } = {
      alluvial: [
        "Well-balanced soil - follow standard fertilizer recommendations",
        "Ensure proper drainage during monsoon",
        "Add organic matter annually for soil health",
      ],
      black: [
        "Rich in potassium - reduce MOP application by 10-15%",
        "Improve drainage as black soil retains water",
        "Add gypsum if soil is alkaline (pH > 8.5)",
      ],
      red: [
        "Often acidic - consider lime application if pH < 6.0",
        "Low in phosphorus - increase DAP application by 10%",
        "Add organic matter to improve water retention",
      ],
      laterite: [
        "Acidic soil - apply lime 2-3 weeks before fertilizer",
        "Low fertility - increase all fertilizer doses by 15%",
        "Improve with organic matter and green manure",
      ],
      sandy: [
        "Apply fertilizers in split doses to prevent leaching",
        "Increase frequency of irrigation",
        "Add organic matter to improve nutrient retention",
      ],
      clay: [
        "Ensure proper drainage before fertilizer application",
        "Apply fertilizers when soil moisture is optimal",
        "Consider deep plowing to improve aeration",
      ],
      loamy: [
        "Ideal soil type - follow standard recommendations",
        "Maintain organic matter content above 1.5%",
        "Regular soil testing recommended",
      ],
    }

    return recommendations[soilType] || recommendations.loamy
  }

  const getApplicationSchedule = (category: string) => {
    switch (category) {
      case "cereals-millets":
        return [
          { stage: "Basal Application", timing: "At sowing", fertilizers: ["DAP", "MOP"], percentage: "100% P&K, 25% N" },
          { stage: "First Top Dressing", timing: "30-35 days after sowing", fertilizers: ["Urea"], percentage: "50% N" },
          { stage: "Second Top Dressing", timing: "60-65 days after sowing", fertilizers: ["Urea"], percentage: "25% N" },
        ]
      case "pulses-legumes":
        return [
          { stage: "Basal Application", timing: "At sowing", fertilizers: ["DAP", "MOP"], percentage: "100% P&K" },
          { stage: "Top Dressing", timing: "30 days after sowing", fertilizers: ["Urea"], percentage: "100% N" },
        ]
      case "vegetables":
        return [
          { stage: "Basal Application", timing: "At transplanting/sowing", fertilizers: ["DAP", "MOP"], percentage: "100% P&K, 30% N" },
          { stage: "First Top Dressing", timing: "20-25 days", fertilizers: ["Urea"], percentage: "35% N" },
          { stage: "Second Top Dressing", timing: "45-50 days", fertilizers: ["Urea"], percentage: "35% N" },
        ]
      case "fruits":
        return [
          { stage: "Pre-flowering", timing: "Before flowering", fertilizers: ["DAP", "MOP"], percentage: "50% P&K, 25% N" },
          { stage: "Flowering Stage", timing: "During flowering", fertilizers: ["Urea"], percentage: "50% N" },
          { stage: "Fruit Development", timing: "After fruit set", fertilizers: ["MOP", "Urea"], percentage: "50% P&K, 25% N" },
        ]
      case "cash-industrial":
        return [
          { stage: "Basal Application", timing: "At sowing/planting", fertilizers: ["DAP", "MOP"], percentage: "100% P&K, 30% N" },
          { stage: "Vegetative Stage", timing: "30-40 days", fertilizers: ["Urea"], percentage: "40% N" },
          { stage: "Reproductive Stage", timing: "60-70 days", fertilizers: ["Urea"], percentage: "30% N" },
        ]
      default:
        return [
          { stage: "Basal Application", timing: "At sowing", fertilizers: ["DAP", "MOP"], percentage: "100% P&K, 50% N" },
          { stage: "Top Dressing", timing: "30 days after sowing", fertilizers: ["Urea"], percentage: "50% N" },
        ]
    }
  }

  const calculateFertilizer = async () => {
    // Validation
    if (!formData.category || !formData.crop || !formData.soilType || !formData.area || !formData.targetYield) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const selectedCrop = availableCrops[formData.crop]
    if (!selectedCrop) {
      toast({
        title: "Invalid Crop",
        description: "Please select a valid crop",
        variant: "destructive",
      })
      return
    }

    // Validate numeric inputs
    const area = parseFloat(formData.area)
    const targetYield = parseFloat(formData.targetYield)

    if (isNaN(area) || area <= 0) {
      toast({
        title: "Invalid Area",
        description: "Please enter a valid area in acres",
        variant: "destructive",
      })
      return
    }

    if (isNaN(targetYield) || targetYield <= 0) {
      toast({
        title: "Invalid Yield",
        description: "Please enter a valid target yield",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    try {
      // Soil type adjustment factors
      const soilAdjustment: { [key: string]: { n: number; p: number; k: number } } = {
        alluvial: { n: 1.0, p: 1.0, k: 1.0 },
        black: { n: 0.8, p: 1.2, k: 1.1 },
        red: { n: 1.1, p: 0.9, k: 1.0 },
        laterite: { n: 1.2, p: 0.8, k: 0.9 },
        sandy: { n: 1.2, p: 0.9, k: 0.8 },
        clay: { n: 0.9, p: 1.1, k: 1.2 },
        loamy: { n: 1.0, p: 1.0, k: 1.0 },
      }

      const soil = soilAdjustment[formData.soilType] || soilAdjustment.loamy

      // Calculate base requirements (kg per quintal of yield)
      const baseN = selectedCrop.n * targetYield * area * soil.n
      const baseP = selectedCrop.p * targetYield * area * soil.p
      const baseK = selectedCrop.k * targetYield * area * soil.k

      // Adjust for existing soil nutrients if provided
      const existingN = formData.currentNPK.n ? parseFloat(formData.currentNPK.n) * area : 0
      const existingP = formData.currentNPK.p ? parseFloat(formData.currentNPK.p) * area : 0
      const existingK = formData.currentNPK.k ? parseFloat(formData.currentNPK.k) * area : 0

      const requiredN = Math.max(0, Math.round(baseN - existingN))
      const requiredP = Math.max(0, Math.round(baseP - existingP))
      const requiredK = Math.max(0, Math.round(baseK - existingK))

      // Calculate fertilizer quantities
      const ureaQty = Math.round(requiredN / 0.46) // Urea is 46% N
      const dapQty = Math.round(requiredP / 0.46) // DAP is 46% P2O5
      const mopQty = Math.round(requiredK / 0.6) // MOP is 60% K2O

      // Calculate costs (approximate prices in INR)
      const ureaCost = ureaQty * 6
      const dapCost = dapQty * 30
      const mopCost = mopQty * 20
      const totalCost = ureaCost + dapCost + mopCost

      const result = {
        cropName: selectedCrop.name,
        nitrogen: requiredN,
        phosphorus: requiredP,
        potassium: requiredK,
        recommendations: [
          { fertilizer: "Urea (46-0-0)", quantity: `${ureaQty} kg`, cost: `₹${ureaCost.toLocaleString()}`, nutrient: "Nitrogen" },
          { fertilizer: "DAP (18-46-0)", quantity: `${dapQty} kg`, cost: `₹${dapCost.toLocaleString()}`, nutrient: "Phosphorus" },
          { fertilizer: "MOP (0-0-60)", quantity: `${mopQty} kg`, cost: `₹${mopCost.toLocaleString()}`, nutrient: "Potassium" },
        ],
        totalCost: `₹${totalCost.toLocaleString()}`,
        applicationSchedule: getApplicationSchedule(formData.category),
        soilRecommendations: getSoilSpecificRecommendations(formData.soilType),
      }

      setCalculation(result)
      setShowSuppliers(false) // Reset suppliers view

      toast({
        title: "Calculation Complete!",
        description: `Fertilizer recommendations generated for ${selectedCrop.name}`,
      })

    } catch (error) {
      console.error('Calculation error:', error)
      toast({
        title: "Calculation Error",
        description: "There was an error calculating fertilizer requirements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Fertilizer Calculator 🧪</h1>
          <p className="text-muted-foreground">
            Calculate optimal fertilizer quantities for all crop types based on soil and yield requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Crop & Soil Information
              </CardTitle>
              <CardDescription>
                Enter your crop and soil details for personalized fertilizer recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Crop Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cropCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="crop">Crop Type *</Label>
                  <Select
                    value={formData.crop}
                    onValueChange={(value) => setFormData({ ...formData, crop: value })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.category ? "Select crop" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(availableCrops).map(([key, crop]: [string, any]) => (
                        <SelectItem key={key} value={key}>
                          {crop.icon} {crop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="soil-type">Soil Type *</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                      <SelectItem value="black">Black Cotton Soil</SelectItem>
                      <SelectItem value="red">Red Soil</SelectItem>
                      <SelectItem value="laterite">Laterite Soil</SelectItem>
                      <SelectItem value="sandy">Sandy Soil</SelectItem>
                      <SelectItem value="clay">Clay Soil</SelectItem>
                      <SelectItem value="loamy">Loamy Soil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area">Field Area (acres) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="target-yield">Target Yield (quintals/acre) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g., 45"
                  value={formData.targetYield}
                  onChange={(e) => setFormData({ ...formData, targetYield: e.target.value })}
                />
              </div>

              <div>
                <Label>Current Soil NPK Levels (optional - kg/ha)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="N (kg/ha)"
                    value={formData.currentNPK.n}
                    onChange={(e) =>
                      setFormData({ ...formData, currentNPK: { ...formData.currentNPK, n: e.target.value } })
                    }
                  />
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="P (kg/ha)"
                    value={formData.currentNPK.p}
                    onChange={(e) =>
                      setFormData({ ...formData, currentNPK: { ...formData.currentNPK, p: e.target.value } })
                    }
                  />
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="K (kg/ha)"
                    value={formData.currentNPK.k}
                    onChange={(e) =>
                      setFormData({ ...formData, currentNPK: { ...formData.currentNPK, k: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="soil-ph">Soil pH (optional)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="3"
                  max="10"
                  placeholder="e.g., 6.5"
                  value={formData.soilPH}
                  onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
                />
              </div>

              <Button 
                onClick={calculateFertilizer} 
                className="w-full" 
                disabled={isCalculating}
              >
                <Beaker className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Calculate Fertilizer Requirements"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {calculation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-500" />
                  Fertilizer Recommendations for {calculation.cropName}
                </CardTitle>
                <CardDescription>Customized fertilizer plan for your crop and soil conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NPK Requirements */}
                <div>
                  <h4 className="font-semibold mb-3">Nutrient Requirements (total for {formData.area} acres)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{calculation.nitrogen}</div>
                      <div className="text-sm text-muted-foreground">kg Nitrogen</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{calculation.phosphorus}</div>
                      <div className="text-sm text-muted-foreground">kg Phosphorus</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{calculation.potassium}</div>
                      <div className="text-sm text-muted-foreground">kg Potassium</div>
                    </div>
                  </div>
                </div>

                {/* Fertilizer Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3">Recommended Fertilizers</h4>
                  <div className="space-y-3">
                    {calculation.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{rec.fertilizer}</span>
                          <div className="text-sm text-muted-foreground">{rec.quantity}</div>
                          <div className="text-xs text-muted-foreground">Primary: {rec.nutrient}</div>
                        </div>
                        <Badge variant="outline">{rec.cost}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Estimated Cost:</span>
                      <span className="text-lg font-bold text-green-600">{calculation.totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* Where to Buy Button */}
                <div className="text-center">
                  <Button 
                    onClick={() => setShowSuppliers(!showSuppliers)} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {showSuppliers ? 'Hide' : 'Show'} Where to Buy Fertilizers
                  </Button>
                </div>

                {/* Application Schedule */}
                <div>
                  <h4 className="font-semibold mb-3">Application Schedule</h4>
                  <div className="space-y-3">
                    {calculation.applicationSchedule.map((schedule: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{schedule.stage}</h5>
                          <Badge variant="secondary">{schedule.timing}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Apply: {schedule.fertilizers.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">{schedule.percentage}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soil-Specific Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3">Soil-Specific Tips</h4>
                  <div className="space-y-2">
                    {calculation.soilRecommendations.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Where to Buy Fertilizers Section */}
        {showSuppliers && calculation && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                  Where to Buy Fertilizers
                </CardTitle>
                <CardDescription>
                  Find the best places to purchase your recommended fertilizers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Online Platforms */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-green-500" />
                      Online Platforms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fertilizerSuppliers.online.map((supplier, index) => (
                        <Card key={index} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{supplier.name}</h4>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm">{supplier.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{supplier.type}</p>
                            <p className="text-sm mb-3">{supplier.speciality}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {supplier.features.map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-1" />
                                {supplier.phone}
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Physical Stores */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                      Physical Stores & Cooperatives
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fertilizerSuppliers.physical.map((supplier, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{supplier.name}</h4>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm">{supplier.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{supplier.type}</p>
                            <p className="text-sm mb-3">{supplier.speciality}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {supplier.features.map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {supplier.locations}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {supplier.phone}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Manufacturers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Beaker className="mr-2 h-5 w-5 text-purple-500" />
                      Direct from Manufacturers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fertilizerSuppliers.manufacturers.map((supplier, index) => (
                        <Card key={index} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{supplier.name}</h4>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm">{supplier.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{supplier.type}</p>
                            <p className="text-sm mb-3">{supplier.speciality}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {supplier.features.map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-1" />
                                {supplier.phone}
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Tips for Buying */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">💡 Tips for Buying Fertilizers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Quality Checks</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Check manufacturing date and expiry</li>
                            <li>• Verify ISI mark and company seal</li>
                            <li>• Ensure proper packaging without damage</li>
                            <li>• Buy from authorized dealers only</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Cost Savings</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Buy in bulk for better rates</li>
                            <li>• Check for government subsidies</li>
                            <li>• Compare prices across suppliers</li>
                            <li>• Consider cooperative societies</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Fertilizer Application Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Apply fertilizers when soil moisture is adequate (50-60% field capacity)</li>
                <li>• Split nitrogen application for better efficiency and reduced losses</li>
                <li>• Consider soil testing every 2-3 years for accurate recommendations</li>
                <li>• Organic matter improves fertilizer effectiveness by 15-20%</li>
                <li>• Avoid over-fertilization to prevent nutrient runoff and environmental damage</li>
                <li>• Apply phosphorus and potassium as basal dose before sowing</li>
                <li>• Use foliar application for quick nutrient correction</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fertilizer Types & Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <strong className="text-blue-800">Urea (46-0-0):</strong>
                  <p className="text-blue-700 mt-1">High nitrogen content, quick release, water-soluble</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <strong className="text-green-800">DAP (18-46-0):</strong>
                  <p className="text-green-700 mt-1">Good for phosphorus deficient soils, contains nitrogen too</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <strong className="text-orange-800">MOP (0-0-60):</strong>
                  <p className="text-orange-700 mt-1">Potassium source for fruit quality and disease resistance</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <strong className="text-purple-800">NPK Complex:</strong>
                  <p className="text-purple-700 mt-1">Balanced nutrition, various ratios available (19:19:19, 20:20:0)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
