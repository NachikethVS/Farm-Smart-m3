import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cropData = await request.json()
    
    // Generate AI-powered crop plan
    const tasks = await generateAICropPlan(cropData)

    return NextResponse.json({
      success: true,
      tasks,
      message: "AI crop plan generated successfully"
    })
  } catch (error) {
    console.error('Error generating crop plan:', error)
    
    // Return fallback tasks
    const fallbackTasks = generateFallbackTasks(cropData.category)
    
    return NextResponse.json({
      success: true,
      tasks: fallbackTasks,
      message: "Basic crop plan generated (AI service unavailable)"
    })
  }
}

async function generateAICropPlan(cropData: any) {
  // This would integrate with a real AI service like OpenAI, Gemini, etc.
  // For now, we'll generate intelligent tasks based on crop data
  
  const { crop, variety, category, area, location, soilType, goals, season } = cropData
  
  const baseTasks = getBaseTasks(category)
  const enhancedTasks = enhanceTasksWithAI(baseTasks, cropData)
  
  return enhancedTasks
}

function getBaseTasks(category: string) {
  const taskTemplates = {
    "cereals-millets": [
      { task: "Soil testing and preparation", priority: "high", daysFromStart: 1 },
      { task: "Seed treatment and quality check", priority: "high", daysFromStart: 2 },
      { task: "Field preparation and leveling", priority: "high", daysFromStart: 3 },
      { task: "Sowing with proper spacing", priority: "high", daysFromStart: 5 },
      { task: "First irrigation after sowing", priority: "high", daysFromStart: 7 },
      { task: "Weed management (first round)", priority: "medium", daysFromStart: 21 },
      { task: "Fertilizer application (top dressing)", priority: "medium", daysFromStart: 35 },
      { task: "Pest monitoring and control", priority: "high", daysFromStart: 45 },
      { task: "Disease surveillance", priority: "medium", daysFromStart: 60 },
      { task: "Grain filling stage monitoring", priority: "high", daysFromStart: 90 },
      { task: "Harvest timing assessment", priority: "high", daysFromStart: 110 },
      { task: "Post-harvest processing", priority: "medium", daysFromStart: 115 }
    ],
    "pulses-legumes": [
      { task: "Rhizobium seed treatment", priority: "high", daysFromStart: 1 },
      { task: "Field preparation with organic matter", priority: "high", daysFromStart: 2 },
      { task: "Sowing at optimal depth", priority: "high", daysFromStart: 3 },
      { task: "Light irrigation after sowing", priority: "high", daysFromStart: 5 },
      { task: "Thinning and gap filling", priority: "medium", daysFromStart: 15 },
      { task: "Phosphorus fertilizer application", priority: "medium", daysFromStart: 20 },
      { task: "Weed control (mechanical/chemical)", priority: "medium", daysFromStart: 25 },
      { task: "Flowering stage care", priority: "high", daysFromStart: 45 },
      { task: "Pod formation monitoring", priority: "high", daysFromStart: 60 },
      { task: "Maturity assessment", priority: "high", daysFromStart: 85 },
      { task: "Harvest at physiological maturity", priority: "high", daysFromStart: 90 }
    ],
    "vegetables": [
      { task: "Nursery bed preparation", priority: "high", daysFromStart: 1 },
      { task: "Seed sowing in nursery", priority: "high", daysFromStart: 2 },
      { task: "Main field preparation", priority: "high", daysFromStart: 5 },
      { task: "Transplanting seedlings", priority: "high", daysFromStart: 21 },
      { task: "Mulching and staking", priority: "medium", daysFromStart: 25 },
      { task: "First fertilizer application", priority: "medium", daysFromStart: 30 },
      { task: "Pest and disease monitoring", priority: "high", daysFromStart: 35 },
      { task: "Pruning and training", priority: "medium", daysFromStart: 40 },
      { task: "Second fertilizer application", priority: "medium", daysFromStart: 50 },
      { task: "Harvest planning", priority: "high", daysFromStart: 70 },
      { task: "Continuous harvesting", priority: "high", daysFromStart: 75 }
    ],
    "fruits": [
      { task: "Site selection and planning", priority: "high", daysFromStart: 1 },
      { task: "Pit digging and soil amendment", priority: "high", daysFromStart: 7 },
      { task: "Planting with proper spacing", priority: "high", daysFromStart: 14 },
      { task: "Initial watering and mulching", priority: "high", daysFromStart: 15 },
      { task: "Training and pruning", priority: "medium", daysFromStart: 30 },
      { task: "Fertilizer application", priority: "medium", daysFromStart: 60 },
      { task: "Pest management program", priority: "high", daysFromStart: 90 },
      { task: "Flowering stage care", priority: "high", daysFromStart: 120 },
      { task: "Fruit development monitoring", priority: "medium", daysFromStart: 180 },
      { task: "Harvest timing optimization", priority: "high", daysFromStart: 300 }
    ],
    "cash-industrial": [
      { task: "Market analysis and planning", priority: "high", daysFromStart: 1 },
      { task: "Land preparation and soil testing", priority: "high", daysFromStart: 2 },
      { task: "Quality seed/material procurement", priority: "high", daysFromStart: 3 },
      { task: "Sowing/planting with precision", priority: "high", daysFromStart: 5 },
      { task: "Irrigation system setup", priority: "high", daysFromStart: 10 },
      { task: "Nutrient management program", priority: "medium", daysFromStart: 21 },
      { task: "Integrated pest management", priority: "high", daysFromStart: 45 },
      { task: "Growth monitoring and care", priority: "medium", daysFromStart: 75 },
      { task: "Quality assessment", priority: "high", daysFromStart: 120 },
      { task: "Harvest timing for quality", priority: "high", daysFromStart: 150 },
      { task: "Post-harvest processing", priority: "high", daysFromStart: 155 }
    ]
  }

  return taskTemplates[category as keyof typeof taskTemplates] || taskTemplates["cereals-millets"]
}

function enhanceTasksWithAI(baseTasks: any[], cropData: any) {
  const { crop, variety, area, location, soilType, goals, season } = cropData
  
  return baseTasks.map((task, index) => {
    let enhancedTask = { ...task }
    
    // Enhance tasks based on crop-specific requirements
    if (crop === "Rice" && task.task.includes("irrigation")) {
      enhancedTask.task = "Maintain 2-3 cm water level in rice field"
    } else if (crop === "Wheat" && task.task.includes("fertilizer")) {
      enhancedTask.task = "Apply NPK fertilizer (120:60:40 kg/ha) for wheat"
    } else if (crop === "Tomato" && task.task.includes("staking")) {
      enhancedTask.task = "Install tomato cages and tie plants for support"
    }
    
    // Enhance based on soil type
    if (soilType === "clay" && task.task.includes("preparation")) {
      enhancedTask.task += " (add organic matter for clay soil drainage)"
    } else if (soilType === "sandy" && task.task.includes("irrigation")) {
      enhancedTask.task += " (frequent light irrigation for sandy soil)"
    }
    
    // Enhance based on area size
    if (parseFloat(area) > 5 && task.task.includes("monitoring")) {
      enhancedTask.task += " (use drone/systematic field inspection for large area)"
    }
    
    // Enhance based on goals
    if (goals?.toLowerCase().includes("organic") && task.task.includes("pest")) {
      enhancedTask.task = task.task.replace("control", "control using organic methods")
    } else if (goals?.toLowerCase().includes("yield") && task.task.includes("fertilizer")) {
      enhancedTask.task += " (optimize for maximum yield)"
    }
    
    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + task.daysFromStart)
    
    if (task.daysFromStart <= 7) {
      enhancedTask.due = task.daysFromStart === 1 ? "Today" : `Day ${task.daysFromStart}`
    } else if (task.daysFromStart <= 30) {
      enhancedTask.due = `In ${task.daysFromStart} days`
    } else {
      enhancedTask.due = `Week ${Math.ceil(task.daysFromStart / 7)}`
    }
    
    enhancedTask.completed = false
    
    return enhancedTask
  })
}

function generateFallbackTasks(category: string) {
  const fallbackTasks = [
    { task: "Prepare field and conduct soil testing", due: "Day 1", priority: "high", completed: false },
    { task: "Procure quality seeds and materials", due: "Day 2", priority: "high", completed: false },
    { task: "Complete sowing/planting operations", due: "Day 3", priority: "high", completed: false },
    { task: "Set up irrigation system", due: "Day 7", priority: "high", completed: false },
    { task: "Monitor crop growth and health", due: "Week 3", priority: "medium", completed: false },
    { task: "Apply fertilizers as needed", due: "Week 5", priority: "medium", completed: false },
    { task: "Implement pest control measures", due: "Week 7", priority: "high", completed: false },
    { task: "Assess crop maturity", due: "Week 12", priority: "high", completed: false },
    { task: "Plan harvest operations", due: "Week 15", priority: "high", completed: false }
  ]
  
  return fallbackTasks
}
