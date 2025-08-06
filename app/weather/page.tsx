"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CloudRain, Sun, Cloud, Thermometer, Droplets, Wind, Eye, Calendar, AlertTriangle, CheckCircle, Loader2, MapPin, Sunrise, Sunset, Gauge } from 'lucide-react'
import { useLocation } from "@/components/location-context"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: number
    visibility: number
    uvIndex: number
    pressure: number
    condition: string
    description: string
    icon: string
    sunrise: string
    sunset: string
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    description: string
    icon: string
    precipitation: number
    humidity: number
    windSpeed: number
  }>
  alerts: Array<{
    type: "warning" | "info"
    title: string
    description: string
    action: string
    priority: "high" | "medium" | "low"
  }>
}

interface ScheduledTask {
  task: string
  scheduledFor: string
  weatherImpact: "optimal" | "good" | "poor" | "critical"
  recommendation: string
  priority: "high" | "medium" | "low"
}

const getWeatherIcon = (iconCode: string) => {
  const iconMap: { [key: string]: any } = {
    "01d": Sun,
    "01n": Sun,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Cloud,
    "03n": Cloud,
    "04d": Cloud,
    "04n": Cloud,
    "09d": CloudRain,
    "09n": CloudRain,
    "10d": CloudRain,
    "10n": CloudRain,
    "11d": CloudRain,
    "11n": CloudRain,
    "13d": Cloud,
    "13n": Cloud,
    "50d": Cloud,
    "50n": Cloud,
  }
  return iconMap[iconCode] || Cloud
}

const generateWeatherAlerts = (current: any, forecast: any[]): WeatherData['alerts'] => {
  const alerts: WeatherData['alerts'] = []

  // Check for heavy rain in forecast
  const heavyRainDays = forecast.filter(day => day.precipitation > 70)
  if (heavyRainDays.length > 0) {
    alerts.push({
      type: "warning",
      title: "Heavy Rain Expected",
      description: `Heavy rainfall expected in the next ${heavyRainDays.length} days. Consider postponing fertilizer application and harvesting.`,
      action: "Reschedule Tasks",
      priority: "high"
    })
  }

  // Check for optimal planting conditions
  const optimalDays = forecast.filter(day => 
    day.precipitation < 20 && 
    day.high < 32 && 
    day.high > 20
  )
  if (optimalDays.length >= 3) {
    alerts.push({
      type: "info",
      title: "Optimal Farming Window",
      description: `Perfect conditions for outdoor farming activities in the coming days with moderate temperatures and low rainfall.`,
      action: "Plan Activities",
      priority: "medium"
    })
  }

  // High temperature warning
  if (current.temperature > 35) {
    alerts.push({
      type: "warning",
      title: "High Temperature Alert",
      description: "Extreme heat conditions. Increase irrigation frequency and provide shade for sensitive crops.",
      action: "Adjust Irrigation",
      priority: "high"
    })
  }

  // Low humidity warning
  if (current.humidity < 30) {
    alerts.push({
      type: "warning",
      title: "Low Humidity Alert",
      description: "Very dry conditions detected. Monitor crops closely and increase watering frequency.",
      action: "Increase Watering",
      priority: "medium"
    })
  }

  return alerts
}

const generateScheduledTasks = (weather: WeatherData, location: any): ScheduledTask[] => {
  const tasks: ScheduledTask[] = [
    {
      task: "Water vegetable crops",
      scheduledFor: "Today 6:00 AM",
      weatherImpact: weather.current.temperature > 30 ? "optimal" : "good",
      recommendation: weather.current.temperature > 30 
        ? "Perfect timing - high temperature requires early morning watering"
        : "Good conditions for watering",
      priority: "high"
    },
    {
      task: "Apply fertilizer to main field",
      scheduledFor: "Tomorrow 8:00 AM",
      weatherImpact: weather.forecast[0]?.precipitation > 50 ? "poor" : "optimal",
      recommendation: weather.forecast[0]?.precipitation > 50
        ? "Postpone due to expected rain - fertilizer may wash away"
        : "Ideal conditions for fertilizer application",
      priority: "medium"
    },
    {
      task: "Spray pesticide on crops",
      scheduledFor: "Day after tomorrow 10:00 AM",
      weatherImpact: weather.forecast[1]?.windSpeed > 15 || weather.forecast[1]?.precipitation > 30 ? "poor" : "good",
      recommendation: weather.forecast[1]?.windSpeed > 15
        ? "Reschedule - high winds may cause spray drift"
        : weather.forecast[1]?.precipitation > 30
        ? "Reschedule - rain expected which will wash away pesticide"
        : "Good conditions for pesticide application",
      priority: "medium"
    },
    {
      task: "Harvest ready crops",
      scheduledFor: "This weekend",
      weatherImpact: weather.forecast.slice(0, 2).some(day => day.precipitation > 60) ? "critical" : "optimal",
      recommendation: weather.forecast.slice(0, 2).some(day => day.precipitation > 60)
        ? "Harvest immediately before rain to prevent crop damage"
        : "Perfect weather window for harvesting",
      priority: "high"
    }
  ]

  return tasks
}

export default function WeatherScheduler() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { location } = useLocation()
  const { toast } = useToast()

  const fetchWeatherData = async () => {
    if (!location) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      const coordinates = getLocationCoordinates(location.district, location.state)
      
      // Use our server-side API route instead of direct API calls
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&type=current`),
        fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&type=forecast`)
      ])

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error("Weather API request failed")
      }

      const currentData = await currentResponse.json()
      const forecastData = await forecastResponse.json()

      // Check if we got error responses
      if (currentData.error || forecastData.error) {
        throw new Error("Weather API returned error")
      }

      // Process the data
      const processedWeather: WeatherData = {
        current: {
          temperature: Math.round(currentData.main?.temp || 28),
          feelsLike: Math.round(currentData.main?.feels_like || 31),
          humidity: currentData.main?.humidity || 65,
          windSpeed: Math.round((currentData.wind?.speed || 3.5) * 3.6), // Convert m/s to km/h
          windDirection: currentData.wind?.deg || 0,
          visibility: Math.round((currentData.visibility || 10000) / 1000), // Convert to km
          uvIndex: 6, // UV index not available in free tier
          pressure: currentData.main?.pressure || 1013,
          condition: currentData.weather?.[0]?.main || "Partly Cloudy",
          description: currentData.weather?.[0]?.description || "partly cloudy",
          icon: currentData.weather?.[0]?.icon || "02d",
          sunrise: currentData.sys?.sunrise 
            ? new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : "06:30 AM",
          sunset: currentData.sys?.sunset
            ? new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : "06:45 PM"
        },
        forecast: processForecastData(forecastData.list || []),
        alerts: []
      }

      // Generate alerts based on weather data
      processedWeather.alerts = generateWeatherAlerts(processedWeather.current, processedWeather.forecast)

      setWeatherData(processedWeather)
      setScheduledTasks(generateScheduledTasks(processedWeather, location))

      toast({
        title: "Weather Updated",
        description: "Latest weather data loaded successfully.",
      })

    } catch (error) {
      console.error("Weather fetch error:", error)
      
      // Fallback to mock data
      const mockWeather = generateMockWeatherData(location)
      setWeatherData(mockWeather)
      setScheduledTasks(generateScheduledTasks(mockWeather, location))
      
      toast({
        title: "Using Demo Weather Data",
        description: "Unable to fetch live weather. Showing sample data for demonstration.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processForecastData = (forecastList: any[]) => {
    if (!forecastList || forecastList.length === 0) {
      // Return mock forecast data if no data available
      return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(28 + Math.random() * 6 - 3),
        low: Math.round(20 + Math.random() * 4),
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        description: "sample weather",
        icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)],
        precipitation: Math.round(Math.random() * 100),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 15)
      }))
    }

    // Group by day and take one forecast per day (noon forecast)
    const dailyForecasts: { [key: string]: any } = {}
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()
      const hour = date.getHours()
      
      // Take the forecast closest to noon (12:00)
      if (!dailyForecasts[dateKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dateKey].hour - 12)) {
        dailyForecasts[dateKey] = {
          ...item,
          hour
        }
      }
    })

    return Object.values(dailyForecasts).slice(0, 7).map((item: any, index) => {
      const date = new Date(item.dt * 1000)
      return {
        date: date.toISOString().split('T')[0],
        day: index === 0 ? "Today" : index === 1 ? "Tomorrow" : date.toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(item.main?.temp_max || 30),
        low: Math.round(item.main?.temp_min || 22),
        condition: item.weather?.[0]?.main || "Clear",
        description: item.weather?.[0]?.description || "clear sky",
        icon: item.weather?.[0]?.icon || "01d",
        precipitation: Math.round((item.pop || 0) * 100),
        humidity: item.main?.humidity || 60,
        windSpeed: Math.round((item.wind?.speed || 3) * 3.6)
      }
    })
  }

  const getLocationCoordinates = (district: string, state: string) => {
    // Comprehensive coordinates for Indian cities/districts
    const coordinates: { [key: string]: { lat: number; lon: number } } = {
      // Punjab
      "Ludhiana, Punjab": { lat: 30.9010, lon: 75.8573 },
      "Amritsar, Punjab": { lat: 31.6340, lon: 74.8723 },
      "Jalandhar, Punjab": { lat: 31.3260, lon: 75.5762 },
      "Patiala, Punjab": { lat: 30.3398, lon: 76.3869 },
      
      // Maharashtra
      "Mumbai, Maharashtra": { lat: 19.0760, lon: 72.8777 },
      "Pune, Maharashtra": { lat: 18.5204, lon: 73.8567 },
      "Nagpur, Maharashtra": { lat: 21.1458, lon: 79.0882 },
      "Nashik, Maharashtra": { lat: 19.9975, lon: 73.7898 },
      "Aurangabad, Maharashtra": { lat: 19.8762, lon: 75.3433 },
      
      // Uttar Pradesh
      "Lucknow, Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
      "Kanpur, Uttar Pradesh": { lat: 26.4499, lon: 80.3319 },
      "Agra, Uttar Pradesh": { lat: 27.1767, lon: 78.0081 },
      "Varanasi, Uttar Pradesh": { lat: 25.3176, lon: 82.9739 },
      "Meerut, Uttar Pradesh": { lat: 28.9845, lon: 77.7064 },
      
      // Gujarat
      "Ahmedabad, Gujarat": { lat: 23.0225, lon: 72.5714 },
      "Surat, Gujarat": { lat: 21.1702, lon: 72.8311 },
      "Vadodara, Gujarat": { lat: 22.3072, lon: 73.1812 },
      "Rajkot, Gujarat": { lat: 22.3039, lon: 70.8022 },
      
      // Haryana
      "Gurgaon, Haryana": { lat: 28.4595, lon: 77.0266 },
      "Faridabad, Haryana": { lat: 28.4089, lon: 77.3178 },
      "Panipat, Haryana": { lat: 29.3909, lon: 76.9635 },
      "Ambala, Haryana": { lat: 30.3782, lon: 76.7767 },
      
      // Karnataka
      "Bangalore, Karnataka": { lat: 12.9716, lon: 77.5946 },
      "Mysore, Karnataka": { lat: 12.2958, lon: 76.6394 },
      "Hubli, Karnataka": { lat: 15.3647, lon: 75.1240 },
      "Mangalore, Karnataka": { lat: 12.9141, lon: 74.8560 },
      
      // Tamil Nadu
      "Chennai, Tamil Nadu": { lat: 13.0827, lon: 80.2707 },
      "Coimbatore, Tamil Nadu": { lat: 11.0168, lon: 76.9558 },
      "Madurai, Tamil Nadu": { lat: 9.9252, lon: 78.1198 },
      "Salem, Tamil Nadu": { lat: 11.6643, lon: 78.1460 },
      
      // Andhra Pradesh
      "Hyderabad, Andhra Pradesh": { lat: 17.3850, lon: 78.4867 },
      "Visakhapatnam, Andhra Pradesh": { lat: 17.6868, lon: 83.2185 },
      "Vijayawada, Andhra Pradesh": { lat: 16.5062, lon: 80.6480 },
      "Guntur, Andhra Pradesh": { lat: 16.3067, lon: 80.4365 },
      
      // Other major cities
      "Delhi, Delhi": { lat: 28.6139, lon: 77.2090 },
      "Kolkata, West Bengal": { lat: 22.5726, lon: 88.3639 },
      "Jaipur, Rajasthan": { lat: 26.9124, lon: 75.7873 },
      "Bhopal, Madhya Pradesh": { lat: 23.2599, lon: 77.4126 }
    }
    
    const key = `${district}, ${state}`
    return coordinates[key] || { lat: 28.6139, lon: 77.2090 } // Default to Delhi
  }

  const generateMockWeatherData = (location: any): WeatherData => {
    const baseTemp = 28
    const tempVariation = Math.random() * 10 - 5
    
    return {
      current: {
        temperature: Math.round(baseTemp + tempVariation),
        feelsLike: Math.round(baseTemp + tempVariation + 3),
        humidity: Math.round(60 + Math.random() * 20),
        windSpeed: Math.round(8 + Math.random() * 10),
        windDirection: Math.round(Math.random() * 360),
        visibility: 10,
        uvIndex: 6,
        pressure: 1013,
        condition: "Partly Cloudy",
        description: "partly cloudy",
        icon: "02d",
        sunrise: "06:30 AM",
        sunset: "06:45 PM"
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(baseTemp + tempVariation + Math.random() * 6 - 3),
        low: Math.round(baseTemp + tempVariation - 8 + Math.random() * 4),
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        description: "sample weather",
        icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)],
        precipitation: Math.round(Math.random() * 100),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 15)
      })),
      alerts: [
        {
          type: "info",
          title: "Demo Weather Data",
          description: "This is sample weather data for demonstration purposes. Set up OpenWeather API key for live data.",
          action: "View Details",
          priority: "low"
        }
      ]
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [location])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Location Required</h3>
              <p className="text-muted-foreground mb-4">
                Please set your farm location to get personalized weather forecasts and farming recommendations.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Set Location
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold mb-2">Weather Data Unavailable</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load weather data for your location. Please try again later.
              </p>
              <Button onClick={fetchWeatherData}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Weather Scheduler 🌦️</h1>
          <p className="text-muted-foreground">
            Real-time weather data and farming task optimization for {location.district}, {location.state}
          </p>
        </div>

        {/* Current Weather */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(getWeatherIcon(weatherData.current.icon), { 
                className: "mr-2 h-5 w-5 text-yellow-500" 
              })}
              Current Weather - {location.district}
            </CardTitle>
            <CardDescription>
              {weatherData.current.description} • Last updated: {new Date().toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{weatherData.current.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Temperature</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{weatherData.current.feelsLike}°C</p>
                <p className="text-sm text-muted-foreground">Feels Like</p>
              </div>
              <div className="text-center">
                <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center">
                <Wind className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                <p className="text-2xl font-bold">{weatherData.current.windSpeed}</p>
                <p className="text-sm text-muted-foreground">km/h</p>
              </div>
              <div className="text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{weatherData.current.visibility}</p>
                <p className="text-sm text-muted-foreground">km</p>
              </div>
              <div className="text-center">
                <Gauge className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <p className="text-2xl font-bold">{weatherData.current.pressure}</p>
                <p className="text-sm text-muted-foreground">hPa</p>
              </div>
              <div className="text-center">
                <Sunrise className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-lg font-bold">{weatherData.current.sunrise}</p>
                <p className="text-sm text-muted-foreground">Sunrise</p>
              </div>
              <div className="text-center">
                <Sunset className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="text-lg font-bold">{weatherData.current.sunset}</p>
                <p className="text-sm text-muted-foreground">Sunset</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                Weather Alerts
              </CardTitle>
              <CardDescription>Important weather updates affecting your farming schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === "high" 
                        ? "border-red-500 bg-red-50" 
                        : alert.priority === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                7-Day Forecast
              </CardTitle>
              <CardDescription>Extended weather outlook for planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherData.forecast.map((day, index) => {
                  const IconComponent = getWeatherIcon(day.icon)
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDay === index ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-semibold">{day.day}</p>
                          <p className="text-sm text-muted-foreground capitalize">{day.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {day.high}° / {day.low}°
                        </p>
                        <p className="text-sm text-blue-500">{day.precipitation}% rain</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Weather-Optimized Schedule</CardTitle>
              <CardDescription>Your farming tasks adjusted for weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledTasks.map((task, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{task.task}</h4>
                      <Badge 
                        variant={
                          task.weatherImpact === "optimal" ? "default" : 
                          task.weatherImpact === "good" ? "secondary" :
                          task.weatherImpact === "poor" ? "destructive" : "destructive"
                        } 
                        className="text-xs"
                      >
                        {task.weatherImpact === "optimal" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : task.weatherImpact === "good" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : task.weatherImpact === "poor" ? (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {task.weatherImpact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.scheduledFor}</p>
                    <p className="text-sm">{task.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
