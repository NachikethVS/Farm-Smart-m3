import { NextRequest, NextResponse } from "next/server"

interface ProductRecommendation {
  name: string
  type: "Fungicide" | "Insecticide" | "Fertilizer" | "Organic" | "Tool"
  price: string
  rating: number
  description: string
  activeIngredient?: string
  applicationMethod: string
  link: string
  image: string
  inStock: boolean
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const cropType = formData.get("cropType") as string
    const cropCategory = formData.get("cropCategory") as string
    const symptoms = JSON.parse(formData.get("symptoms") as string || "[]")
    const additionalInfo = formData.get("additionalInfo") as string
    const location = JSON.parse(formData.get("location") as string || "{}")

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')

    // Prepare the prompt for AI analysis
    const prompt = `You are an expert plant pathologist. Analyze this plant image and provide a detailed diagnosis in JSON format.

Context:
- Crop Type: ${cropType || 'Unknown'}
- Crop Category: ${cropCategory || 'Unknown'}
- Reported Symptoms: ${symptoms.join(', ') || 'None specified'}
- Additional Info: ${additionalInfo || 'None'}
- Location: ${location.district ? `${location.district}, ${location.state}` : 'Not specified'}

Please analyze the image and respond with ONLY a valid JSON object in this exact format:
{
  "isValidPlant": boolean,
  "plantDetected": "string - name of plant if detected",
  "disease": "string - specific disease name",
  "severity": "Low|Medium|High",
  "confidence": number (0-100),
  "symptoms": ["array", "of", "visible", "symptoms"],
  "causes": ["array", "of", "possible", "causes"],
  "treatment": ["array", "of", "treatment", "recommendations"],
  "prevention": ["array", "of", "prevention", "tips"],
  "imageQuality": "Poor|Fair|Good|Excellent",
  "additionalNotes": "string - any additional observations",
  "urgency": "Low|Medium|High|Critical",
  "estimatedRecoveryTime": "string - estimated recovery time",
  "recommendedProducts": [
    {
      "name": "Product name",
      "type": "Fungicide|Insecticide|Fertilizer|Organic|Tool",
      "price": "₹XXX",
      "rating": 4.5,
      "description": "Product description",
      "activeIngredient": "Active ingredient if applicable",
      "applicationMethod": "How to apply",
      "link": "https://amazon.in/product-link",
      "image": "/placeholder.svg?height=100&width=100&text=Product",
      "inStock": true
    }
  ]
}

For product recommendations:
- Include 1-3 relevant products for treating the diagnosed disease
- Use realistic Indian market prices in ₹
- Provide actual Amazon India or agricultural store links when possible
- Include proper application methods and active ingredients
- Ensure products are appropriate for the diagnosed disease

If no plant is detected, set isValidPlant to false and provide appropriate guidance.`

    // Make API call to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Farming Assistant - Plant Doctor"
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from AI")
    }

    // Parse the JSON response
    let diagnosis
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse)
      throw new Error("Invalid JSON response from AI")
    }

    // Validate required fields
    const requiredFields = ['isValidPlant', 'disease', 'severity', 'confidence']
    for (const field of requiredFields) {
      if (!(field in diagnosis)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Ensure recommendedProducts exists
    if (!diagnosis.recommendedProducts) {
      diagnosis.recommendedProducts = []
    }

    return NextResponse.json(diagnosis)

  } catch (error) {
    console.error("Plant analysis error:", error)
    
    // Return a fallback response with product recommendations
    const fallbackProducts: ProductRecommendation[] = [
      {
        name: "Copper Oxychloride 50% WP",
        type: "Fungicide",
        price: "₹245",
        rating: 4.5,
        description: "Broad-spectrum fungicide for common plant diseases",
        activeIngredient: "Copper Oxychloride 50%",
        applicationMethod: "2g per liter water, spray on affected areas",
        link: "https://www.amazon.in/s?k=copper+oxychloride+fungicide",
        image: "/placeholder.svg?height=100&width=100&text=Copper+Fungicide",
        inStock: true
      },
      {
        name: "Neem Oil Organic Spray",
        type: "Organic",
        price: "₹180",
        rating: 4.2,
        description: "Natural organic solution for pest and disease control",
        applicationMethod: "5ml per liter water, spray during evening hours",
        link: "https://www.amazon.in/s?k=neem+oil+organic+spray",
        image: "/neem-oil-product.png",
        inStock: true
      },
      {
        name: "NPK 19:19:19 Water Soluble",
        type: "Fertilizer",
        price: "₹120",
        rating: 4.1,
        description: "Balanced nutrition to strengthen plant immunity",
        applicationMethod: "5g per liter water, apply to soil around plant",
        link: "https://www.amazon.in/s?k=npk+19+19+19+fertilizer",
        image: "/npk-fertilizer.png",
        inStock: true
      }
    ]

    return NextResponse.json({
      isValidPlant: true,
      plantDetected: "Plant detected",
      disease: "Unable to diagnose - Analysis service unavailable",
      severity: "Medium",
      confidence: 50,
      symptoms: ["Analysis service temporarily unavailable"],
      causes: ["Service connectivity issues"],
      treatment: ["Please try again later", "Consult local agricultural expert if urgent"],
      prevention: ["Regular monitoring recommended"],
      imageQuality: "Fair",
      additionalNotes: "Our AI analysis service is temporarily unavailable. However, we've provided some general-purpose products that can help with common plant diseases. Please try again later or consult with a local agricultural expert for urgent issues.",
      urgency: "Medium",
      estimatedRecoveryTime: "Please retry analysis",
      recommendedProducts: fallbackProducts
    })
  }
}
