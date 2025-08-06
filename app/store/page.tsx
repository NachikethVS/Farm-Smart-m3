"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Star, Truck, Shield, Package, Plus, Minus } from 'lucide-react'

// Comprehensive categories based on crop types
const categories = [
  { name: "Seeds", count: 245, icon: "🌱" },
  { name: "Fertilizers", count: 89, icon: "🧪" },
  { name: "Pesticides", count: 156, icon: "🛡️" },
  { name: "Tools", count: 78, icon: "🔧" },
  { name: "Equipment", count: 34, icon: "🚜" },
  { name: "Nutrients", count: 67, icon: "💊" },
]

// Enhanced product database with crop-specific items
const products = [
  // Seeds - Cereals & Millets
  {
    id: 1,
    name: "Basmati Rice Seeds - Pusa Basmati 1121",
    category: "Seeds",
    subcategory: "Cereals & Millets",
    price: 450,
    originalPrice: 550,
    rating: 4.8,
    reviews: 234,
    vendor: "Punjab Seeds Corporation",
    image: "/placeholder.svg?height=200&width=200&text=Basmati+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Premium quality Basmati rice seeds with high yield potential",
    cropType: "Rice",
    season: "Kharif",
  },
  {
    id: 2,
    name: "Wheat Seeds - HD-2967 Variety",
    category: "Seeds",
    subcategory: "Cereals & Millets",
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviews: 189,
    vendor: "Haryana Seeds Co.",
    image: "/wheat-seeds.png",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "High-yielding wheat variety suitable for irrigated conditions",
    cropType: "Wheat",
    season: "Rabi",
  },
  {
    id: 3,
    name: "Maize Hybrid Seeds - Pioneer 30V92",
    category: "Seeds",
    subcategory: "Cereals & Millets",
    price: 320,
    originalPrice: 380,
    rating: 4.7,
    reviews: 156,
    vendor: "Pioneer Seeds India",
    image: "/placeholder.svg?height=200&width=200&text=Maize+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "High-performance hybrid maize seeds with excellent grain quality",
    cropType: "Maize",
    season: "Kharif",
  },
  {
    id: 4,
    name: "Pearl Millet Seeds - HHB-67",
    category: "Seeds",
    subcategory: "Cereals & Millets",
    price: 280,
    originalPrice: 340,
    rating: 4.5,
    reviews: 98,
    vendor: "Rajasthan Seeds Ltd",
    image: "/placeholder.svg?height=200&width=200&text=Bajra+Seeds",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "Drought-tolerant pearl millet variety for arid regions",
    cropType: "Pearl Millet",
    season: "Kharif",
  },

  // Seeds - Pulses & Legumes
  {
    id: 5,
    name: "Chickpea Seeds - JG-11 Variety",
    category: "Seeds",
    subcategory: "Pulses & Legumes",
    price: 220,
    originalPrice: 280,
    rating: 4.6,
    reviews: 167,
    vendor: "MP Agro Seeds",
    image: "/placeholder.svg?height=200&width=200&text=Chickpea+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Disease-resistant chickpea variety with high protein content",
    cropType: "Chickpea",
    season: "Rabi",
  },
  {
    id: 6,
    name: "Green Gram Seeds - Pusa Vishal",
    category: "Seeds",
    subcategory: "Pulses & Legumes",
    price: 380,
    originalPrice: 450,
    rating: 4.4,
    reviews: 123,
    vendor: "IARI Seeds Division",
    image: "/placeholder.svg?height=200&width=200&text=Moong+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Short-duration green gram variety suitable for multiple cropping",
    cropType: "Green Gram",
    season: "Kharif",
  },

  // Seeds - Vegetables
  {
    id: 7,
    name: "Tomato Seeds - Arka Vikas Hybrid",
    category: "Seeds",
    subcategory: "Vegetables",
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 128,
    vendor: "IIHR Bangalore",
    image: "/tomato-seeds.png",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "High-yield hybrid tomato seeds, perfect for Indian climate",
    cropType: "Tomato",
    season: "All Season",
  },
  {
    id: 8,
    name: "Onion Seeds - Nasik Red",
    category: "Seeds",
    subcategory: "Vegetables",
    price: 450,
    originalPrice: 550,
    rating: 4.7,
    reviews: 203,
    vendor: "Maharashtra Seeds Corp",
    image: "/placeholder.svg?height=200&width=200&text=Onion+Seeds",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "Premium red onion variety with excellent storage quality",
    cropType: "Onion",
    season: "Rabi",
  },
  {
    id: 9,
    name: "Potato Seeds - Kufri Jyoti",
    category: "Seeds",
    subcategory: "Vegetables",
    price: 180,
    originalPrice: 220,
    rating: 4.3,
    reviews: 145,
    vendor: "CPRI Shimla",
    image: "/placeholder.svg?height=200&width=200&text=Potato+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Early maturing potato variety with good cooking quality",
    cropType: "Potato",
    season: "Rabi",
  },

  // Seeds - Cash & Industrial Crops
  {
    id: 10,
    name: "Cotton Seeds - Bt Cotton RCH-659",
    category: "Seeds",
    subcategory: "Cash & Industrial",
    price: 850,
    originalPrice: 1000,
    rating: 4.8,
    reviews: 267,
    vendor: "Rasi Seeds Pvt Ltd",
    image: "/placeholder.svg?height=200&width=200&text=Cotton+Seeds",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "High-yielding Bt cotton hybrid with bollworm resistance",
    cropType: "Cotton",
    season: "Kharif",
  },
  {
    id: 11,
    name: "Groundnut Seeds - TAG-24",
    category: "Seeds",
    subcategory: "Cash & Industrial",
    price: 320,
    originalPrice: 380,
    rating: 4.5,
    reviews: 134,
    vendor: "Gujarat Agro Industries",
    image: "/placeholder.svg?height=200&width=200&text=Groundnut+Seeds",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "High oil content groundnut variety with disease resistance",
    cropType: "Groundnut",
    season: "Kharif",
  },

  // Fertilizers
  {
    id: 12,
    name: "NPK Fertilizer 19:19:19",
    category: "Fertilizers",
    subcategory: "Complex Fertilizers",
    price: 1250,
    originalPrice: 1450,
    rating: 4.3,
    reviews: 89,
    vendor: "IFFCO",
    image: "/npk-fertilizer.png",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "Balanced NPK fertilizer for all crops, 50kg bag",
    cropType: "All Crops",
    season: "All Season",
  },
  {
    id: 13,
    name: "Urea Fertilizer (46% N)",
    category: "Fertilizers",
    subcategory: "Nitrogen Fertilizers",
    price: 280,
    originalPrice: 320,
    rating: 4.4,
    reviews: 234,
    vendor: "KRIBHCO",
    image: "/placeholder.svg?height=200&width=200&text=Urea+Bag",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "High-grade urea fertilizer for nitrogen supplementation, 50kg bag",
    cropType: "All Crops",
    season: "All Season",
  },
  {
    id: 14,
    name: "DAP Fertilizer (18-46-0)",
    category: "Fertilizers",
    subcategory: "Phosphorus Fertilizers",
    price: 1450,
    originalPrice: 1650,
    rating: 4.6,
    reviews: 178,
    vendor: "Coromandel International",
    image: "/placeholder.svg?height=200&width=200&text=DAP+Bag",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "Di-ammonium phosphate for phosphorus and nitrogen, 50kg bag",
    cropType: "All Crops",
    season: "All Season",
  },

  // Pesticides
  {
    id: 15,
    name: "Organic Neem Oil Pesticide",
    category: "Pesticides",
    subcategory: "Organic Pesticides",
    price: 450,
    originalPrice: 550,
    rating: 4.7,
    reviews: 203,
    vendor: "BioGreen Organics",
    image: "/neem-oil-product.png",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Natural pest control solution, 1L bottle",
    cropType: "All Crops",
    season: "All Season",
  },
  {
    id: 16,
    name: "Chlorpyrifos 20% EC Insecticide",
    category: "Pesticides",
    subcategory: "Insecticides",
    price: 380,
    originalPrice: 450,
    rating: 4.2,
    reviews: 156,
    vendor: "UPL Limited",
    image: "/placeholder.svg?height=200&width=200&text=Insecticide",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Broad-spectrum insecticide for soil and foliar pests, 1L",
    cropType: "All Crops",
    season: "All Season",
  },

  // Tools & Equipment
  {
    id: 17,
    name: "Garden Pruning Shears",
    category: "Tools",
    subcategory: "Hand Tools",
    price: 850,
    originalPrice: 1200,
    rating: 4.6,
    reviews: 156,
    vendor: "FarmTools Pro",
    image: "/placeholder-qkjqc.png",
    inStock: true,
    fastDelivery: true,
    verified: true,
    description: "Professional grade pruning shears with ergonomic grip",
    cropType: "All Crops",
    season: "All Season",
  },
  {
    id: 18,
    name: "Drip Irrigation Kit - 1 Acre",
    category: "Equipment",
    subcategory: "Irrigation",
    price: 3500,
    originalPrice: 4200,
    rating: 4.8,
    reviews: 67,
    vendor: "WaterWise Systems",
    image: "/placeholder-jed9c.png",
    inStock: true,
    fastDelivery: false,
    verified: true,
    description: "Complete drip irrigation system for 1 acre coverage",
    cropType: "All Crops",
    season: "All Season",
  },
]

export default function AgriStore() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [selectedCropType, setSelectedCropType] = useState("All")
  const [selectedSeason, setSelectedSeason] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [cart, setCart] = useState<{ [key: number]: number }>({})

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }))
  }

  // Get unique subcategories based on selected category
  const getSubcategories = () => {
    if (selectedCategory === "All") return ["All"]
    const subcategories = [...new Set(products
      .filter(p => p.category === selectedCategory)
      .map(p => p.subcategory))]
    return ["All", ...subcategories]
  }

  // Get unique crop types
  const getCropTypes = () => {
    const cropTypes = [...new Set(products.map(p => p.cropType))]
    return ["All", ...cropTypes.sort()]
  }

  // Get unique seasons
  const getSeasons = () => {
    const seasons = [...new Set(products.map(p => p.season))]
    return ["All", ...seasons.sort()]
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSubcategory = selectedSubcategory === "All" || product.subcategory === selectedSubcategory
    const matchesCropType = selectedCropType === "All" || product.cropType === selectedCropType
    const matchesSeason = selectedSeason === "All" || product.season === selectedSeason
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSubcategory && matchesCropType && matchesSeason && matchesSearch
  })

  const cartItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Agri Store 🛒</h1>
            <p className="text-muted-foreground">Buy seeds, fertilizers, tools, and equipment for all crop types from verified vendors</p>
          </div>
          <Button className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products, crops, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value)
                  setSelectedSubcategory("All")
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.icon} {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategories().map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Crop Type</label>
                <Select value={selectedCropType} onValueChange={setSelectedCropType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCropTypes().map((cropType) => (
                      <SelectItem key={cropType} value={cropType}>
                        {cropType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSeasons().map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </span>
                {selectedCategory !== "All" && (
                  <Badge variant="outline">{selectedCategory}</Badge>
                )}
                {selectedSubcategory !== "All" && (
                  <Badge variant="outline">{selectedSubcategory}</Badge>
                )}
                {selectedCropType !== "All" && (
                  <Badge variant="outline">{selectedCropType}</Badge>
                )}
                {selectedSeason !== "All" && (
                  <Badge variant="outline">{selectedSeason}</Badge>
                )}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories Quick Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory("All")
              setSelectedSubcategory("All")
            }}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.name)
                setSelectedSubcategory("All")
              }}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.fastDelivery && (
                      <Badge variant="secondary" className="text-xs">
                        <Truck className="mr-1 h-3 w-3" />
                        Fast
                      </Badge>
                    )}
                    {product.verified && (
                      <Badge variant="default" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.subcategory}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>For: {product.cropType}</span>
                    <span>•</span>
                    <span>{product.season}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">by {product.vendor}</p>

                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    {product.inStock ? (
                      <>
                        {cart[product.id] > 0 ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Button size="sm" variant="outline" onClick={() => removeFromCart(product.id)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-semibold px-2">{cart[product.id]}</span>
                            <Button size="sm" variant="outline" onClick={() => addToCart(product.id)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" className="flex-1" onClick={() => addToCart(product.id)}>
                            <Package className="mr-1 h-3 w-3" />
                            Add to Cart
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button size="sm" className="flex-1" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
