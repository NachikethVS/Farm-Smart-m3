"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, MapPin, Calendar, BarChart3, RefreshCw, Bell, Search } from 'lucide-react'

// All Indian states and major markets
const indianStates = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tezpur"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
  Delhi: ["New Delhi", "Central Delhi", "East Delhi", "West Delhi"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Haryana: ["Gurgaon", "Faridabad", "Karnal", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  Meghalaya: ["Shillong", "Tura", "Jowai", "Nongpoh"],
  Mizoram: ["Aizawl", "Lunglei", "Saiha", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  Tripura: ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  Ladakh: ["Leh", "Kargil", "Nubra", "Zanskar"],
}

// Comprehensive crop database organized by categories
const cropDatabase = [
  // Cereals & Millets
  {
    crop: "Rice (Basmati)",
    basePrice: 4200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Punjab", "Haryana", "Uttar Pradesh", "West Bengal"],
    unit: "quintal",
  },
  {
    crop: "Rice (Common)",
    basePrice: 2800,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["West Bengal", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Wheat",
    basePrice: 2150,
    icon: "🌾",
    season: "Rabi",
    category: "Cereals & Millets",
    majorStates: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
    unit: "quintal",
  },
  {
    crop: "Maize (Corn)",
    basePrice: 1850,
    icon: "🌽",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"],
    unit: "quintal",
  },
  {
    crop: "Barley",
    basePrice: 1650,
    icon: "🌾",
    season: "Rabi",
    category: "Cereals & Millets",
    majorStates: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Haryana"],
    unit: "quintal",
  },
  {
    crop: "Sorghum (Jowar)",
    basePrice: 2800,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Pearl Millet (Bajra)",
    basePrice: 2200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Rajasthan", "Gujarat", "Haryana", "Uttar Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Finger Millet (Ragi)",
    basePrice: 3200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Odisha"],
    unit: "quintal",
  },
  {
    crop: "Oats",
    basePrice: 2500,
    icon: "🌾",
    season: "Rabi",
    category: "Cereals & Millets",
    majorStates: ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan"],
    unit: "quintal",
  },

  // Pulses & Legumes
  {
    crop: "Chickpea (Gram)",
    basePrice: 4800,
    icon: "🫛",
    season: "Rabi",
    category: "Pulses & Legumes",
    majorStates: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Green Gram (Moong)",
    basePrice: 6200,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Rajasthan", "Maharashtra", "Andhra Pradesh", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Black Gram (Urad)",
    basePrice: 5800,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Madhya Pradesh", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Pigeon Pea (Arhar)",
    basePrice: 6200,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat"],
    unit: "quintal",
  },
  {
    crop: "Lentil (Masur)",
    basePrice: 5400,
    icon: "🫛",
    season: "Rabi",
    category: "Pulses & Legumes",
    majorStates: ["Uttar Pradesh", "Madhya Pradesh", "West Bengal", "Bihar"],
    unit: "quintal",
  },
  {
    crop: "Pea",
    basePrice: 4200,
    icon: "🫛",
    season: "Rabi",
    category: "Pulses & Legumes",
    majorStates: ["Uttar Pradesh", "Madhya Pradesh", "Bihar", "Haryana"],
    unit: "quintal",
  },
  {
    crop: "Cowpea",
    basePrice: 4800,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Rajasthan", "Maharashtra", "Karnataka", "Tamil Nadu"],
    unit: "quintal",
  },

  // Vegetables
  {
    crop: "Potato",
    basePrice: 1200,
    icon: "🥔",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat"],
    unit: "quintal",
  },
  {
    crop: "Onion",
    basePrice: 1800,
    icon: "🧅",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Tomato",
    basePrice: 3500,
    icon: "🍅",
    season: "All Season",
    category: "Vegetables",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"],
    unit: "quintal",
  },
  {
    crop: "Cabbage",
    basePrice: 1500,
    icon: "🥬",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["West Bengal", "Odisha", "Bihar", "Assam"],
    unit: "quintal",
  },
  {
    crop: "Cauliflower",
    basePrice: 1800,
    icon: "🥦",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["West Bengal", "Uttar Pradesh", "Bihar", "Haryana"],
    unit: "quintal",
  },
  {
    crop: "Carrot",
    basePrice: 2200,
    icon: "🥕",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Haryana", "Punjab", "Uttar Pradesh", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Spinach",
    basePrice: 2800,
    icon: "🥬",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "Bihar", "West Bengal", "Maharashtra"],
    unit: "quintal",
  },
  {
    crop: "Brinjal (Eggplant)",
    basePrice: 2500,
    icon: "🍆",
    season: "All Season",
    category: "Vegetables",
    majorStates: ["West Bengal", "Odisha", "Karnataka", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Okra (Ladyfinger)",
    basePrice: 3200,
    icon: "🌶️",
    season: "Kharif",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "Bihar", "West Bengal", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Cucumber",
    basePrice: 2000,
    icon: "🥒",
    season: "Zaid",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "Haryana", "Punjab", "Rajasthan"],
    unit: "quintal",
  },

  // Fruits
  {
    crop: "Mango",
    basePrice: 4500,
    icon: "🥭",
    season: "Summer",
    category: "Fruits",
    majorStates: ["Uttar Pradesh", "Andhra Pradesh", "Karnataka", "Gujarat"],
    unit: "quintal",
  },
  {
    crop: "Banana",
    basePrice: 2800,
    icon: "🍌",
    season: "All Season",
    category: "Fruits",
    majorStates: ["Tamil Nadu", "Gujarat", "Maharashtra", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Apple",
    basePrice: 8500,
    icon: "🍎",
    season: "Winter",
    category: "Fruits",
    majorStates: ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand"],
    unit: "quintal",
  },
  {
    crop: "Papaya",
    basePrice: 1800,
    icon: "🫐",
    season: "All Season",
    category: "Fruits",
    majorStates: ["Andhra Pradesh", "Gujarat", "Maharashtra", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Guava",
    basePrice: 2200,
    icon: "🍐",
    season: "Winter",
    category: "Fruits",
    majorStates: ["Uttar Pradesh", "Bihar", "Maharashtra", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Pomegranate",
    basePrice: 6500,
    icon: "🍎",
    season: "All Season",
    category: "Fruits",
    majorStates: ["Maharashtra", "Karnataka", "Gujarat", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Grapes",
    basePrice: 4200,
    icon: "🍇",
    season: "Winter",
    category: "Fruits",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Watermelon",
    basePrice: 1500,
    icon: "🍉",
    season: "Summer",
    category: "Fruits",
    majorStates: ["Uttar Pradesh", "Rajasthan", "Madhya Pradesh", "Andhra Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Muskmelon",
    basePrice: 1800,
    icon: "🍈",
    season: "Summer",
    category: "Fruits",
    majorStates: ["Uttar Pradesh", "Punjab", "Rajasthan", "Haryana"],
    unit: "quintal",
  },
  {
    crop: "Pineapple",
    basePrice: 3200,
    icon: "🍍",
    season: "All Season",
    category: "Fruits",
    majorStates: ["West Bengal", "Assam", "Karnataka", "Kerala"],
    unit: "quintal",
  },

  // Cash & Industrial Crops
  {
    crop: "Sugarcane",
    basePrice: 350,
    icon: "🎋",
    season: "Annual",
    category: "Cash & Industrial",
    majorStates: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"],
    unit: "quintal",
  },
  {
    crop: "Cotton",
    basePrice: 6800,
    icon: "🌿",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Gujarat", "Maharashtra", "Telangana", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Groundnut",
    basePrice: 5800,
    icon: "🥜",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Mustard",
    basePrice: 5200,
    icon: "🌻",
    season: "Rabi",
    category: "Cash & Industrial",
    majorStates: ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"],
    unit: "quintal",
  },
  {
    crop: "Soybean",
    basePrice: 4500,
    icon: "🫘",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Sunflower",
    basePrice: 6200,
    icon: "🌻",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Karnataka", "Andhra Pradesh", "Maharashtra", "Bihar"],
    unit: "quintal",
  },
  {
    crop: "Sesame",
    basePrice: 8500,
    icon: "🌰",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["West Bengal", "Rajasthan", "Madhya Pradesh", "Gujarat"],
    unit: "quintal",
  },
  {
    crop: "Castor",
    basePrice: 5500,
    icon: "🌰",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Gujarat", "Rajasthan", "Andhra Pradesh", "Karnataka"],
    unit: "quintal",
  },
  {
    crop: "Tobacco",
    basePrice: 12000,
    icon: "🍃",
    season: "Rabi",
    category: "Cash & Industrial",
    majorStates: ["Andhra Pradesh", "Karnataka", "Gujarat", "West Bengal"],
    unit: "quintal",
  },
  {
    crop: "Jute",
    basePrice: 4200,
    icon: "🌿",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["West Bengal", "Bihar", "Assam", "Odisha"],
    unit: "quintal",
  },
  {
    crop: "Areca Nut",
    basePrice: 35000,
    icon: "🥥",
    season: "All Season",
    category: "Cash & Industrial",
    majorStates: ["Karnataka", "Kerala", "Assam", "West Bengal"],
    unit: "quintal",
  },
]

// Generate realistic market data with state-specific variations
const generateMarketData = (selectedState: string, selectedMarket: string) => {
  const stateMultipliers: { [key: string]: number } = {
    Punjab: 1.12,
    Haryana: 1.1,
    Maharashtra: 1.08,
    Gujarat: 1.06,
    Karnataka: 1.04,
    "Tamil Nadu": 1.03,
    "Andhra Pradesh": 1.02,
    Telangana: 1.02,
    "Uttar Pradesh": 1.0,
    "Madhya Pradesh": 0.98,
    Rajasthan: 0.97,
    "West Bengal": 0.96,
    Bihar: 0.94,
    Odisha: 0.93,
    Jharkhand: 0.92,
    Chhattisgarh: 0.91,
    Assam: 0.9,
    Kerala: 1.05,
    Delhi: 1.15,
  }

  const marketMultipliers: { [key: string]: number } = {
    Mumbai: 1.15,
    Delhi: 1.12,
    Bangalore: 1.08,
    Chennai: 1.06,
    Pune: 1.04,
    Ahmedabad: 1.02,
    Surat: 1.01,
    Ludhiana: 1.03,
    Kolkata: 1.02,
    Hyderabad: 1.04,
    Jaipur: 1.01,
  }

  const stateMultiplier = stateMultipliers[selectedState] || 1.0
  const marketMultiplier = marketMultipliers[selectedMarket] || 1.0
  const timeVariation = 0.95 + Math.random() * 0.1 // ±5% daily variation

  return cropDatabase.map((item) => {
    // Higher prices for crops not grown in the selected state (transport costs)
    const isLocalCrop = item.majorStates.includes(selectedState)
    const localMultiplier = isLocalCrop ? 1.0 : 1.2

    const adjustedPrice = Math.round(
      item.basePrice * stateMultiplier * marketMultiplier * timeVariation * localMultiplier,
    )
    const previousPrice = Math.round(adjustedPrice * (0.92 + Math.random() * 0.16))
    const change = ((adjustedPrice - previousPrice) / previousPrice) * 100

    return {
      ...item,
      currentPrice: adjustedPrice,
      previousPrice,
      change: Number(change.toFixed(2)),
      trend: change > 0 ? "up" : "down",
      volume: `${Math.floor(Math.random() * 2000) + 500} tonnes`,
      lastUpdated: `${Math.floor(Math.random() * 30) + 1} mins ago`,
      market: selectedMarket,
      state: selectedState,
      isLocal: isLocalCrop,
      msp: item.basePrice * 0.9, // Minimum Support Price (approximate)
    }
  })
}

export default function MarketPrices() {
  const [selectedState, setSelectedState] = useState("Punjab")
  const [selectedMarket, setSelectedMarket] = useState("Ludhiana")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSeason, setSelectedSeason] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [marketData, setMarketData] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const availableMarkets = indianStates[selectedState as keyof typeof indianStates] || []

  // Generate initial data
  useEffect(() => {
    refreshData()
  }, [selectedState, selectedMarket])

  // Auto-refresh every 2 minutes for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [selectedState, selectedMarket])

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const data = generateMarketData(selectedState, selectedMarket)
      setMarketData(data)
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1500)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    const markets = indianStates[state as keyof typeof indianStates]
    if (markets && markets.length > 0) {
      setSelectedMarket(markets[0])
    }
  }

  // Filter data based on search, category, and season selection
  const filteredData = marketData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSeason = selectedSeason === "All" || item.season === selectedSeason
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSeason && matchesSearch
  })

  // Calculate top gainers and losers
  const topGainers = filteredData
    .filter((item) => item.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 5)

  const topLosers = filteredData
    .filter((item) => item.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 5)

  const priceAlerts = [
    {
      crop: "Wheat",
      targetPrice: 2200,
      currentPrice: marketData.find((item) => item.crop === "Wheat")?.currentPrice || 2150,
      type: "above",
    },
    {
      crop: "Rice (Basmati)",
      targetPrice: 4000,
      currentPrice: marketData.find((item) => item.crop === "Rice (Basmati)")?.currentPrice || 4200,
      type: "below",
    },
  ]

  const categories = ["All", "Cereals & Millets", "Pulses & Legumes", "Vegetables", "Fruits", "Cash & Industrial"]
  const seasons = ["All", "Kharif", "Rabi", "Zaid", "Summer", "Winter", "All Season", "Annual"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Prices 📈</h1>
            <p className="text-muted-foreground">Real-time crop prices across all Indian states and markets</p>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()} |<span className="text-green-600 ml-1">● Live Data</span>
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Price Alerts
            </Button>
            <Button onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.keys(indianStates).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Market</label>
                <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Market" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMarkets.map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search crops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected Market:</strong> {selectedMarket}, {selectedState} |
                <strong className="ml-2">Total Crops:</strong> {filteredData.length} |
                <strong className="ml-2">Local Crops:</strong> {filteredData.filter((item) => item.isLocal).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Price Table */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Live Market Prices - {selectedMarket}
                  </span>
                  <Badge variant="outline" className="text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Real-time Data
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Current prices from {selectedMarket} mandi, {selectedState}
                  {selectedCategory !== "All" && ` - ${selectedCategory}`}
                  {selectedSeason !== "All" && ` - ${selectedSeason} Season`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRefreshing ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg flex items-center">
                                {item.crop}
                                {item.isLocal && (
                                  <Badge variant="outline" className="ml-2 text-xs text-green-600">
                                    Local
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.season}
                                </Badge>
                                <span>MSP: ₹{Math.round(item.msp)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              {item.market}, {item.state}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {item.lastUpdated}
                            </span>
                            <span>Volume: {item.volume}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{item.currentPrice.toLocaleString()}
                            </div>
                            <Badge variant={item.trend === "up" ? "default" : "destructive"}>
                              {item.trend === "up" ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              )}
                              {Math.abs(item.change)}%
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">per {item.unit}</div>
                          <div className={`text-sm ${item.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {item.change > 0 ? "+" : ""}₹{Math.abs(item.currentPrice - item.previousPrice)} from
                            yesterday
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Market Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Crops</span>
                    <span className="font-semibold">{filteredData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price Rising</span>
                    <span className="font-semibold text-green-600">
                      {filteredData.filter((item) => item.change > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price Falling</span>
                    <span className="font-semibold text-red-600">
                      {filteredData.filter((item) => item.change < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Local Crops</span>
                    <span className="font-semibold text-blue-600">
                      {filteredData.filter((item) => item.isLocal).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topGainers.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{item.crop}</span>
                        <div className="text-xs text-muted-foreground">₹{item.currentPrice}</div>
                      </div>
                      <Badge variant="default" className="text-green-600">
                        +{item.change}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingDown className="mr-2 h-5 w-5 text-red-500" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLosers.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{item.crop}</span>
                        <div className="text-xs text-muted-foreground">₹{item.currentPrice}</div>
                      </div>
                      <Badge variant="destructive">{item.change}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Bell className="mr-2 h-5 w-5" />
                  Your Price Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAlerts.map((alert, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{alert.crop}</span>
                          <div className="text-sm text-muted-foreground">
                            Alert when {alert.type} ₹{alert.targetPrice}
                          </div>
                          <div className="text-sm">Current: ₹{alert.currentPrice}</div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  Add New Alert
                </Button>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>APMC Markets</span>
                    <Badge variant="outline" className="text-green-600">
                      Live
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>eNAM Portal</span>
                    <Badge variant="outline" className="text-green-600">
                      Live
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>State Mandis</span>
                    <Badge variant="outline" className="text-green-600">
                      Live
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>MSP Data</span>
                    <Badge variant="outline" className="text-blue-600">
                      Official
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
