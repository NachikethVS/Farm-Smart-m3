"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Droplets, Plus, Edit, Trash2, Play, Pause, CloudRain, Sun, Thermometer, Wind, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, Info, MoreVertical, Zap, Target, BarChart3, Lightbulb, Bell } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

// Mock data for crops with water requirements
const crops = [
  { id: "tomato", name: "Tomato", waterReq: 400, growthStage: "Flowering", season: "Kharif" },
  { id: "wheat", name: "Wheat", waterReq: 300, growthStage: "Grain Filling", season: "Rabi" },
  { id: "rice", name: "Rice", waterReq: 600, growthStage: "Tillering", season: "Kharif" },
  { id: "corn", name: "Corn", waterReq: 350, growthStage: "Vegetative", season: "Kharif" },
  { id: "cotton", name: "Cotton", waterReq: 450, growthStage: "Boll Formation", season: "Kharif" },
  { id: "sugarcane", name: "Sugarcane", waterReq: 800, growthStage: "Grand Growth", season: "Annual" },
  { id: "potato", name: "Potato", waterReq: 250, growthStage: "Tuber Initiation", season: "Rabi" },
  { id: "onion", name: "Onion", waterReq: 200, growthStage: "Bulb Development", season: "Rabi" },
  { id: "cabbage", name: "Cabbage", waterReq: 180, growthStage: "Head Formation", season: "Rabi" },
  { id: "carrot", name: "Carrot", waterReq: 160, growthStage: "Root Development", season: "Rabi" }
]

const soilTypes = [
  { id: "clay", name: "Clay", waterHolding: 0.45, infiltration: "Low", description: "High water retention, slow drainage" },
  { id: "loam", name: "Loam", waterHolding: 0.35, infiltration: "Medium", description: "Balanced water retention and drainage" },
  { id: "sandy", name: "Sandy", waterHolding: 0.15, infiltration: "High", description: "Low water retention, fast drainage" },
  { id: "silt", name: "Silt", waterHolding: 0.40, infiltration: "Medium", description: "Good water retention, moderate drainage" },
  { id: "sandy-loam", name: "Sandy Loam", waterHolding: 0.25, infiltration: "Medium-High", description: "Good drainage with moderate retention" },
  { id: "clay-loam", name: "Clay Loam", waterHolding: 0.38, infiltration: "Medium-Low", description: "High retention with slow drainage" }
]

const waterSources = [
  { id: "borewell", name: "Borewell", reliability: "High", cost: "Medium", quality: "Good", description: "Deep groundwater source" },
  { id: "canal", name: "Canal", reliability: "Medium", cost: "Low", quality: "Fair", description: "Government irrigation canal" },
  { id: "rainwater", name: "Rainwater Harvesting", reliability: "Variable", cost: "Low", quality: "Excellent", description: "Collected rainwater storage" },
  { id: "river", name: "River", reliability: "High", cost: "Low", quality: "Good", description: "Natural river water source" },
  { id: "pond", name: "Farm Pond", reliability: "Medium", cost: "Medium", quality: "Fair", description: "On-farm water storage" },
  { id: "tube-well", name: "Tube Well", reliability: "High", cost: "High", quality: "Excellent", description: "Shallow groundwater extraction" }
]

const irrigationMethods = [
  { id: "drip", name: "Drip Irrigation", efficiency: 90, cost: "High", suitability: "All crops", description: "Water-efficient point irrigation" },
  { id: "sprinkler", name: "Sprinkler", efficiency: 75, cost: "Medium", suitability: "Field crops", description: "Overhead spray irrigation" },
  { id: "flood", name: "Flood Irrigation", efficiency: 45, cost: "Low", suitability: "Rice, Wheat", description: "Traditional flooding method" },
  { id: "furrow", name: "Furrow Irrigation", efficiency: 60, cost: "Low", suitability: "Row crops", description: "Channel-based irrigation" },
  { id: "micro-sprinkler", name: "Micro Sprinkler", efficiency: 80, cost: "Medium", suitability: "Orchards", description: "Low-pressure spray system" },
  { id: "manual", name: "Manual Watering", efficiency: 50, cost: "Very Low", suitability: "Small plots", description: "Hand watering with tools" }
]

// Weather data for 7 days
const weatherData = [
  { day: "Today", date: "Jan 15", temp: 32, humidity: 65, rainfall: 0, wind: 12, icon: Sun, condition: "Sunny" },
  { day: "Tomorrow", date: "Jan 16", temp: 28, humidity: 78, rainfall: 15, wind: 8, icon: CloudRain, condition: "Rainy" },
  { day: "Day 3", date: "Jan 17", temp: 30, humidity: 70, rainfall: 5, wind: 10, icon: Sun, condition: "Partly Cloudy" },
  { day: "Day 4", date: "Jan 18", temp: 29, humidity: 75, rainfall: 20, wind: 15, icon: CloudRain, condition: "Heavy Rain" },
  { day: "Day 5", date: "Jan 19", temp: 31, humidity: 68, rainfall: 0, wind: 12, icon: Sun, condition: "Clear" },
  { day: "Day 6", date: "Jan 20", temp: 33, humidity: 60, rainfall: 0, wind: 14, icon: Sun, condition: "Hot" },
  { day: "Day 7", date: "Jan 21", temp: 27, humidity: 80, rainfall: 25, wind: 18, icon: CloudRain, condition: "Thunderstorm" }
]

// Water usage data for charts
const usageData = [
  { date: "Jan 1", planned: 120, actual: 115, rainfall: 0 },
  { date: "Jan 2", planned: 130, actual: 125, rainfall: 5 },
  { date: "Jan 3", planned: 110, actual: 105, rainfall: 15 },
  { date: "Jan 4", planned: 140, actual: 135, rainfall: 0 },
  { date: "Jan 5", planned: 125, actual: 130, rainfall: 8 },
  { date: "Jan 6", planned: 135, actual: 140, rainfall: 0 },
  { date: "Jan 7", planned: 115, actual: 110, rainfall: 12 },
  { date: "Jan 8", planned: 150, actual: 145, rainfall: 0 },
  { date: "Jan 9", planned: 120, actual: 118, rainfall: 20 },
  { date: "Jan 10", planned: 130, actual: 128, rainfall: 0 }
]

const efficiencyData = [
  { method: "Drip", efficiency: 90, usage: 450, color: "#10b981" },
  { method: "Sprinkler", efficiency: 75, usage: 600, color: "#3b82f6" },
  { method: "Flood", efficiency: 45, usage: 1000, color: "#f59e0b" },
  { method: "Furrow", efficiency: 60, usage: 750, color: "#8b5cf6" }
]

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function IrrigationPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [irrigationPlans, setIrrigationPlans] = useState([
    {
      id: 1,
      name: "Tomato Field A",
      crop: "tomato",
      area: 2.5,
      soilType: "loam",
      waterSource: "borewell",
      method: "drip",
      schedule: "daily",
      frequency: 2,
      duration: 30,
      isActive: true,
      isAuto: true,
      nextIrrigation: "2024-01-15T06:00:00",
      waterUsage: 125,
      efficiency: 90,
      soilMoisture: 65,
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Wheat Field B",
      crop: "wheat",
      area: 5.0,
      soilType: "clay",
      waterSource: "canal",
      method: "sprinkler",
      schedule: "weekly",
      frequency: 3,
      duration: 45,
      isActive: false,
      isAuto: false,
      nextIrrigation: "2024-01-16T07:00:00",
      waterUsage: 200,
      efficiency: 75,
      soilMoisture: 45,
      createdAt: "2024-01-08"
    },
    {
      id: 3,
      name: "Rice Field C",
      crop: "rice",
      area: 3.0,
      soilType: "clay",
      waterSource: "canal",
      method: "flood",
      schedule: "daily",
      frequency: 1,
      duration: 60,
      isActive: true,
      isAuto: true,
      nextIrrigation: "2024-01-15T05:30:00",
      waterUsage: 300,
      efficiency: 45,
      soilMoisture: 80,
      createdAt: "2024-01-12"
    }
  ])

  const [newPlan, setNewPlan] = useState({
    name: "",
    crop: "",
    area: "",
    soilType: "",
    waterSource: "",
    method: "",
    schedule: "daily",
    frequency: 1,
    duration: 30,
    isAuto: true
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Irrigation Due",
      message: "Tomato Field A irrigation scheduled in 2 hours",
      type: "reminder",
      time: "4:00 AM",
      priority: "high",
      planId: 1
    },
    {
      id: 2,
      title: "Weather Alert",
      message: "Heavy rain expected tomorrow - consider skipping irrigation",
      type: "weather",
      time: "6:00 PM",
      priority: "medium",
      planId: null
    },
    {
      id: 3,
      title: "Low Soil Moisture",
      message: "Wheat Field B soil moisture below optimal level",
      type: "alert",
      time: "8:00 AM",
      priority: "high",
      planId: 2
    },
    {
      id: 4,
      title: "Efficiency Report",
      message: "Drip irrigation showing 15% water savings this week",
      type: "info",
      time: "Yesterday",
      priority: "low",
      planId: 1
    }
  ])

  const calculateWaterUsage = (crop, area, method, frequency, duration, soilType) => {
    const cropData = crops.find((c) => c.id === crop)
    const methodData = irrigationMethods.find((m) => m.id === method)
    const soilData = soilTypes.find((s) => s.id === soilType)
    
    if (!cropData || !methodData || !soilData) return 0
    
    const baseUsage = cropData.waterReq * parseFloat(area) * frequency * (duration / 60)
    const efficiency = methodData.efficiency / 100
    const soilFactor = soilData.waterHolding
    
    return Math.round((baseUsage / efficiency) * (1 + soilFactor))
  }

  const getAISuggestions = () => {
    const suggestions = []
    
    // Weather-based suggestions
    const rainExpected = weatherData.slice(0, 3).some(day => day.rainfall > 10)
    if (rainExpected) {
      suggestions.push({
        type: "weather",
        priority: "high",
        title: "Skip Next Irrigation",
        message: "Heavy rain expected in next 2 days (15-25mm). Consider postponing scheduled irrigation to avoid waterlogging.",
        action: "Adjust Schedule",
        icon: CloudRain,
        color: "text-blue-600"
      })
    }

    const highTemp = weatherData[0].temp > 30
    if (highTemp) {
      suggestions.push({
        type: "temperature",
        priority: "medium",
        title: "Increase Irrigation Frequency",
        message: `High temperature detected (${weatherData[0].temp}°C). Consider increasing irrigation frequency by 20% for heat-sensitive crops.`,
        action: "Increase Frequency",
        icon: Thermometer,
        color: "text-orange-600"
      })
    }

    // Soil moisture based suggestions
    const lowMoisturePlans = irrigationPlans.filter(plan => plan.soilMoisture < 50)
    if (lowMoisturePlans.length > 0) {
      suggestions.push({
        type: "soil",
        priority: "high",
        title: "Low Soil Moisture Alert",
        message: `${lowMoisturePlans.length} field(s) showing low soil moisture. Immediate irrigation recommended.`,
        action: "Start Irrigation",
        icon: Droplets,
        color: "text-red-600"
      })
    }

    // Crop-specific suggestions
    const tomatoPlans = irrigationPlans.filter(plan => plan.crop === "tomato" && plan.isActive)
    if (tomatoPlans.length > 0) {
      suggestions.push({
        type: "crop",
        priority: "medium",
        title: "Tomato Flowering Stage",
        message: "Tomato crops are in flowering stage. Maintain consistent soil moisture (60-70%) for optimal fruit development.",
        action: "View Details",
        icon: Target,
        color: "text-green-600"
      })
    }

    // Efficiency suggestions
    const inefficientPlans = irrigationPlans.filter(plan => plan.efficiency < 60)
    if (inefficientPlans.length > 0) {
      suggestions.push({
        type: "efficiency",
        priority: "low",
        title: "Improve Water Efficiency",
        message: `Consider upgrading to drip irrigation for ${inefficientPlans.length} field(s) to save up to 40% water.`,
        action: "Upgrade Method",
        icon: TrendingUp,
        color: "text-purple-600"
      })
    }

    return suggestions
  }

  const aiSuggestions = getAISuggestions()

  const addOrUpdatePlan = () => {
    const waterUsage = calculateWaterUsage(
      newPlan.crop,
      newPlan.area,
      newPlan.method,
      newPlan.frequency,
      newPlan.duration,
      newPlan.soilType
    )

    const methodData = irrigationMethods.find(m => m.id === newPlan.method)
    
    const planData = {
      ...newPlan,
      area: parseFloat(newPlan.area),
      waterUsage,
      efficiency: methodData?.efficiency || 0,
      nextIrrigation: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      soilMoisture: Math.floor(Math.random() * 40) + 40, // Random soil moisture between 40-80%
      createdAt: new Date().toISOString().split('T')[0]
    }

    if (editingPlan) {
      setIrrigationPlans(plans =>
        plans.map(plan => plan.id === editingPlan.id ? { ...planData, id: editingPlan.id } : plan)
      )
    } else {
      setIrrigationPlans(plans => [...plans, { ...planData, id: Date.now() }])
    }

    // Reset form
    setNewPlan({
      name: "",
      crop: "",
      area: "",
      soilType: "",
      waterSource: "",
      method: "",
      schedule: "daily",
      frequency: 1,
      duration: 30,
      isAuto: true
    })
    setEditingPlan(null)
    setIsDialogOpen(false)
  }

  const deletePlan = (id) => {
    setIrrigationPlans(plans => plans.filter(plan => plan.id !== id))
    // Remove related notifications
    setNotifications(notifs => notifs.filter(notif => notif.planId !== id))
  }

  const togglePlan = (id) => {
    setIrrigationPlans(plans =>
      plans.map(plan => plan.id === id ? { ...plan, isActive: !plan.isActive } : plan)
    )
  }

  const editPlan = (plan) => {
    setNewPlan({
      name: plan.name,
      crop: plan.crop,
      area: plan.area.toString(),
      soilType: plan.soilType,
      waterSource: plan.waterSource,
      method: plan.method,
      schedule: plan.schedule,
      frequency: plan.frequency,
      duration: plan.duration,
      isAuto: plan.isAuto
    })
    setEditingPlan(plan)
    setIsDialogOpen(true)
  }

  const dismissNotification = (id) => {
    setNotifications(notifs => notifs.filter(notif => notif.id !== id))
  }

  // Calculate summary statistics
  const totalWaterUsage = irrigationPlans.reduce((sum, plan) => sum + (plan.isActive ? plan.waterUsage : 0), 0)
  const activePlans = irrigationPlans.filter(plan => plan.isActive).length
  const avgEfficiency = irrigationPlans.length > 0 
    ? Math.round(irrigationPlans.reduce((sum, plan) => sum + plan.efficiency, 0) / irrigationPlans.length)
    : 0
  const avgSoilMoisture = irrigationPlans.length > 0
    ? Math.round(irrigationPlans.reduce((sum, plan) => sum + plan.soilMoisture, 0) / irrigationPlans.length)
    : 0

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder": return Clock
      case "weather": return CloudRain
      case "alert": return AlertTriangle
      case "info": return Info
      default: return Bell
    }
  }

  const getNotificationColor = (priority) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50"
      case "medium": return "border-yellow-200 bg-yellow-50"
      case "low": return "border-blue-200 bg-blue-50"
      default: return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-600" />
            Irrigation Management
          </h1>
          <p className="text-muted-foreground mt-1">Smart water management for optimal crop growth</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Irrigation Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit" : "Create"} Irrigation Plan</DialogTitle>
              <DialogDescription>
                Set up a new irrigation schedule for your crops with AI-powered recommendations.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    placeholder="e.g., Tomato Field A"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Area (acres)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="2.5"
                    value={newPlan.area}
                    onChange={(e) => setNewPlan({ ...newPlan, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select value={newPlan.crop} onValueChange={(value) => setNewPlan({ ...newPlan, crop: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop.id} value={crop.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{crop.name}</span>
                            <div className="flex gap-1 ml-2">
                              <Badge variant="outline" className="text-xs">
                                {crop.waterReq}L/acre
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {crop.season}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Select value={newPlan.soilType} onValueChange={(value) => setNewPlan({ ...newPlan, soilType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((soil) => (
                        <SelectItem key={soil.id} value={soil.id}>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between w-full">
                              <span>{soil.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {soil.infiltration}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{soil.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Water Source</Label>
                  <Select value={newPlan.waterSource} onValueChange={(value) => setNewPlan({ ...newPlan, waterSource: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select water source" />
                    </SelectTrigger>
                    <SelectContent>
                      {waterSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between w-full">
                              <span>{source.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {source.reliability}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{source.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Method</Label>
                  <Select value={newPlan.method} onValueChange={(value) => setNewPlan({ ...newPlan, method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between w-full">
                              <span>{method.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {method.efficiency}% efficient
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{method.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Select value={newPlan.schedule} onValueChange={(value) => setNewPlan({ ...newPlan, schedule: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Frequency (times per {newPlan.schedule.slice(0, -2)})</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newPlan.frequency}
                    onChange={(e) => setNewPlan({ ...newPlan, frequency: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="180"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-mode"
                  checked={newPlan.isAuto}
                  onCheckedChange={(checked) => setNewPlan({ ...newPlan, isAuto: checked })}
                />
                <Label htmlFor="auto-mode">Enable automatic irrigation based on weather conditions and soil moisture</Label>
              </div>

              {newPlan.crop && newPlan.area && newPlan.method && newPlan.soilType && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Estimated Water Usage</AlertTitle>
                  <AlertDescription>
                    This plan will use approximately{" "}
                    <strong>
                      {calculateWaterUsage(newPlan.crop, newPlan.area, newPlan.method, newPlan.frequency, newPlan.duration, newPlan.soilType)} liters
                    </strong>{" "}
                    per {newPlan.schedule.slice(0, -2)} cycle.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addOrUpdatePlan} disabled={!newPlan.name || !newPlan.crop || !newPlan.area}>
                {editingPlan ? "Update" : "Create"} Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">{activePlans}</p>
                <p className="text-xs text-green-600">↑ {irrigationPlans.length - activePlans} paused</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Water Usage</p>
                <p className="text-2xl font-bold">{totalWaterUsage}L</p>
                <p className="text-xs text-blue-600">↓ 12% from last week</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold">{avgEfficiency}%</p>
                <p className="text-xs text-orange-600">↑ 8% improvement</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Soil Moisture</p>
                <p className="text-2xl font-bold">{avgSoilMoisture}%</p>
                <p className="text-xs text-green-600">Optimal range</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Notifications */}
          {notifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Notifications & Reminders
                  <Badge variant="secondary">{notifications.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 3).map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  return (
                    <Alert key={notification.id} className={getNotificationColor(notification.priority)}>
                      <IconComponent className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>{notification.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={notification.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                            {notification.priority}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                            ×
                          </Button>
                        </div>
                      </AlertTitle>
                      <AlertDescription className="flex items-center justify-between">
                        <span>{notification.message}</span>
                        <span className="text-xs text-muted-foreground ml-4">{notification.time}</span>
                      </AlertDescription>
                    </Alert>
                  )
                })}
                {notifications.length > 3 && (
                  <Button variant="outline" className="w-full">
                    View All {notifications.length} Notifications
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                AI Irrigation Recommendations
              </CardTitle>
              <CardDescription>Smart suggestions based on weather, soil moisture, and crop conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <Alert key={index} className={suggestion.priority === "high" ? "border-orange-200 bg-orange-50" : ""}>
                  <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
                  <AlertTitle className="flex items-center justify-between">
                    <span>{suggestion.title}</span>
                    <Badge variant={suggestion.priority === "high" ? "destructive" : "secondary"}>
                      {suggestion.priority}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                    <span>{suggestion.message}</span>
                    <Button variant="outline" size="sm" className="ml-4">
                      {suggestion.action}
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Irrigations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Irrigations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {irrigationPlans
                  .filter(plan => plan.isActive)
                  .sort((a, b) => new Date(a.nextIrrigation).getTime() - new Date(b.nextIrrigation).getTime())
                  .slice(0, 4)
                  .map((plan) => {
                    const cropData = crops.find(c => c.id === plan.crop)
                    return (
                      <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Droplets className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(plan.nextIrrigation).toLocaleString()} • {cropData?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{plan.duration} min</Badge>
                          <Badge variant="secondary">{plan.waterUsage}L</Badge>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Water Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Trends</CardTitle>
              <CardDescription>Planned vs actual water consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned (L)" />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual (L)" />
                  <Line type="monotone" dataKey="rainfall" stroke="#f59e0b" strokeWidth={2} name="Rainfall (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4">
            {irrigationPlans.map((plan) => {
              const cropData = crops.find(c => c.id === plan.crop)
              const methodData = irrigationMethods.find(m => m.id === plan.method)
              const soilData = soilTypes.find(s => s.id === plan.soilType)
              const sourceData = waterSources.find(w => w.id === plan.waterSource)
              
              return (
                <Card key={plan.id} className={`${plan.isActive ? "border-green-200" : "border-gray-200"}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <Badge variant={plan.isActive ? "default" : "secondary"}>
                            {plan.isActive ? "Active" : "Paused"}
                          </Badge>
                          {plan.isAuto && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Auto
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Crop</p>
                            <p className="font-medium">{cropData?.name}</p>
                            <p className="text-xs text-muted-foreground">{cropData?.growthStage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Area & Soil</p>
                            <p className="font-medium">{plan.area} acres</p>
                            <p className="text-xs text-muted-foreground">{soilData?.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Method</p>
                            <p className="font-medium">{methodData?.name}</p>
                            <p className="text-xs text-muted-foreground">{sourceData?.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Usage</p>
                            <p className="font-medium">{plan.waterUsage}L/{plan.schedule.slice(0, -2)}</p>
                            <p className="text-xs text-muted-foreground">{plan.frequency}x {plan.duration}min</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Next: {new Date(plan.nextIrrigation).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.efficiency}% efficient</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span>Soil: {plan.soilMoisture}%</span>
                            <Progress value={plan.soilMoisture} className="w-16 h-2 ml-1" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={plan.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => togglePlan(plan.id)}
                        >
                          {plan.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editPlan(plan)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="h-4 w-4 mr-2" />
                              Set Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deletePlan(plan.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Plan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Method Efficiency Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Method Efficiency Comparison</CardTitle>
                <CardDescription>Water usage and efficiency by irrigation method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Water Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Water Usage Distribution</CardTitle>
                <CardDescription>Water consumption by irrigation method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={efficiencyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, usage }) => `${method}: ${usage}L`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usage"
                    >
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monthly irrigation performance and savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">2,450L</p>
                  <p className="text-sm text-gray-600">Water Saved This Month</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₹3,200</p>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">15%</p>
                  <p className="text-sm text-gray-600">Yield Improvement</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">87%</p>
                  <p className="text-sm text-gray-600">Overall Efficiency</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Water Conservation Goal</span>
                    <span className="font-medium">1,850L / 2,500L</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Automation Adoption</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Soil Moisture Optimization</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weather Tab */}
        <TabsContent value="weather" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5" />
                7-Day Weather Forecast
              </CardTitle>
              <CardDescription>Weather conditions affecting irrigation decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {weatherData.map((day, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4">
                      <p className="font-medium text-sm mb-1">{day.day}</p>
                      <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                      <day.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-lg font-bold mb-1">{day.temp}°C</p>
                      <p className="text-xs text-muted-foreground mb-2">{day.condition}</p>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Droplets className="h-3 w-3" />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <CloudRain className="h-3 w-3" />
                          <span>{day.rainfall}mm</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Wind className="h-3 w-3" />
                          <span>{day.wind}km/h</span>
                        </div>
                      </div>
                      
                      {day.rainfall > 10 && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Skip Irrigation
                        </Badge>
                      )}
                      {day.temp > 32 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Extra Water
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather-based Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Weather-Based Irrigation Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CloudRain className="h-4 w-4" />
                <AlertTitle>Heavy Rain Expected</AlertTitle>
                <AlertDescription>
                  15-25mm rainfall expected on Day 2 and Day 4. Consider postponing scheduled irrigation for Tomato Field A and Rice Field C to avoid waterlogging.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Thermometer className="h-4 w-4" />
                <AlertTitle>High Temperature Alert</AlertTitle>
                <AlertDescription>
                  Temperature will reach 33°C on Day 6. Increase irrigation frequency by 20% for heat-sensitive crops like tomatoes and increase duration by 10 minutes.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Wind className="h-4 w-4" />
                <AlertTitle>Windy Conditions</AlertTitle>
                <AlertDescription>
                  High wind speeds (18km/h) expected on Day 7. Avoid sprinkler irrigation during peak hours (10 AM - 4 PM) to reduce water loss due to evaporation.
                </AlertDescription>
              </Alert>

              <Alert>
                <Sun className="h-4 w-4" />
                <AlertTitle>Optimal Irrigation Window</AlertTitle>
                <AlertDescription>
                  Clear weather on Day 5 and Day 6 provides perfect conditions for drip irrigation. Schedule maintenance and system checks during this period.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Weather Impact on Crops */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Your Crops</CardTitle>
              <CardDescription>How current weather affects your active irrigation plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {irrigationPlans.filter(plan => plan.isActive).map(plan => {
                  const cropData = crops.find(c => c.id === plan.crop)
                  return (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <Badge variant="outline">{cropData?.name}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Current soil moisture: {plan.soilMoisture}% (Optimal for {cropData?.growthStage} stage)</p>
                        <p>• Rain expected tomorrow: Skip next irrigation cycle</p>
                        <p>• High temperature on Day 6: Increase frequency to 3x daily</p>
                        <p>• Wind advisory Day 7: Switch to drip irrigation if using sprinkler</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
