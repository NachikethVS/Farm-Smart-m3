"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, Stethoscope, CloudRain, Calculator, ShoppingCart, Users, TrendingUp, FileText, ArrowRight, Thermometer, Droplets, Sun, BarChart3, MapPin, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { useLocation } from "@/components/location-context"

const modules = [
  {
    title: "Crop Planner",
    description: "AI-generated weekly farming tasks based on crop type, season, and location",
    icon: Sprout,
    href: "/crop-planner",
    color: "bg-green-500",
    tasks: 3,
  },
  {
    title: "Plant Doctor",
    description: "Upload plant images to diagnose diseases and get treatment suggestions",
    icon: Stethoscope,
    href: "/plant-doctor",
    color: "bg-red-500",
    tasks: 0,
  },
  {
    title: "Weather Scheduler",
    description: "Sync farming tasks with real-time weather forecasts",
    icon: CloudRain,
    href: "/weather",
    color: "bg-blue-500",
    tasks: 2,
  },
  {
    title: "Irrigation Planner",
    description: "Smart irrigation planning and water management with AI recommendations",
    icon: Droplets,
    href: "/irrigation",
    color: "bg-cyan-500",
    tasks: 1,
  },
  {
    title: "Fertilizer Calculator",
    description: "Optimal fertilizer quantities based on soil type and crop goals",
    icon: Calculator,
    href: "/fertilizer",
    color: "bg-purple-500",
    tasks: 0,
  },
  {
    title: "Agri Store",
    description: "Buy seeds, pesticides, tools, and nutrients from verified vendors",
    icon: ShoppingCart,
    href: "/store",
    color: "bg-orange-500",
    tasks: 0,
  },
  {
    title: "Community",
    description: "Share insights, ask questions, and learn from other farmers",
    icon: Users,
    href: "/community",
    color: "bg-indigo-500",
    tasks: 5,
  },
  {
    title: "Market Prices",
    description: "Real-time market prices for crops across regions",
    icon: TrendingUp,
    href: "/market",
    color: "bg-emerald-500",
    tasks: 0,
  },
  {
    title: "Market Insights",
    description: "Real-time selling prices and market opportunities",
    icon: BarChart3,
    href: "/market-insights",
    color: "bg-cyan-500",
    tasks: 2,
  },
  {
    title: "Schemes & Subsidies",
    description: "Discover government programs and apply directly",
    icon: FileText,
    href: "/schemes",
    color: "bg-yellow-500",
    tasks: 2,
  },
]

// Generate location-specific weather data
const generateWeatherData = (location: any) => {
  if (!location) {
    return {
      temperature: 28,
      humidity: 65,
      condition: "Partly Cloudy",
      rainfall: 0,
    }
  }

  // Location-specific weather variations
  const stateWeatherPatterns: { [key: string]: any } = {
    Punjab: { tempBase: 25, humidityBase: 60, rainChance: 0.2 },
    Maharashtra: { tempBase: 30, humidityBase: 70, rainChance: 0.3 },
    "Uttar Pradesh": { tempBase: 28, humidityBase: 65, rainChance: 0.25 },
    Gujarat: { tempBase: 32, humidityBase: 55, rainChance: 0.15 },
    Haryana: { tempBase: 26, humidityBase: 58, rainChance: 0.18 },
    Karnataka: { tempBase: 29, humidityBase: 68, rainChance: 0.35 },
    "Tamil Nadu": { tempBase: 31, humidityBase: 75, rainChance: 0.4 },
    "Andhra Pradesh": { tempBase: 30, humidityBase: 72, rainChance: 0.38 },
  }

  const pattern = stateWeatherPatterns[location.state] || stateWeatherPatterns.Punjab
  const tempVariation = Math.random() * 6 - 3 // ±3°C variation
  const humidityVariation = Math.random() * 20 - 10 // ±10% variation

  return {
    temperature: Math.round(pattern.tempBase + tempVariation),
    humidity: Math.round(Math.max(30, Math.min(90, pattern.humidityBase + humidityVariation))),
    condition: Math.random() > pattern.rainChance ? "Partly Cloudy" : "Light Rain",
    rainfall: Math.random() > pattern.rainChance ? 0 : Math.round(Math.random() * 15 + 5),
  }
}

// Generate location-specific recommendations based on current season, climate, and regional farming practices
const generateRecommendations = (location: any) => {
  if (!location) return []

  const currentMonth = new Date().getMonth() + 1 // 1-12
  const currentSeason = getCurrentSeason(currentMonth)

  const locationRecommendations: { [key: string]: { [key: string]: string[] } } = {
    Punjab: {
      winter: [
        "🌾 Perfect time for wheat sowing (Nov-Dec) - ensure soil moisture is adequate",
        "🥔 Plant potatoes now for February harvest - choose certified seed varieties",
        "🌱 Apply basal fertilizers for rabi crops - DAP and potash recommended",
        "💧 Set up drip irrigation for winter vegetables - water efficiently during dry spells",
      ],
      summer: [
        "🌾 Wheat harvesting season - monitor grain moisture content (12-14%)",
        "🌽 Prepare for maize sowing after wheat harvest - hybrid varieties recommended",
        "💧 Install drip irrigation systems before kharif season begins",
        "🌿 Increase irrigation frequency for summer crops - high temperatures require more water",
      ],
      monsoon: [
        "🌾 Ideal time for basmati rice transplanting - maintain 2-3 cm water level",
        "🌿 Cotton sowing window open - choose Bt cotton varieties for better yield",
        "🌱 Apply nitrogen fertilizer to standing crops after rain stops",
        "💧 Monitor drainage systems - prevent waterlogging during heavy rains",
      ],
      postMonsoon: [
        "🌾 Rice is in flowering stage - ensure continuous water supply",
        "🌿 Monitor cotton for pink bollworm - apply recommended pesticides",
        "🥬 Start preparing for winter vegetable cultivation",
        "💧 Adjust irrigation schedules as temperatures drop - reduce frequency gradually",
      ],
    },
    Maharashtra: {
      winter: [
        "🧅 Onion harvesting season - cure properly before storage to get better prices",
        "🌾 Wheat sowing in Marathwada region - choose drought-resistant varieties",
        "🍇 Grape pruning season - remove excess shoots for better fruit quality",
        "💧 Implement micro-irrigation for winter crops - save water and improve yields",
      ],
      summer: [
        "🌿 Summer cotton cultivation possible with irrigation in Vidarbha",
        "🥭 Mango harvesting season - handle carefully to avoid post-harvest losses",
        "💧 Implement water conservation techniques - mulching recommended",
        "🌿 Install shade nets for vegetable crops - protect from intense summer heat",
      ],
      monsoon: [
        "🌿 Cotton sowing peak season in Vidarbha - ensure proper spacing (90x45 cm)",
        "🌾 Soybean cultivation ideal now - choose varieties suitable for your soil",
        "🌽 Maize sowing window - hybrid varieties give better yields in Maharashtra",
        "💧 Check irrigation channels - repair before monsoon for better water management",
      ],
      postMonsoon: [
        "🌿 Cotton crop needs protection from bollworm - integrated pest management",
        "🌾 Soybean harvest approaching - monitor pod filling stage",
        "🧅 Prepare land for onion transplanting - apply organic manure",
        "💧 Plan post-monsoon irrigation - utilize stored rainwater efficiently",
      ],
    },
    "Uttar Pradesh": {
      winter: [
        "🌾 Wheat is the main rabi crop - sow by mid-December for optimal yield",
        "🥔 Potato cultivation peak season - ensure proper earthing up",
        "🌱 Mustard sowing window - good cash crop option for small farmers",
        "💧 Set up sprinkler irrigation for wheat - uniform water distribution important",
      ],
      summer: [
        "🌾 Wheat harvesting in full swing - use combine harvesters to save time",
        "🥔 Potato harvesting and storage - maintain cold storage temperature at 2-4°C",
        "🌽 Prepare for sugarcane planting - choose disease-resistant varieties",
        "💧 Install tube wells for summer irrigation - groundwater management crucial",
      ],
      monsoon: [
        "🌾 Rice transplanting season - maintain proper plant spacing (20x15 cm)",
        "🌽 Sugarcane planting ideal now - ensure proper drainage in fields",
        "🌱 Arhar (pigeon pea) sowing - good for soil health and protein source",
        "💧 Maintain field bunds - prevent soil erosion during heavy rains",
      ],
      postMonsoon: [
        "🌾 Rice crop in grain filling stage - avoid water stress",
        "🌽 Sugarcane needs earthing up and fertilizer application",
        "🥬 Start winter vegetable nursery preparation",
        "💧 Plan residual moisture utilization - reduce irrigation dependency",
      ],
    },
    Gujarat: {
      winter: [
        "🌿 Cotton harvesting season - pick cotton in early morning for better quality",
        "🥜 Groundnut cultivation in Saurashtra - choose varieties resistant to tikka disease",
        "🌾 Wheat cultivation in North Gujarat - ensure timely irrigation",
        "💧 Use drip irrigation for cotton - water and fertilizer efficiency important",
      ],
      summer: [
        "🌿 Cotton crop management - remove pink bollworm affected bolls",
        "🥜 Groundnut harvesting - proper curing essential for oil content",
        "💧 Summer irrigation management crucial - use sprinkler systems",
        "🌿 Install shade nets for summer vegetables - protect from heat stress",
      ],
      monsoon: [
        "🌿 Cotton sowing season - Bt cotton varieties recommended for Gujarat",
        "🥜 Groundnut sowing in Saurashtra region - ensure proper seed treatment",
        "🌽 Pearl millet (bajra) cultivation - drought-tolerant crop for arid areas",
        "💧 Construct farm ponds - rainwater harvesting for dry season",
      ],
      postMonsoon: [
        "🌿 Cotton crop protection from bollworm - use pheromone traps",
        "🥜 Groundnut crop needs protection from leaf spot diseases",
        "🌾 Prepare for rabi crop sowing - soil testing recommended",
        "💧 Utilize harvested rainwater - efficient irrigation scheduling needed",
      ],
    },
    Haryana: {
      winter: [
        "🌾 Wheat is the primary rabi crop - ensure proper seed rate (100 kg/ha)",
        "🥔 Potato cultivation profitable - choose processing varieties for better returns",
        "🌱 Mustard cultivation - good rotation crop after rice",
        "💧 Install laser land leveling - improve irrigation efficiency by 15-20%",
      ],
      summer: [
        "🌾 Wheat harvesting season - timely harvest prevents grain shattering",
        "🌽 Prepare for maize cultivation - hybrid varieties give 20% more yield",
        "💧 Install tube wells for summer irrigation - water table management important",
        "🌿 Use mulching for summer crops - conserve soil moisture effectively",
      ],
      monsoon: [
        "🌾 Basmati rice cultivation - maintain 2-3 cm standing water",
        "🌽 Maize sowing season - ensure proper plant population (75,000 plants/ha)",
        "🌱 Fodder crops like jowar and bajra for livestock",
        "💧 Check drainage systems - prevent waterlogging in low-lying areas",
      ],
      postMonsoon: [
        "🌾 Rice crop in milky stage - avoid water stress for grain filling",
        "🌽 Maize crop needs side dressing with nitrogen fertilizer",
        "🥬 Plan for winter fodder crops - berseem and oats",
        "💧 Prepare for efficient rabi irrigation - plan water scheduling",
      ],
    },
    Karnataka: {
      winter: [
        "☕ Coffee harvesting season in hill regions - pick only ripe cherries",
        "🌾 Ragi cultivation in dry areas - drought-resistant and nutritious",
        "🌶️ Chili cultivation - ensure proper spacing and staking",
        "💧 Install drip irrigation for coffee - water stress affects bean quality",
      ],
      summer: [
        "☕ Coffee plantation management - pruning and shade management",
        "🌾 Ragi harvesting - proper drying essential to prevent fungal attack",
        "💧 Drip irrigation installation for horticultural crops",
        "🌿 Use shade nets for pepper and vegetables - protect from summer heat",
      ],
      monsoon: [
        "🌾 Rice cultivation in coastal areas - choose varieties suitable for high rainfall",
        "🌿 Cotton cultivation in North Karnataka - ensure proper drainage",
        "🌽 Maize cultivation - good crop for medium rainfall areas",
        "💧 Construct check dams - soil and water conservation important",
      ],
      postMonsoon: [
        "🌾 Rice crop management - apply potash for grain filling",
        "🌿 Cotton crop protection - monitor for sucking pests",
        "🌶️ Chili transplanting season - choose disease-resistant varieties",
        "💧 Plan efficient water use - utilize stored rainwater for irrigation",
      ],
    },
    "Tamil Nadu": {
      winter: [
        "🌾 Rice (samba season) cultivation - ensure continuous water supply",
        "🥥 Coconut palm management - apply organic manure around palm base",
        "🌶️ Turmeric harvesting season - proper curing increases market value",
        "💧 Install micro-sprinklers for coconut - efficient water and nutrient application",
      ],
      summer: [
        "🌾 Rice harvesting (samba crop) - use mechanical harvesters to reduce losses",
        "🥥 Coconut irrigation management - drip irrigation recommended",
        "🌶️ Chili cultivation - choose varieties resistant to leaf curl virus",
        "💧 Implement deficit irrigation - save water during summer months",
      ],
      monsoon: [
        "🌾 Rice (kuruvai season) cultivation - short duration varieties preferred",
        "🌽 Maize cultivation in rain-fed areas - hybrid varieties recommended",
        "🌱 Groundnut cultivation - ensure proper drainage to prevent root rot",
        "💧 Maintain field channels - proper drainage prevents crop damage",
      ],
      postMonsoon: [
        "🌾 Rice crop in grain filling stage - maintain water level at 2-3 cm",
        "🌽 Maize harvest approaching - monitor grain moisture content",
        "🌶️ Turmeric planting season - choose disease-free rhizomes",
        "💧 Plan water budgeting - efficient use of available water resources",
      ],
    },
    "Andhra Pradesh": {
      winter: [
        "🌾 Rice (rabi season) cultivation - choose medium duration varieties",
        "🌶️ Chili harvesting season - multiple pickings increase total yield",
        "🥥 Coconut plantation management - apply balanced fertilizers",
        "💧 Install drip irrigation for chili - precise water and nutrient delivery",
      ],
      summer: [
        "🌾 Rice harvesting - proper drying prevents aflatoxin contamination",
        "🌶️ Chili drying and storage - maintain moisture content below 10%",
        "💧 Summer irrigation for perennial crops - efficient water use important",
        "🌿 Use shade nets for vegetable nurseries - protect seedlings from heat",
      ],
      monsoon: [
        "🌾 Rice (kharif season) - main crop season with assured irrigation",
        "🌿 Cotton cultivation in Telangana region - Bt varieties recommended",
        "🥜 Groundnut cultivation - choose varieties suitable for your soil type",
        "💧 Construct farm ponds - rainwater harvesting for lean periods",
      ],
      postMonsoon: [
        "🌾 Rice crop protection from brown plant hopper - use recommended pesticides",
        "🌿 Cotton crop management - remove excess vegetative growth",
        "🥜 Groundnut harvest timing crucial - monitor pod maturity",
        "💧 Plan post-monsoon irrigation - utilize conserved rainwater efficiently",
      ],
    },
  }

  const stateRecs = locationRecommendations[location.state]
  if (!stateRecs) return []

  return stateRecs[currentSeason] || []
}

// Helper function to determine current season
const getCurrentSeason = (month: number): string => {
  if (month >= 11 || month <= 2) return "winter" // Nov-Feb
  if (month >= 3 && month <= 5) return "summer" // Mar-May
  if (month >= 6 && month <= 9) return "monsoon" // Jun-Sep
  return "postMonsoon" // Oct
}

export default function Dashboard() {
  const { location, isLocationSet, setShowLocationSetup } = useLocation()
  const weatherData = generateWeatherData(location)
  const recommendations = generateRecommendations(location)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, Farmer! 🌱
                {location && (
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    from {location.district}, {location.state}
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">
                {isLocationSet
                  ? "Your personalized agricultural assistant with local recommendations."
                  : "Set up your location to get personalized weather, crop, and market recommendations."}
              </p>
            </div>
            {!isLocationSet && (
              <Button onClick={() => setShowLocationSetup(true)} className="bg-green-600 hover:bg-green-700">
                <MapPin className="mr-2 h-4 w-4" />
                Set Location
              </Button>
            )}
          </div>
        </div>

        {/* Location Alert */}
        {!isLocationSet && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800">Set up your farm location</h3>
                  <p className="text-sm text-orange-700">
                    Get personalized weather forecasts, crop recommendations, and local market prices for your area.
                  </p>
                </div>
                <Button
                  onClick={() => setShowLocationSetup(true)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Set Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Recommendations */}
        {isLocationSet && recommendations.length > 0 && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">
                🎯 Personalized Recommendations for {location?.district}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="text-sm text-green-700">
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                  {location && <p className="text-xs text-muted-foreground">{location.district}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                  {location && <p className="text-xs text-muted-foreground">Local data</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="text-lg font-semibold">{weatherData.condition}</p>
                  {location && <p className="text-xs text-muted-foreground">Live weather</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CloudRain className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                  <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
                  {location && <p className="text-xs text-muted-foreground">Today</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Card key={module.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  {module.tasks > 0 && <Badge variant="secondary">{module.tasks} tasks</Badge>}
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                  {!isLocationSet && (module.title.includes("Weather") || module.title.includes("Irrigation")) && (
                    <span className="text-orange-600 block mt-1">📍 Set location for local data</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full">
                  <Link href={module.href}>
                    Open Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
