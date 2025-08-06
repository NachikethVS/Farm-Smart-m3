"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Calendar, Users, CheckCircle, Clock, Phone, Mail, Globe } from "lucide-react"

const schemes = [
  {
    id: 1,
    name: "PM-KISAN Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to small and marginal farmers",
    category: "Income Support",
    eligibility: "Small & marginal farmers with cultivable land",
    benefit: "₹6,000 per year",
    deadline: "2024-03-31",
    status: "active",
    applicants: "12 crore+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://pmkisan.gov.in/",
    detailsUrl: "https://pmkisan.gov.in/Documents.aspx",
    helpline: "155261 / 011-24300606",
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records", "Mobile Number"],
    steps: [
      "Visit PM-KISAN official website",
      "Click on 'New Farmer Registration'",
      "Fill in required details",
      "Upload documents",
      "Submit application",
    ],
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers in case of crop failure",
    category: "Insurance",
    eligibility: "All farmers growing notified crops",
    benefit: "Up to ₹2 lakh per hectare",
    deadline: "2024-04-15",
    status: "active",
    applicants: "5.5 crore+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://pmfby.gov.in/",
    detailsUrl: "https://pmfby.gov.in/pdf/Scheme%20Details.pdf",
    helpline: "14447",
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records", "Sowing Certificate"],
    steps: [
      "Visit PMFBY website or nearest bank",
      "Fill crop insurance application",
      "Submit required documents",
      "Pay premium amount",
      "Get policy confirmation",
    ],
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC)",
    description: "Credit facility for farmers to meet their agricultural and allied activities",
    category: "Credit",
    eligibility: "All farmers including tenant farmers",
    benefit: "Credit up to ₹3 lakh at 4% interest",
    deadline: "Ongoing",
    status: "active",
    applicants: "7 crore+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc-scheme",
    detailsUrl: "https://pmkisan.gov.in/Documents/KCC.pdf",
    helpline: "1800-180-1551",
    documents: ["Aadhaar Card", "PAN Card", "Land Documents", "Income Certificate"],
    steps: [
      "Visit nearest bank branch",
      "Fill KCC application form",
      "Submit required documents",
      "Bank verification process",
      "Credit card issuance",
    ],
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers with recommendations for appropriate nutrients",
    category: "Soil Health",
    eligibility: "All farmers",
    benefit: "Free soil testing and recommendations",
    deadline: "Ongoing",
    status: "active",
    applicants: "22 crore+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://soilhealth.dac.gov.in/",
    detailsUrl: "https://soilhealth.dac.gov.in/PublicReports/SHCScheme",
    helpline: "011-23382012",
    documents: ["Aadhaar Card", "Land Records", "Mobile Number"],
    steps: [
      "Visit Soil Health Card portal",
      "Register with required details",
      "Schedule soil sample collection",
      "Collect soil health card",
      "Follow recommendations",
    ],
  },
  {
    id: 5,
    name: "National Agriculture Market (e-NAM)",
    description: "Online trading platform for agricultural commodities",
    category: "Marketing",
    eligibility: "All farmers and traders",
    benefit: "Better price discovery and reduced transaction costs",
    deadline: "Ongoing",
    status: "active",
    applicants: "1.7 crore+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://enam.gov.in/web/",
    detailsUrl: "https://enam.gov.in/web/docs/eNAM_Scheme_Details.pdf",
    helpline: "1800-270-0224",
    documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
    steps: [
      "Visit e-NAM portal",
      "Complete farmer registration",
      "Verify mobile and bank details",
      "Start trading online",
      "Track transactions",
    ],
  },
  {
    id: 6,
    name: "Pradhan Mantri Krishi Sinchai Yojana",
    description: "Irrigation scheme to enhance water use efficiency in agriculture",
    category: "Irrigation",
    eligibility: "All farmers",
    benefit: "Subsidy on drip/sprinkler irrigation",
    deadline: "2024-06-30",
    status: "active",
    applicants: "40 lakh+",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    applyUrl: "https://pmksy.gov.in/",
    detailsUrl: "https://pmksy.gov.in/Guidelines/PMKSY_Guidelines.pdf",
    helpline: "011-23382651",
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details", "Water Source Certificate"],
    steps: [
      "Visit PMKSY portal",
      "Select irrigation component",
      "Fill application form",
      "Upload required documents",
      "Track application status",
    ],
  },
]

const categories = [
  { name: "All", count: schemes.length },
  { name: "Income Support", count: 1 },
  { name: "Insurance", count: 1 },
  { name: "Credit", count: 1 },
  { name: "Soil Health", count: 1 },
  { name: "Marketing", count: 1 },
  { name: "Irrigation", count: 1 },
]

const applicationStatus = [
  {
    scheme: "PM-KISAN Samman Nidhi",
    status: "approved",
    appliedDate: "2024-01-15",
    amount: "₹2,000",
    nextInstallment: "2024-04-01",
  },
  {
    scheme: "Pradhan Mantri Fasal Bima Yojana",
    status: "pending",
    appliedDate: "2024-01-20",
    amount: "Under review",
    nextInstallment: "-",
  },
]

export default function SchemesSubsidies() {
  const openApplicationLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openDetailsLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Government Schemes & Subsidies 📋</h1>
          <p className="text-muted-foreground">
            Discover and apply for government programs designed to support farmers
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search schemes by name or keyword..." className="pl-10" />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name.toLowerCase()}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all-states">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-states">All States</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="up">Uttar Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Application Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Your Applications
                </CardTitle>
                <CardDescription>Track the status of your scheme applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationStatus.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{app.scheme}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>Applied: {app.appliedDate}</span>
                          <span>Amount: {app.amount}</span>
                          {app.nextInstallment !== "-" && <span>Next: {app.nextInstallment}</span>}
                        </div>
                      </div>
                      <Badge variant={app.status === "approved" ? "default" : "secondary"}>
                        {app.status === "approved" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Schemes */}
            <div className="space-y-6">
              {schemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{scheme.name}</CardTitle>
                          <Badge variant="outline">{scheme.category}</Badge>
                        </div>
                        <CardDescription className="text-sm leading-relaxed">{scheme.description}</CardDescription>
                      </div>
                      <Badge variant={scheme.status === "active" ? "default" : "secondary"}>{scheme.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Eligibility</h5>
                        <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Benefit</h5>
                        <p className="text-sm text-muted-foreground">{scheme.benefit}</p>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-sm mb-2">Required Documents</h5>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Application Steps */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-sm mb-2">How to Apply</h5>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {scheme.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="font-medium mr-2">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Deadline: {scheme.deadline}
                        </span>
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {scheme.applicants} beneficiaries
                        </span>
                        <span className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {scheme.helpline}
                        </span>
                      </div>
                      <span className="text-xs">{scheme.ministry}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={() => openApplicationLink(scheme.applyUrl)}>
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Apply Online
                      </Button>
                      <Button variant="outline" onClick={() => openDetailsLink(scheme.detailsUrl)}>
                        <Globe className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Schemes</span>
                    <span className="font-semibold">{schemes.filter((s) => s.status === "active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Your Applications</span>
                    <span className="font-semibold">{applicationStatus.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Approved</span>
                    <span className="font-semibold text-green-600">
                      {applicationStatus.filter((a) => a.status === "approved").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-semibold text-orange-600">
                      {applicationStatus.filter((a) => a.status === "pending").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <div
                      key={category.name}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Important Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => openApplicationLink("https://pmkisan.gov.in/")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    PM-KISAN Portal
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => openApplicationLink("https://pmfby.gov.in/")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Crop Insurance
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => openApplicationLink("https://enam.gov.in/web/")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    e-NAM Portal
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => openApplicationLink("https://soilhealth.dac.gov.in/")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Soil Health Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-green-600" />
                    <div>
                      <strong>Kisan Call Centre:</strong>
                      <br />
                      <a href="tel:1800-180-1551" className="text-blue-600 hover:underline">
                        1800-180-1551
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-blue-600" />
                    <div>
                      <strong>Email Support:</strong>
                      <br />
                      <a href="mailto:support@pmkisan.gov.in" className="text-blue-600 hover:underline">
                        support@pmkisan.gov.in
                      </a>
                    </div>
                  </div>
                  <div>
                    <strong>Hours:</strong> 6 AM - 10 PM (All days)
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => openApplicationLink("https://mkisan.gov.in/Home/ContactUs")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
