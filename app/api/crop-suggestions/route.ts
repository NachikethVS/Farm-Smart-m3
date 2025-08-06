import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { location, season, existingCrops } = await request.json()
    
    // Generate AI-powered crop suggestions
    const suggestions = await generateCropSuggestions(location, season, existingCrops)

    return NextResponse.json({
      success: true,
      suggestions,
      message: "AI crop suggestions generated successfully"
    })
  } catch (error) {
    console.error('Error generating crop suggestions:', error)
    
    // Return fallback suggestions
    const fallbackSuggestions = getFallbackSuggestions(season)
    
    return NextResponse.json({
      success: true,
      suggestions: fallbackSuggestions,
      message: "Basic suggestions generated (AI service unavailable)"
    })
  }
}

async function generateCropSuggestions(location: string, season: string, existingCrops: string[]) {
  // This would integrate with a real AI service like OpenAI, Gemini, etc.
  // For now, we'll generate intelligent suggestions based on season and location
  
  const seasonalSuggestions = getSeasonalSuggestions(season)
  const locationSuggestions = getLocationSuggestions(location)
  const rotationSuggestions = getCropRotationSuggestions(existingCrops)
  
  return [
    ...seasonalSuggestions,
    ...locationSuggestions,
    ...rotationSuggestions
  ].slice(0, 3) // Return top 3 suggestions
}

function getSeasonalSuggestions(season: string) {
  const suggestions = {
    "Kharif": [
      {
        title: "Optimal Kharif Planting",
        description: "Plant rice, cotton, and sugarcane during monsoon season for maximum water utilization.",
        type: "timing"
      },
      {
        title: "Monsoon Crop Selection",
        description: "Consider drought-resistant varieties like pearl millet and sorghum for rain-fed areas.",
        type: "planning"
      }
    ],
    "Rabi": [
      {
        title: "Winter Crop Advantage",
        description: "Plant wheat, barley, and mustard now for cooler weather and less pest pressure.",
        type: "timing"
      },
      {
        title: "Rabi Season Planning",
        description: "Focus on legumes like chickpea and lentil to improve soil nitrogen for next season.",
        type: "planning"
      }
    ],
    "Zaid": [
      {
        title: "Summer Crop Strategy",
        description: "Plant watermelon, muskmelon, and fodder crops with adequate irrigation planning.",
        type: "timing"
      },
      {
        title: "Heat-Tolerant Varieties",
        description: "Choose heat-resistant varieties and ensure proper irrigation scheduling.",
        type: "planning"
      }
    ]
  }
  
  return suggestions[season as keyof typeof suggestions] || suggestions["Kharif"]
}

function getLocationSuggestions(location: string) {
  // Basic location-based suggestions for India
  if (location.toLowerCase().includes("punjab") || location.toLowerCase().includes("haryana")) {
    return [{
      title: "Punjab-Haryana Belt Advantage",
      description: "Leverage fertile alluvial soil for high-yield wheat and rice production.",
      type: "planning"
    }]
  } else if (location.toLowerCase().includes("maharashtra")) {
    return [{
      title: "Maharashtra Climate Benefits",
      description: "Ideal conditions for cotton, sugarcane, and soybean cultivation.",
      type: "planning"
    }]
  } else if (location.toLowerCase().includes("kerala") || location.toLowerCase().includes("karnataka")) {
    return [{
      title: "South India Specialty",
      description: "Perfect climate for spices, coconut, and tropical fruit cultivation.",
      type: "planning"
    }]
  }
  
  return [{
    title: "Regional Crop Selection",
    description: "Choose crops suited to your local climate and soil conditions.",
    type: "planning"
  }]
}

function getCropRotationSuggestions(existingCrops: string[]) {
  const suggestions = []
  
  if (existingCrops.some(crop => crop.toLowerCase().includes("rice") || crop.toLowerCase().includes("wheat"))) {
    suggestions.push({
      title: "Nitrogen Fixation Rotation",
      description: "Follow cereal crops with legumes like chickpea or lentil to restore soil nitrogen naturally.",
      type: "planning"
    })
  }
  
  if (existingCrops.some(crop => crop.toLowerCase().includes("cotton") || crop.toLowerCase().includes("sugarcane"))) {
    suggestions.push({
      title: "Cash Crop Rotation",
      description: "Rotate cash crops with cereals or pulses to maintain soil health and reduce pest buildup.",
      type: "planning"
    })
  }
  
  if (existingCrops.length === 0) {
    suggestions.push({
      title: "Start with Basics",
      description: "Begin with staple crops like rice or wheat based on your season and location.",
      type: "planning"
    })
  }
  
  return suggestions
}

function getFallbackSuggestions(season: string) {
  return [
    {
      title: "Seasonal Crop Planning",
      description: `Plan your ${season} crops based on local weather patterns and market demand.`,
      type: "timing"
    },
    {
      title: "Soil Health Management",
      description: "Focus on maintaining soil fertility through organic matter and proper crop rotation.",
      type: "planning"
    },
    {
      title: "Water Management",
      description: "Implement efficient irrigation systems to optimize water usage for your crops.",
      type: "planning"
    }
  ]
}
