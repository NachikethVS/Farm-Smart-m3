"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, Stethoscope, AlertTriangle, CheckCircle, Leaf, Bug, Droplets, Sun, Wind, Thermometer, Eye, Clock, TrendingUp, FileText, Download, Share2, Loader2, ShoppingCart, ExternalLink, Star } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "@/components/location-context"

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

interface DiagnosisResult {
  isValidPlant: boolean
  plantDetected: string
  disease: string
  severity: "Low" | "Medium" | "High"
  confidence: number
  symptoms: string[]
  causes: string[]
  treatment: string[]
  prevention: string[]
  imageQuality: "Poor" | "Fair" | "Good" | "Excellent"
  additionalNotes: string
  urgency: "Low" | "Medium" | "High" | "Critical"
  estimatedRecoveryTime: string
  recommendedProducts: ProductRecommendation[]
}

const cropCategories = {
  cereals: ["Rice", "Wheat", "Maize", "Barley", "Oats", "Millet"],
  vegetables: ["Tomato", "Potato", "Onion", "Cabbage", "Carrot", "Brinjal", "Okra", "Cucumber"],
  fruits: ["Mango", "Apple", "Banana", "Orange", "Grapes", "Papaya", "Guava"],
  pulses: ["Chickpea", "Lentil", "Black Gram", "Green Gram", "Pigeon Pea"],
  cash_crops: ["Cotton", "Sugarcane", "Tobacco", "Jute", "Tea", "Coffee"],
  spices: ["Turmeric", "Chili", "Coriander", "Cumin", "Cardamom", "Black Pepper"],
}

const commonSymptoms = [
  "Yellowing leaves",
  "Brown spots on leaves",
  "Wilting",
  "Stunted growth",
  "Leaf curling",
  "White powdery coating",
  "Black spots",
  "Holes in leaves",
  "Root rot",
  "Fruit rot",
  "Insect damage",
  "Discoloration",
]

export default function PlantDoctor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [cropType, setCropType] = useState("")
  const [cropCategory, setCropCategory] = useState("")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()
  const { location } = useLocation()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file.",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const analyzePlant = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image of the affected plant.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setDiagnosis(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("cropType", cropType || "")
      formData.append("cropCategory", cropCategory || "")
      formData.append("symptoms", JSON.stringify(symptoms || []))
      formData.append("additionalInfo", additionalInfo || "")
      formData.append("location", JSON.stringify(location || {}))

      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      setDiagnosis(result)

      if (result.isValidPlant) {
        toast({
          title: "Analysis Complete!",
          description: `Detected: ${result.disease} with ${result.confidence}% confidence`,
        })
      } else {
        toast({
          title: "No Plant Detected",
          description: "Please upload a clear image of the affected plant.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case "Fungicide":
        return "bg-red-100 text-red-800"
      case "Insecticide":
        return "bg-orange-100 text-orange-800"
      case "Fertilizer":
        return "bg-blue-100 text-blue-800"
      case "Organic":
        return "bg-green-100 text-green-800"
      case "Tool":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Plant Doctor 🩺</h1>
          <p className="text-muted-foreground">
            Upload plant images to diagnose diseases and get AI-powered treatment recommendations with product links
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload Plant Image
                </CardTitle>
                <CardDescription>Take a clear photo of the affected plant parts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Plant preview"
                          className="max-w-full h-48 object-contain mx-auto rounded-lg"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null)
                            setImagePreview(null)
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                          </Label>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  Crop Information
                </CardTitle>
                <CardDescription>Help us provide more accurate diagnosis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="crop-category">Crop Category</Label>
                  <Select value={cropCategory} onValueChange={setCropCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cereals">Cereals</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="pulses">Pulses</SelectItem>
                      <SelectItem value="cash_crops">Cash Crops</SelectItem>
                      <SelectItem value="spices">Spices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cropCategory && (
                  <div>
                    <Label htmlFor="crop-type">Specific Crop</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropCategories[cropCategory as keyof typeof cropCategories]?.map((crop) => (
                          <SelectItem key={crop} value={crop.toLowerCase()}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="mr-2 h-5 w-5" />
                  Observed Symptoms
                </CardTitle>
                <CardDescription>Select all symptoms you've noticed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant={symptoms.includes(symptom) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSymptom(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Any other details about the problem</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe when you first noticed the problem, recent weather conditions, fertilizers used, etc."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <Button onClick={analyzePlant} disabled={isAnalyzing || !selectedImage} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Plant...
                </>
              ) : (
                <>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Analyze Plant
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {diagnosis && (
              <>
                {diagnosis.isValidPlant ? (
                  <>
                    {/* Diagnosis Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Stethoscope className="mr-2 h-5 w-5" />
                            Diagnosis Results
                          </span>
                          <div className="flex items-center space-x-2">
                            {getUrgencyIcon(diagnosis.urgency)}
                            <Badge className={getSeverityColor(diagnosis.severity)}>{diagnosis.severity}</Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-red-600">{diagnosis.disease}</h3>
                          <p className="text-sm text-muted-foreground">
                            Detected in: {diagnosis.plantDetected}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Confidence</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${diagnosis.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold">{diagnosis.confidence}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Image Quality</p>
                            <Badge variant="outline">{diagnosis.imageQuality}</Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Recovery Time</p>
                          <p className="text-sm text-muted-foreground">{diagnosis.estimatedRecoveryTime}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Products */}
                    {diagnosis.recommendedProducts && diagnosis.recommendedProducts.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
                            Recommended Products
                          </CardTitle>
                          <CardDescription>Products to treat {diagnosis.disease}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {diagnosis.recommendedProducts.map((product, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex space-x-3">
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{product.name}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className={getProductTypeColor(product.type)} variant="secondary">
                                        {product.type}
                                      </Badge>
                                      {!product.inStock && (
                                        <Badge variant="destructive">Out of Stock</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      {renderStars(product.rating)}
                                      <span className="text-xs text-muted-foreground">({product.rating})</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-green-600">{product.price}</p>
                                  <Button
                                    size="sm"
                                    className="mt-2"
                                    disabled={!product.inStock}
                                    onClick={() => window.open(product.link, '_blank')}
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    Buy Now
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                                {product.activeIngredient && (
                                  <p className="text-xs">
                                    <span className="font-medium">Active Ingredient:</span> {product.activeIngredient}
                                  </p>
                                )}
                                <p className="text-xs">
                                  <span className="font-medium">Application:</span> {product.applicationMethod}
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Symptoms */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Eye className="mr-2 h-5 w-5" />
                          Identified Symptoms
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {diagnosis.symptoms.map((symptom, index) => (
                            <li key={index} className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                              <span className="text-sm">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Causes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5" />
                          Possible Causes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {diagnosis.causes.map((cause, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                              <span className="text-sm">{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Treatment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Stethoscope className="mr-2 h-5 w-5 text-green-600" />
                          Recommended Treatment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {diagnosis.treatment.map((treatment, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Prevention */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
                          Prevention Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {diagnosis.prevention.map((tip, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    {diagnosis.additionalNotes && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Additional Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{diagnosis.additionalNotes}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Results
                      </Button>
                    </div>
                  </>
                ) : (
                  /* No Plant Detected */
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-600">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        No Plant Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{diagnosis.additionalNotes}</AlertDescription>
                      </Alert>

                      <div>
                        <h4 className="font-semibold mb-2">Tips for better plant photos:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Ensure good lighting (natural light works best)</li>
                          <li>• Focus on affected leaves, stems, or plant parts</li>
                          <li>• Take photos from multiple angles</li>
                          <li>• Include healthy parts for comparison</li>
                          <li>• Avoid blurry or distant shots</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!diagnosis && !isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Diagnose</h3>
                  <p className="text-muted-foreground">
                    Upload a plant image and provide details to get started with AI-powered plant disease diagnosis and product recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
