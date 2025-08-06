"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Sprout, Clock, CheckCircle, AlertCircle, X, Bot, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const cropCategories = {
  "cereals-millets": {
    name: "🌾 Cereals & Millets",
    crops: {
      rice: {
        name: "Rice",
        varieties: ["Basmati", "Jasmine", "IR64", "Pusa Basmati", "Sona Masuri", "Ponni"],
        season: "Kharif",
        growthPeriod: 120,
        icon: "🌾"
      },
      wheat: {
        name: "Wheat",
        varieties: ["HD-2967", "PBW-343", "WH-147", "Lok-1", "Sharbati", "Durum"],
        season: "Rabi",
        growthPeriod: 120,
        icon: "🌾"
      },
      maize: {
        name: "Maize (Corn)",
        varieties: ["Sweet Corn", "Dent Corn", "Flint Corn", "Popcorn", "Waxy Corn"],
        season: "Kharif/Zaid",
        growthPeriod: 100,
        icon: "🌽"
      },
      barley: {
        name: "Barley",
        varieties: ["Six-row", "Two-row", "Hulless", "Malting", "Feed"],
        season: "Rabi",
        growthPeriod: 110,
        icon: "🌾"
      },
      sorghum: {
        name: "Sorghum (Jowar)",
        varieties: ["Grain Sorghum", "Sweet Sorghum", "Forage Sorghum", "Broomcorn"],
        season: "Kharif",
        growthPeriod: 110,
        icon: "🌾"
      },
      pearl_millet: {
        name: "Pearl Millet (Bajra)",
        varieties: ["HHB-67", "Pusa-23", "RHB-121", "ICMH-356"],
        season: "Kharif",
        growthPeriod: 75,
        icon: "🌾"
      },
      finger_millet: {
        name: "Finger Millet (Ragi)",
        varieties: ["PR-202", "VL-149", "GPU-28", "KMR-204"],
        season: "Kharif",
        growthPeriod: 120,
        icon: "🌾"
      },
      foxtail_millet: {
        name: "Foxtail Millet",
        varieties: ["SiA-326", "Prasad", "Lepakshi", "Suryanandi"],
        season: "Kharif",
        growthPeriod: 70,
        icon: "🌾"
      },
      oats: {
        name: "Oats",
        varieties: ["Kent", "OS-6", "Sabzar", "SKO-17"],
        season: "Rabi",
        growthPeriod: 100,
        icon: "🌾"
      }
    }
  },
  "pulses-legumes": {
    name: "🌱 Pulses & Legumes",
    crops: {
      chickpea: {
        name: "Chickpea (Gram)",
        varieties: ["Kabuli", "Desi", "JG-11", "Pusa-256", "BG-372"],
        season: "Rabi",
        growthPeriod: 100,
        icon: "🫛"
      },
      green_gram: {
        name: "Green Gram (Moong)",
        varieties: ["Pusa Vishal", "SML-668", "TM-96-2", "Pusa-9531"],
        season: "Kharif/Zaid",
        growthPeriod: 60,
        icon: "🫛"
      },
      black_gram: {
        name: "Black Gram (Urad)",
        varieties: ["T-9", "Pusa-1", "Sarala", "PU-35"],
        season: "Kharif/Rabi",
        growthPeriod: 75,
        icon: "🫛"
      },
      pigeon_pea: {
        name: "Pigeon Pea (Arhar/Toor)",
        varieties: ["UPAS-120", "Pusa-992", "Maruti", "Bahar"],
        season: "Kharif",
        growthPeriod: 150,
        icon: "🫛"
      },
      lentil: {
        name: "Lentil (Masur)",
        varieties: ["L-4076", "PL-77", "Pusa-4", "DPL-15"],
        season: "Rabi",
        growthPeriod: 110,
        icon: "🫛"
      },
      pea: {
        name: "Pea",
        varieties: ["Arkel", "Azad P-1", "Pusa Prabhat", "VRP-6"],
        season: "Rabi",
        growthPeriod: 90,
        icon: "🫛"
      },
      cowpea: {
        name: "Cowpea",
        varieties: ["Pusa Komal", "RC-19", "Pusa-578", "V-16"],
        season: "Kharif",
        growthPeriod: 75,
        icon: "🫛"
      }
    }
  },
  "vegetables": {
    name: "🥦 Vegetables",
    crops: {
      potato: {
        name: "Potato",
        varieties: ["Kufri Jyoti", "Kufri Pukhraj", "Kufri Badshah", "Kufri Chipsona"],
        season: "Rabi",
        growthPeriod: 90,
        icon: "🥔"
      },
      onion: {
        name: "Onion",
        varieties: ["Pusa Red", "Nasik Red", "Bangalore Rose", "Agrifound Light Red"],
        season: "Rabi",
        growthPeriod: 120,
        icon: "🧅"
      },
      tomato: {
        name: "Tomato",
        varieties: ["Pusa Ruby", "Roma", "Cherry", "Beefsteak", "Arka Vikas"],
        season: "Kharif/Rabi",
        growthPeriod: 90,
        icon: "🍅"
      },
      cabbage: {
        name: "Cabbage",
        varieties: ["Golden Acre", "Pride of India", "Pusa Mukta", "Copenhagen Market"],
        season: "Rabi",
        growthPeriod: 90,
        icon: "🥬"
      },
      cauliflower: {
        name: "Cauliflower",
        varieties: ["Pusa Snowball", "Early Kunwari", "Pusa Kartik Sankar", "Improved Japanese"],
        season: "Rabi",
        growthPeriod: 80,
        icon: "🥦"
      },
      carrot: {
        name: "Carrot",
        varieties: ["Pusa Kesar", "Nantes", "Kuroda", "Red Cored Chantenay"],
        season: "Rabi",
        growthPeriod: 100,
        icon: "🥕"
      },
      spinach: {
        name: "Spinach",
        varieties: ["Pusa Jyoti", "All Green", "Pusa Harit", "Long Standing"],
        season: "Rabi",
        growthPeriod: 45,
        icon: "🥬"
      },
      brinjal: {
        name: "Brinjal (Eggplant)",
        varieties: ["Pusa Purple Long", "Pusa Kranti", "Arka Shirish", "Hisar Shyamal"],
        season: "Kharif/Rabi",
        growthPeriod: 120,
        icon: "🍆"
      },
      okra: {
        name: "Okra (Ladyfinger)",
        varieties: ["Pusa Sawani", "Arka Anamika", "Parbhani Kranti", "Punjab-7"],
        season: "Kharif",
        growthPeriod: 60,
        icon: "🌶️"
      },
      cucumber: {
        name: "Cucumber",
        varieties: ["Pusa Sanyog", "Japanese Long Green", "Poinsett", "Straight Eight"],
        season: "Kharif/Zaid",
        growthPeriod: 55,
        icon: "🥒"
      }
    }
  },
  "fruits": {
    name: "🍎 Fruits",
    crops: {
      mango: {
        name: "Mango",
        varieties: ["Alphonso", "Dasheri", "Langra", "Chausa", "Kesar", "Totapuri"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🥭"
      },
      banana: {
        name: "Banana",
        varieties: ["Dwarf Cavendish", "Robusta", "Poovan", "Nendran", "Red Banana"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍌"
      },
      apple: {
        name: "Apple",
        varieties: ["Red Delicious", "Golden Delicious", "Granny Smith", "Royal Delicious"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍎"
      },
      papaya: {
        name: "Papaya",
        varieties: ["Pusa Dwarf", "Coorg Honey Dew", "Washington", "Solo"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🫐"
      },
      guava: {
        name: "Guava",
        varieties: ["Lucknow-49", "Sardar", "Apple Guava", "Allahabad Safeda"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍐"
      },
      pomegranate: {
        name: "Pomegranate",
        varieties: ["Ganesh", "Arakta", "Ruby", "Mridula"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍎"
      },
      grapes: {
        name: "Grapes",
        varieties: ["Thompson Seedless", "Bangalore Blue", "Anab-e-Shahi", "Perlette"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍇"
      },
      watermelon: {
        name: "Watermelon",
        varieties: ["Sugar Baby", "Charleston Gray", "Crimson Sweet", "Black Diamond"],
        season: "Zaid",
        growthPeriod: 90,
        icon: "🍉"
      },
      muskmelon: {
        name: "Muskmelon",
        varieties: ["Hara Madhu", "Pusa Sharbati", "Arka Jeet", "Durgapura Madhu"],
        season: "Zaid",
        growthPeriod: 90,
        icon: "🍈"
      },
      pineapple: {
        name: "Pineapple",
        varieties: ["Queen", "Kew", "Red Spanish", "Smooth Cayenne"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🍍"
      }
    }
  },
  "cash-industrial": {
    name: "🧪 Cash & Industrial Crops",
    crops: {
      sugarcane: {
        name: "Sugarcane",
        varieties: ["Co-86032", "Co-0238", "Co-62175", "CoS-767"],
        season: "Annual",
        growthPeriod: 365,
        icon: "🎋"
      },
      cotton: {
        name: "Cotton",
        varieties: ["Bt Cotton", "Desi Cotton", "American Cotton", "Egyptian Cotton"],
        season: "Kharif",
        growthPeriod: 180,
        icon: "🌿"
      },
      groundnut: {
        name: "Groundnut",
        varieties: ["TMV-2", "JL-24", "TAG-24", "ICGS-76"],
        season: "Kharif/Rabi",
        growthPeriod: 120,
        icon: "🥜"
      },
      mustard: {
        name: "Mustard",
        varieties: ["Varuna", "Kranti", "Pusa Bold", "RH-30"],
        season: "Rabi",
        growthPeriod: 120,
        icon: "🌻"
      },
      soybean: {
        name: "Soybean",
        varieties: ["JS-335", "MACS-450", "PK-416", "Bragg"],
        season: "Kharif",
        growthPeriod: 100,
        icon: "🫘"
      },
      sunflower: {
        name: "Sunflower",
        varieties: ["MSFH-17", "Surya", "Modern", "PAC-36"],
        season: "Kharif/Rabi",
        growthPeriod: 90,
        icon: "🌻"
      },
      sesame: {
        name: "Sesame",
        varieties: ["RT-1", "Pragati", "Rama", "Krishna"],
        season: "Kharif",
        growthPeriod: 90,
        icon: "🌰"
      },
      castor: {
        name: "Castor",
        varieties: ["Aruna", "Kiran", "DCS-9", "GCH-4"],
        season: "Kharif",
        growthPeriod: 150,
        icon: "🌰"
      },
      tobacco: {
        name: "Tobacco",
        varieties: ["Virginia", "Burley", "Oriental", "Rustica"],
        season: "Rabi",
        growthPeriod: 120,
        icon: "🍃"
      },
      jute: {
        name: "Jute",
        varieties: ["JRO-524", "JRO-878", "Capsularis", "Olitorius"],
        season: "Kharif",
        growthPeriod: 120,
        icon: "🌿"
      },
      areca_nut: {
        name: "Areca Nut",
        varieties: ["Mangala", "Mohitnagar", "Sreevardhan", "Local"],
        season: "Perennial",
        growthPeriod: 365,
        icon: "🥥"
      }
    }
  }
}

export default function CropPlanner() {
  const [cropPlans, setCropPlans] = useState([
    {
      id: 1,
      crop: "Rice",
      variety: "Basmati",
      category: "cereals-millets",
      plantingDate: "2024-03-15",
      harvestDate: "2024-07-15",
      area: "2.5",
      location: "Punjab, India",
      status: "active",
      progress: 65,
      season: "Kharif",
      tasks: [
        { task: "Monitor water level in field", due: "Today", priority: "high", completed: false },
        { task: "Apply nitrogen fertilizer", due: "Tomorrow", priority: "medium", completed: false },
        { task: "Check for brown plant hopper", due: "In 3 days", priority: "high", completed: true },
        { task: "Weed management in field", due: "Day 21", priority: "medium", completed: false },
        { task: "Top dressing fertilizer application", due: "Day 35", priority: "medium", completed: false },
        { task: "Pest monitoring and control", due: "Day 45", priority: "high", completed: false },
        { task: "Disease surveillance", due: "Day 60", priority: "medium", completed: false },
        { task: "Grain filling stage care", due: "Day 90", priority: "high", completed: false },
        { task: "Harvest preparation", due: "Day 110", priority: "high", completed: false },
        { task: "Post-harvest processing", due: "Day 115", priority: "medium", completed: false },
      ],
    },
    {
      id: 2,
      crop: "Wheat",
      variety: "HD-2967",
      category: "cereals-millets",
      plantingDate: "2024-02-01",
      harvestDate: "2024-06-01",
      area: "5.0",
      location: "Haryana, India",
      status: "active",
      progress: 45,
      season: "Rabi",
      tasks: [
        { task: "Check for rust disease", due: "Today", priority: "high", completed: true },
        { task: "Soil moisture testing", due: "In 2 days", priority: "medium", completed: false },
        { task: "Apply phosphorus fertilizer", due: "Day 20", priority: "medium", completed: false },
        { task: "Weed control measures", due: "Day 25", priority: "medium", completed: false },
        { task: "Flowering stage monitoring", due: "Day 45", priority: "high", completed: false },
        { task: "Grain development check", due: "Day 75", priority: "high", completed: false },
        { task: "Maturity assessment", due: "Day 100", priority: "high", completed: false },
        { task: "Harvest timing decision", due: "Day 115", priority: "high", completed: false },
      ],
    },
  ])

  const [formData, setFormData] = useState({
    category: "",
    crop: "",
    variety: "",
    area: "",
    location: "",
    soilType: "",
    season: "",
    goals: "",
  })
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [availableCrops, setAvailableCrops] = useState<any>({})
  const [availableVarieties, setAvailableVarieties] = useState<string[]>([])
  const [expandedPlans, setExpandedPlans] = useState<Set<number>>(new Set())
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      title: "Optimal Planting Window",
      description: "Based on weather patterns, plant corn between March 20-30 for best yield.",
      type: "timing",
    },
    {
      title: "Crop Rotation Suggestion",
      description: "Consider planting legumes in Field B to improve soil nitrogen.",
      type: "planning",
    },
    {
      title: "Weather Alert",
      description: "Heavy rain expected next week. Delay fertilizer application.",
      type: "weather",
    },
  ])
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const { toast } = useToast()

  // Load crop plans from localStorage on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem("cropPlans")
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans)
        setCropPlans(parsedPlans)
      } catch (error) {
        console.error("Error parsing saved crop plans:", error)
      }
    }
    
    // Load AI suggestions on mount
    loadAISuggestions()
  }, [])

  // Save crop plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cropPlans", JSON.stringify(cropPlans))
  }, [cropPlans])

  const loadAISuggestions = async () => {
    setIsLoadingAI(true)
    try {
      const response = await fetch('/api/crop-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: "India",
          season: getCurrentSeason(),
          existingCrops: cropPlans.map(plan => plan.crop)
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.suggestions) {
          setAiSuggestions(data.suggestions)
        }
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1
    if (month >= 4 && month <= 9) return "Kharif"
    if (month >= 10 || month <= 3) return "Rabi"
    return "Zaid"
  }

  const handleCategoryChange = (category: string) => {
    setFormData({ ...formData, category, crop: "", variety: "", season: "" })
    if (category && cropCategories[category as keyof typeof cropCategories]) {
      setAvailableCrops(cropCategories[category as keyof typeof cropCategories].crops)
    } else {
      setAvailableCrops({})
    }
    setAvailableVarieties([])
  }

  const handleCropChange = (cropKey: string) => {
    const selectedCrop = availableCrops[cropKey]
    if (selectedCrop) {
      setFormData({ 
        ...formData, 
        crop: cropKey, 
        variety: "",
        season: selectedCrop.season
      })
      setAvailableVarieties(selectedCrop.varieties)
    } else {
      setAvailableVarieties([])
    }
  }

  const calculateHarvestDate = (cropKey: string, category: string, plantingDate: string) => {
    if (!category || !cropKey) return plantingDate
    
    const categoryData = cropCategories[category as keyof typeof cropCategories]
    if (!categoryData) return plantingDate
    
    const crop = categoryData.crops[cropKey as keyof typeof categoryData.crops]
    if (!crop) return plantingDate

    const planting = new Date(plantingDate)
    const harvest = new Date(planting.getTime() + crop.growthPeriod * 24 * 60 * 60 * 1000)
    return harvest.toISOString().split("T")[0]
  }

  const generateAICropPlan = async (cropData: any) => {
    try {
      const response = await fetch('/api/generate-crop-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData)
      })

      if (response.ok) {
        const data = await response.json()
        return data.tasks || []
      }
    } catch (error) {
      console.error('Error generating AI crop plan:', error)
    }

    // Fallback to basic tasks if AI fails
    return generateBasicTasks(cropData.category)
  }

  const generateBasicTasks = (category: string) => {
    const baseTasks = {
      "cereals-millets": [
        { task: "Prepare field and soil testing", due: "Day 1", priority: "high", completed: false },
        { task: "Apply basal fertilizers", due: "Day 2", priority: "high", completed: false },
        { task: "Sowing/transplanting", due: "Day 3", priority: "high", completed: false },
        { task: "First irrigation", due: "Day 7", priority: "high", completed: false },
        { task: "Weed management", due: "Day 21", priority: "medium", completed: false },
        { task: "Top dressing fertilizer", due: "Day 35", priority: "medium", completed: false },
        { task: "Pest monitoring", due: "Day 45", priority: "high", completed: false },
        { task: "Disease management", due: "Day 60", priority: "medium", completed: false },
        { task: "Grain filling stage care", due: "Day 90", priority: "high", completed: false },
        { task: "Harvest preparation", due: "Day 110", priority: "high", completed: false }
      ],
      "pulses-legumes": [
        { task: "Seed treatment with Rhizobium", due: "Day 1", priority: "high", completed: false },
        { task: "Field preparation and sowing", due: "Day 2", priority: "high", completed: false },
        { task: "Apply phosphorus fertilizer", due: "Day 3", priority: "medium", completed: false },
        { task: "First irrigation", due: "Day 10", priority: "high", completed: false },
        { task: "Thinning and gap filling", due: "Day 15", priority: "medium", completed: false },
        { task: "Weed control", due: "Day 25", priority: "medium", completed: false },
        { task: "Flowering stage care", due: "Day 45", priority: "high", completed: false },
        { task: "Pod formation monitoring", due: "Day 60", priority: "high", completed: false },
        { task: "Harvest at physiological maturity", due: "Day 90", priority: "high", completed: false }
      ],
      "vegetables": [
        { task: "Nursery preparation/direct sowing", due: "Day 1", priority: "high", completed: false },
        { task: "Soil preparation and bed making", due: "Day 2", priority: "high", completed: false },
        { task: "Transplanting/direct seeding", due: "Day 7", priority: "high", completed: false },
        { task: "Mulching and staking", due: "Day 10", priority: "medium", completed: false },
        { task: "First fertilizer application", due: "Day 14", priority: "medium", completed: false },
        { task: "Pest and disease monitoring", due: "Day 21", priority: "high", completed: false },
        { task: "Pruning and training", due: "Day 30", priority: "medium", completed: false },
        { task: "Second fertilizer application", due: "Day 45", priority: "medium", completed: false },
        { task: "Harvest begins", due: "Day 70", priority: "high", completed: false }
      ],
      "fruits": [
        { task: "Orchard planning and pit digging", due: "Day 1", priority: "high", completed: false },
        { task: "Planting and initial watering", due: "Day 7", priority: "high", completed: false },
        { task: "Mulching around plants", due: "Day 14", priority: "medium", completed: false },
        { task: "Training and pruning", due: "Day 30", priority: "medium", completed: false },
        { task: "Fertilizer application", due: "Day 60", priority: "medium", completed: false },
        { task: "Pest management", due: "Day 90", priority: "high", completed: false },
        { task: "Flowering stage care", due: "Day 120", priority: "high", completed: false },
        { task: "Fruit development monitoring", due: "Day 180", priority: "medium", completed: false },
        { task: "Harvest planning", due: "Day 300", priority: "high", completed: false }
      ],
      "cash-industrial": [
        { task: "Land preparation and soil testing", due: "Day 1", priority: "high", completed: false },
        { task: "Seed/planting material preparation", due: "Day 2", priority: "high", completed: false },
        { task: "Sowing/planting", due: "Day 3", priority: "high", completed: false },
        { task: "Irrigation scheduling", due: "Day 10", priority: "high", completed: false },
        { task: "Fertilizer application", due: "Day 21", priority: "medium", completed: false },
        { task: "Pest and disease control", due: "Day 45", priority: "high", completed: false },
        { task: "Growth monitoring", due: "Day 75", priority: "medium", completed: false },
        { task: "Quality assessment", due: "Day 120", priority: "high", completed: false },
        { task: "Harvest timing", due: "Day 150", priority: "high", completed: false }
      ]
    }

    return baseTasks[category as keyof typeof baseTasks] || baseTasks["cereals-millets"]
  }

  const handleCreatePlan = async () => {
    // Validation
    if (!formData.category) {
      toast({
        title: "Missing Information",
        description: "Please select a crop category",
        variant: "destructive",
      })
      return
    }

    if (!formData.crop) {
      toast({
        title: "Missing Information",
        description: "Please select a crop type",
        variant: "destructive",
      })
      return
    }

    if (!formData.variety) {
      toast({
        title: "Missing Information",
        description: "Please select a variety",
        variant: "destructive",
      })
      return
    }

    if (!formData.area) {
      toast({
        title: "Missing Information",
        description: "Please enter the field area",
        variant: "destructive",
      })
      return
    }

    if (!formData.location) {
      toast({
        title: "Missing Information",
        description: "Please enter your location",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPlan(true)

    const plantingDate = new Date().toISOString().split("T")[0]
    const harvestDate = calculateHarvestDate(formData.crop, formData.category, plantingDate)
    const selectedCrop = availableCrops[formData.crop]

    const cropData = {
      crop: selectedCrop.name,
      variety: formData.variety,
      category: formData.category,
      area: formData.area,
      location: formData.location,
      soilType: formData.soilType,
      goals: formData.goals,
      season: formData.season
    }

    // Generate AI-powered tasks
    const aiTasks = await generateAICropPlan(cropData)

    const newPlan = {
      id: Date.now(),
      crop: selectedCrop.name,
      variety: formData.variety,
      category: formData.category,
      plantingDate,
      harvestDate,
      area: formData.area,
      location: formData.location,
      status: "active" as const,
      progress: 0,
      season: formData.season,
      tasks: aiTasks,
    }

    const updatedPlans = [...cropPlans, newPlan]
    setCropPlans(updatedPlans)

    localStorage.setItem("cropPlans", JSON.stringify(updatedPlans))

    setFormData({ category: "", crop: "", variety: "", area: "", location: "", soilType: "", season: "", goals: "" })
    setAvailableCrops({})
    setAvailableVarieties([])
    setShowNewPlan(false)
    setIsGeneratingPlan(false)

    toast({
      title: "AI Crop Plan Created! 🤖",
      description: `Successfully generated an AI-powered plan for ${newPlan.crop} - ${newPlan.variety}`,
    })

    // Refresh AI suggestions after creating a new plan
    loadAISuggestions()
  }

  const deleteCropPlan = (planId: number) => {
    const updatedPlans = cropPlans.filter((plan) => plan.id !== planId)
    setCropPlans(updatedPlans)
    localStorage.setItem("cropPlans", JSON.stringify(updatedPlans))

    toast({
      title: "Plan Deleted",
      description: "Crop plan has been removed successfully",
    })
  }

  const toggleTaskCompletion = (planId: number, taskIndex: number) => {
    const updatedPlans = cropPlans.map((plan) => {
      if (plan.id === planId) {
        const updatedTasks = [...plan.tasks]
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          completed: !updatedTasks[taskIndex].completed,
        }

        const completedTasks = updatedTasks.filter((task) => task.completed).length
        const progress = Math.round((completedTasks / updatedTasks.length) * 100)

        return {
          ...plan,
          tasks: updatedTasks,
          progress,
        }
      }
      return plan
    })

    setCropPlans(updatedPlans)
    localStorage.setItem("cropPlans", JSON.stringify(updatedPlans))
  }

  const markAllTasksComplete = (planId: number) => {
    const updatedPlans = cropPlans.map((plan) => {
      if (plan.id === planId) {
        const updatedTasks = plan.tasks.map(task => ({
          ...task,
          completed: true
        }))

        return {
          ...plan,
          tasks: updatedTasks,
          progress: 100,
          status: "completed" as const
        }
      }
      return plan
    })

    setCropPlans(updatedPlans)
    localStorage.setItem("cropPlans", JSON.stringify(updatedPlans))

    toast({
      title: "All Tasks Completed! 🎉",
      description: "Congratulations! Your crop plan is now complete.",
    })
  }

  const markDayTasksComplete = (planId: number, dayTasks: number[]) => {
    const updatedPlans = cropPlans.map((plan) => {
      if (plan.id === planId) {
        const updatedTasks = [...plan.tasks]
        dayTasks.forEach(taskIndex => {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            completed: true
          }
        })

        const completedTasks = updatedTasks.filter((task) => task.completed).length
        const progress = Math.round((completedTasks / updatedTasks.length) * 100)

        return {
          ...plan,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? "completed" as const : plan.status
        }
      }
      return plan
    })

    setCropPlans(updatedPlans)
    localStorage.setItem("cropPlans", JSON.stringify(updatedPlans))

    toast({
      title: "Day Tasks Completed! ✅",
      description: `Marked ${dayTasks.length} tasks as complete for today.`,
    })
  }

  const togglePlanExpansion = (planId: number) => {
    const newExpanded = new Set(expandedPlans)
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId)
    } else {
      newExpanded.add(planId)
    }
    setExpandedPlans(newExpanded)
  }

  const handleNewPlanClick = () => {
    setShowNewPlan(true)
    setTimeout(() => {
      const formElement = document.getElementById("new-crop-plan-form")
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const getSeasonBadgeColor = (season: string) => {
    switch (season) {
      case "Kharif":
        return "bg-green-100 text-green-800"
      case "Rabi":
        return "bg-blue-100 text-blue-800"
      case "Zaid":
        return "bg-orange-100 text-orange-800"
      case "Perennial":
        return "bg-purple-100 text-purple-800"
      case "Annual":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const groupTasksByDay = (tasks: any[]) => {
    const grouped: { [key: string]: { tasks: any[], indices: number[] } } = {}
    
    tasks.forEach((task, index) => {
      const day = task.due
      if (!grouped[day]) {
        grouped[day] = { tasks: [], indices: [] }
      }
      grouped[day].tasks.push(task)
      grouped[day].indices.push(index)
    })
    
    return grouped
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Crop Planner 🤖🌱</h1>
            <p className="text-muted-foreground">AI-powered crop planning with smart recommendations for all seasons</p>
          </div>
          <Button onClick={handleNewPlanClick}>
            <Sprout className="mr-2 h-4 w-4" />
            New AI Crop Plan
          </Button>
        </div>

        {/* AI Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-blue-500" />
              AI Recommendations
              {isLoadingAI && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>Smart suggestions based on your location, weather patterns, and farming goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-green-50">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Bot className="mr-1 h-4 w-4 text-blue-500" />
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                  <Badge variant="outline" className="bg-white">{suggestion.type}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={loadAISuggestions} disabled={isLoadingAI}>
                {isLoadingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI Suggestions...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Refresh AI Suggestions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Crop Plan Form */}
        {showNewPlan && (
          <Card id="new-crop-plan-form" className="mb-8 border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-green-800 flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    Create AI-Powered Crop Plan
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Get personalized farming plans generated by AI based on your specific conditions
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPlan(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Crop Category *
                  </Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="mt-1">
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
                  <Label htmlFor="crop" className="text-sm font-semibold">
                    Crop Type *
                  </Label>
                  <Select 
                    value={formData.crop} 
                    onValueChange={handleCropChange}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label htmlFor="variety" className="text-sm font-semibold">
                    Variety *
                  </Label>
                  <Select
                    value={formData.variety}
                    onValueChange={(value) => setFormData({ ...formData, variety: value })}
                    disabled={!formData.crop}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={formData.crop ? "Select variety" : "Select crop first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVarieties.map((variety) => (
                        <SelectItem key={variety} value={variety}>
                          {variety}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="season" className="text-sm font-semibold">
                    Growing Season
                  </Label>
                  <Input
                    value={formData.season}
                    readOnly
                    className="mt-1 bg-gray-50"
                    placeholder="Auto-filled based on crop"
                  />
                </div>

                <div>
                  <Label htmlFor="area" className="text-sm font-semibold">
                    Field Area (acres) *
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2.5"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-semibold">
                    Location *
                  </Label>
                  <Input
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="soil" className="text-sm font-semibold">
                  Soil Type
                </Label>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select soil type (optional)" />
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
                <Label htmlFor="goals" className="text-sm font-semibold">
                  Farming Goals & Preferences
                </Label>
                <Textarea
                  placeholder="e.g., Maximum yield, organic farming, cost optimization, export quality, sustainable practices..."
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                  onClick={handleCreatePlan}
                  disabled={isGeneratingPlan}
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate AI Plan
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowNewPlan(false)} className="px-8">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Crop Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cropPlans.map((plan) => {
            const isExpanded = expandedPlans.has(plan.id)
            const groupedTasks = groupTasksByDay(plan.tasks)
            const visibleTasks = isExpanded ? plan.tasks : plan.tasks.slice(0, 3)
            
            return (
              <Card key={plan.id} className={plan.status === "completed" ? "border-green-300 bg-green-50" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center">
                        <Sprout className="mr-2 h-5 w-5 text-green-500" />
                        {plan.crop} - {plan.variety}
                        {plan.status === "completed" && (
                          <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-4 w-4" />
                        Planted: {plan.plantingDate} | Harvest: {plan.harvestDate}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>Area: {plan.area} acres</span>
                        <span>Location: {plan.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={plan.status === "active" ? "default" : plan.status === "completed" ? "secondary" : "outline"}>
                          {plan.status}
                        </Badge>
                        {plan.season && (
                          <Badge className={getSeasonBadgeColor(plan.season)}>
                            {plan.season}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCropPlan(plan.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          plan.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`} 
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">Tasks:</h4>
                      <div className="flex space-x-2">
                        {plan.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAllTasksComplete(plan.id)}
                            className="text-xs bg-green-50 hover:bg-green-100 border-green-300"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Mark All Done
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Show tasks grouped by day when expanded */}
                    {isExpanded ? (
                      <div className="space-y-4">
                        {Object.entries(groupedTasks).map(([day, { tasks, indices }]) => (
                          <div key={day} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-sm text-gray-700">{day}</h5>
                              {plan.status !== "completed" && tasks.some(task => !task.completed) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markDayTasksComplete(plan.id, indices.filter(i => !plan.tasks[i].completed))}
                                  className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-300"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Done for {day}
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {tasks.map((task, taskIndex) => {
                                const originalIndex = indices[taskIndex]
                                return (
                                  <div key={originalIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div className="flex items-center space-x-2">
                                      <button onClick={() => toggleTaskCompletion(plan.id, originalIndex)} className="flex-shrink-0">
                                        {task.completed ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-orange-500" />
                                        )}
                                      </button>
                                      <span className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                                        {task.task}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        task.priority === "high"
                                          ? "border-red-500 text-red-500"
                                          : task.priority === "medium"
                                            ? "border-yellow-500 text-yellow-500"
                                            : "border-green-500 text-green-500"
                                      }`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Show limited tasks when collapsed */
                      <div className="space-y-2">
                        {visibleTasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => toggleTaskCompletion(plan.id, index)} className="flex-shrink-0">
                                {task.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-orange-500" />
                                )}
                              </button>
                              <span className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                                {task.task}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  task.priority === "high"
                                    ? "border-red-500 text-red-500"
                                    : task.priority === "medium"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-green-500 text-green-500"
                                }`}
                              >
                                {task.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{task.due}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show/Hide More Tasks Button */}
                    {plan.tasks.length > 3 && (
                      <div className="text-center pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlanExpansion(plan.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="mr-1 h-4 w-4" />
                              Show Less Tasks
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-1 h-4 w-4" />
                              Show All {plan.tasks.length} Tasks
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {plan.status === "completed" && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                      <CheckCircle className="mx-auto h-6 w-6 text-green-600 mb-2" />
                      <p className="text-sm font-semibold text-green-800">Crop Plan Completed! 🎉</p>
                      <p className="text-xs text-green-700">All tasks have been successfully completed.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {cropPlans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Sprout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Crop Plans Yet</h3>
              <p className="text-gray-500 mb-4">Create your first AI-powered crop plan to get started with smart farming.</p>
              <Button onClick={handleNewPlanClick}>
                <Bot className="mr-2 h-4 w-4" />
                Create Your First AI Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
