"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart3, TrendingUp, TrendingDown, MapPin, RefreshCw, Bell, DollarSign, Target, CheckCircle, Clock, Truck, Building2, Users, Phone } from 'lucide-react'

// Comprehensive location data for all Indian states, cities, and districts
const locationData = {
  "Andhra Pradesh": {
    cities: {
      Visakhapatnam: ["Visakhapatnam Urban", "Visakhapatnam Rural", "Anakapalli", "Narsipatnam", "Bheemunipatnam"],
      Vijayawada: ["Krishna Urban", "Krishna Rural", "Machilipatnam", "Gudivada", "Jaggayyapeta"],
      Tirupati: ["Chittoor", "Madanapalle", "Srikalahasti", "Puttur", "Palamaner"],
      Guntur: ["Guntur Urban", "Guntur Rural", "Tenali", "Narasaraopet", "Sattenapalli"],
      Kurnool: ["Kurnool Urban", "Kurnool Rural", "Nandyal", "Adoni", "Yemmiganur"],
      Rajahmundry: ["East Godavari", "West Godavari", "Kakinada", "Amalapuram", "Tanuku"],
      Nellore: ["Nellore Urban", "Nellore Rural", "Gudur", "Kavali", "Atmakur"],
    },
  },
  "Arunachal Pradesh": {
    cities: {
      Itanagar: ["Papum Pare", "Capital Complex", "Naharlagun", "Banderdewa"],
      Pasighat: ["East Siang", "West Siang", "Upper Siang", "Lower Siang"],
      Tezpur: ["Sonitpur", "Lakhimpur", "Dhemaji", "North Lakhimpur"],
      Bomdila: ["West Kameng", "East Kameng", "Tawang", "Seppa"],
    },
  },
  Assam: {
    cities: {
      Guwahati: ["Kamrup Metro", "Kamrup Rural", "Nalbari", "Barpeta", "Bajali"],
      Dibrugarh: ["Dibrugarh Urban", "Dibrugarh Rural", "Tinsukia", "Sivasagar", "Jorhat"],
      Silchar: ["Cachar", "Karimganj", "Hailakandi", "Dima Hasao"],
      Jorhat: ["Jorhat Urban", "Jorhat Rural", "Majuli", "Golaghat", "Titabar"],
      Tezpur: ["Sonitpur", "Lakhimpur", "Dhemaji", "Biswanath"],
      Nagaon: ["Nagaon Urban", "Nagaon Rural", "Morigaon", "Hojai", "West Karbi Anglong"],
    },
  },
  Bihar: {
    cities: {
      Patna: ["Patna Urban", "Patna Rural", "Nalanda", "Jehanabad", "Arwal"],
      Gaya: ["Gaya Urban", "Gaya Rural", "Aurangabad", "Nawada", "Jamui"],
      Bhagalpur: ["Bhagalpur Urban", "Bhagalpur Rural", "Banka", "Munger", "Lakhisarai"],
      Muzaffarpur: ["Muzaffarpur Urban", "Muzaffarpur Rural", "Sitamarhi", "Sheohar", "Vaishali"],
      Darbhanga: ["Darbhanga Urban", "Darbhanga Rural", "Madhubani", "Samastipur", "Begusarai"],
      Purnia: ["Purnia Urban", "Purnia Rural", "Katihar", "Araria", "Kishanganj"],
    },
  },
  Chhattisgarh: {
    cities: {
      Raipur: ["Raipur Urban", "Raipur Rural", "Durg", "Rajnandgaon", "Mahasamund"],
      Bilaspur: ["Bilaspur Urban", "Bilaspur Rural", "Korba", "Janjgir-Champa", "Mungeli"],
      Jagdalpur: ["Bastar", "Kondagaon", "Narayanpur", "Kanker", "Sukma"],
      Raigarh: ["Raigarh Urban", "Raigarh Rural", "Jashpur", "Surajpur", "Balrampur"],
    },
  },
  Delhi: {
    cities: {
      "New Delhi": ["Central Delhi", "New Delhi", "North Delhi", "South Delhi"],
      "East Delhi": ["East Delhi", "North East Delhi", "Shahdara", "Seelampuri"],
      "West Delhi": ["West Delhi", "North West Delhi", "South West Delhi", "Dwarka"],
    },
  },
  Goa: {
    cities: {
      Panaji: ["North Goa", "Tiswadi", "Bardez", "Pernem"],
      Margao: ["South Goa", "Salcete", "Mormugao", "Quepem"],
      "Vasco da Gama": ["Mormugao", "Vasco Urban", "Dabolim", "Bogmalo"],
    },
  },
  Gujarat: {
    cities: {
      Ahmedabad: ["Ahmedabad Urban", "Ahmedabad Rural", "Gandhinagar", "Kheda", "Anand"],
      Surat: ["Surat Urban", "Surat Rural", "Navsari", "Valsad", "Tapi"],
      Vadodara: ["Vadodara Urban", "Vadodara Rural", "Bharuch", "Narmada", "Chhota Udepur"],
      Rajkot: ["Rajkot Urban", "Rajkot Rural", "Jamnagar", "Devbhumi Dwarka", "Porbandar"],
      Bhavnagar: ["Bhavnagar Urban", "Bhavnagar Rural", "Amreli", "Gir Somnath", "Botad"],
      Junagadh: ["Junagadh Urban", "Junagadh Rural", "Gir Somnath", "Amreli", "Bhavnagar"],
    },
  },
  Haryana: {
    cities: {
      Gurgaon: ["Gurugram Urban", "Gurugram Rural", "Faridabad", "Palwal", "Nuh"],
      Karnal: ["Karnal Urban", "Karnal Rural", "Panipat", "Sonipat", "Kaithal"],
      Hisar: ["Hisar Urban", "Hisar Rural", "Sirsa", "Fatehabad", "Jind"],
      Ambala: ["Ambala Urban", "Ambala Rural", "Kurukshetra", "Yamunanagar", "Panchkula"],
      Rohtak: ["Rohtak Urban", "Rohtak Rural", "Jhajjar", "Charkhi Dadri", "Bhiwani"],
    },
  },
  "Himachal Pradesh": {
    cities: {
      Shimla: ["Shimla Urban", "Shimla Rural", "Solan", "Sirmaur", "Kinnaur"],
      Dharamshala: ["Kangra", "Una", "Hamirpur", "Bilaspur"],
      Mandi: ["Mandi Urban", "Mandi Rural", "Kullu", "Lahaul and Spiti", "Chamba"],
      Baddi: ["Solan", "Sirmaur", "Shimla Rural", "Bilaspur"],
    },
  },
  Jharkhand: {
    cities: {
      Ranchi: ["Ranchi Urban", "Ranchi Rural", "Khunti", "Gumla", "Simdega"],
      Jamshedpur: ["East Singhbhum", "West Singhbhum", "Seraikela-Kharsawan", "Chaibasa"],
      Dhanbad: ["Dhanbad Urban", "Dhanbad Rural", "Bokaro", "Giridih", "Hazaribagh"],
      Deoghar: ["Deoghar Urban", "Deoghar Rural", "Dumka", "Jamtara", "Godda"],
    },
  },
  Karnataka: {
    cities: {
      Bangalore: ["Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Tumakuru", "Chikkaballapur"],
      Mysore: ["Mysuru Urban", "Mysuru Rural", "Mandya", "Hassan", "Kodagu"],
      Hubli: ["Dharwad", "Haveri", "Gadag", "Koppal", "Bagalkot"],
      Mangalore: ["Dakshina Kannada", "Udupi", "Uttara Kannada", "Chikkamagaluru"],
      Belgaum: ["Belagavi Urban", "Belagavi Rural", "Vijayapura", "Bagalkot", "Bidar"],
      Gulbarga: ["Kalaburagi Urban", "Kalaburagi Rural", "Bidar", "Yadgir", "Raichur"],
    },
  },
  Kerala: {
    cities: {
      Kochi: ["Ernakulam", "Thrissur", "Idukki", "Alappuzha"],
      Thiruvananthapuram: ["Thiruvananthapuram Urban", "Thiruvananthapuram Rural", "Kollam", "Pathanamthitta"],
      Kozhikode: ["Kozhikode Urban", "Kozhikode Rural", "Wayanad", "Malappuram", "Kannur"],
      Thrissur: ["Thrissur Urban", "Thrissur Rural", "Palakkad", "Ernakulam", "Idukki"],
    },
  },
  "Madhya Pradesh": {
    cities: {
      Bhopal: ["Bhopal Urban", "Bhopal Rural", "Sehore", "Raisen", "Vidisha"],
      Indore: ["Indore Urban", "Indore Rural", "Ujjain", "Dewas", "Dhar"],
      Gwalior: ["Gwalior Urban", "Gwalior Rural", "Morena", "Bhind", "Datia"],
      Jabalpur: ["Jabalpur Urban", "Jabalpur Rural", "Katni", "Narsinghpur", "Seoni"],
      Sagar: ["Sagar Urban", "Sagar Rural", "Damoh", "Panna", "Chhatarpur"],
    },
  },
  Maharashtra: {
    cities: {
      Mumbai: ["Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad"],
      Pune: ["Pune Urban", "Pune Rural", "Satara", "Sangli", "Kolhapur"],
      Nashik: ["Nashik Urban", "Nashik Rural", "Ahmednagar", "Dhule", "Nandurbar"],
      Nagpur: ["Nagpur Urban", "Nagpur Rural", "Wardha", "Bhandara", "Gondia"],
      Aurangabad: ["Aurangabad Urban", "Aurangabad Rural", "Jalna", "Beed", "Osmanabad"],
      Solapur: ["Solapur Urban", "Solapur Rural", "Pandharpur", "Akkalkot", "Barshi"],
    },
  },
  Manipur: {
    cities: {
      Imphal: ["Imphal East", "Imphal West", "Thoubal", "Bishnupur"],
      Churachandpur: ["Churachandpur", "Chandel", "Tengnoupal", "Pherzawl"],
    },
  },
  Meghalaya: {
    cities: {
      Shillong: ["East Khasi Hills", "West Khasi Hills", "Ri Bhoi", "South West Khasi Hills"],
      Tura: ["West Garo Hills", "East Garo Hills", "North Garo Hills", "South Garo Hills"],
    },
  },
  Mizoram: {
    cities: {
      Aizawl: ["Aizawl Urban", "Aizawl Rural", "Kolasib", "Mamit"],
      Lunglei: ["Lunglei Urban", "Lunglei Rural", "Lawngtlai", "Saiha"],
    },
  },
  Nagaland: {
    cities: {
      Kohima: ["Kohima Urban", "Kohima Rural", "Peren", "Phek"],
      Dimapur: ["Dimapur Urban", "Dimapur Rural", "Chumukedima", "Niuland"],
    },
  },
  Odisha: {
    cities: {
      Bhubaneswar: ["Khordha", "Puri", "Nayagarh", "Cuttack"],
      Cuttack: ["Cuttack Urban", "Cuttack Rural", "Jagatsinghpur", "Kendrapara"],
      Rourkela: ["Sundargarh", "Jharsuguda", "Sambalpur", "Deogarh"],
      Berhampur: ["Ganjam", "Rayagada", "Koraput", "Nabarangpur"],
    },
  },
  Punjab: {
    cities: {
      Ludhiana: ["Ludhiana Urban", "Ludhiana Rural", "Khanna", "Samrala", "Payal"],
      Amritsar: ["Amritsar Urban", "Amritsar Rural", "Tarn Taran", "Gurdaspur", "Pathankot"],
      Jalandhar: ["Jalandhar Urban", "Jalandhar Rural", "Kapurthala", "Hoshiarpur", "Shaheed Bhagat Singh Nagar"],
      Patiala: ["Patiala Urban", "Patiala Rural", "Fatehgarh Sahib", "Rajpura", "Samana"],
      Bathinda: ["Bathinda Urban", "Bathinda Rural", "Mansa", "Faridkot", "Muktsar"],
      Mohali: ["Mohali Urban", "Mohali Rural", "Rupnagar", "Fatehgarh Sahib", "Zirakpur"],
    },
  },
  Rajasthan: {
    cities: {
      Jaipur: ["Jaipur Urban", "Jaipur Rural", "Sikar", "Jhunjhunu", "Alwar"],
      Jodhpur: ["Jodhpur Urban", "Jodhpur Rural", "Pali", "Barmer", "Jaisalmer"],
      Udaipur: ["Udaipur Urban", "Udaipur Rural", "Rajsamand", "Dungarpur", "Banswara"],
      Kota: ["Kota Urban", "Kota Rural", "Bundi", "Jhalawar", "Baran"],
      Bikaner: ["Bikaner Urban", "Bikaner Rural", "Ganganagar", "Hanumangarh", "Churu"],
      Ajmer: ["Ajmer Urban", "Ajmer Rural", "Pushkar", "Kishangarh", "Beawar"],
    },
  },
  Sikkim: {
    cities: {
      Gangtok: ["East Sikkim", "Gangtok Urban", "Pakyong", "Rongli"],
      Namchi: ["South Sikkim", "Ravangla", "Jorethang", "Singtam"],
    },
  },
  "Tamil Nadu": {
    cities: {
      Chennai: ["Chennai Urban", "Kanchipuram", "Tiruvallur", "Chengalpattu"],
      Coimbatore: ["Coimbatore Urban", "Coimbatore Rural", "Tirupur", "Erode", "Nilgiris"],
      Madurai: ["Madurai Urban", "Madurai Rural", "Theni", "Dindigul", "Sivaganga"],
      Tiruchirappalli: ["Tiruchirappalli Urban", "Tiruchirappalli Rural", "Karur", "Perambalur", "Ariyalur"],
      Salem: ["Salem Urban", "Salem Rural", "Namakkal", "Dharmapuri", "Krishnagiri"],
      Tirunelveli: ["Tirunelveli Urban", "Tirunelveli Rural", "Tenkasi", "Thoothukudi", "Kanyakumari"],
    },
  },
  Telangana: {
    cities: {
      Hyderabad: ["Hyderabad Urban", "Rangareddy", "Medchal-Malkajgiri", "Sangareddy"],
      Warangal: ["Warangal Urban", "Warangal Rural", "Hanamkonda", "Jangaon", "Mahabubabad"],
      Nizamabad: ["Nizamabad Urban", "Nizamabad Rural", "Kamareddy", "Jagitial", "Rajanna Sircilla"],
      Karimnagar: ["Karimnagar Urban", "Karimnagar Rural", "Peddapalli", "Jayashankar", "Mancherial"],
    },
  },
  Tripura: {
    cities: {
      Agartala: ["West Tripura", "Sepahijala", "Gomati", "South Tripura"],
      Dharmanagar: ["North Tripura", "Unakoti", "Dhalai", "Khowai"],
    },
  },
  "Uttar Pradesh": {
    cities: {
      Lucknow: ["Lucknow Urban", "Lucknow Rural", "Unnao", "Rae Bareli", "Sitapur"],
      Kanpur: ["Kanpur Urban", "Kanpur Rural", "Kanpur Dehat", "Farrukhabad", "Etawah"],
      Agra: ["Agra Urban", "Agra Rural", "Mathura", "Firozabad", "Mainpuri"],
      Varanasi: ["Varanasi Urban", "Varanasi Rural", "Chandauli", "Ghazipur", "Jaunpur"],
      Allahabad: ["Prayagraj Urban", "Prayagraj Rural", "Kaushambi", "Pratapgarh", "Fatehpur"],
      Meerut: ["Meerut Urban", "Meerut Rural", "Ghaziabad", "Gautam Buddha Nagar", "Bulandshahr"],
      Bareilly: ["Bareilly Urban", "Bareilly Rural", "Pilibhit", "Shahjahanpur", "Badaun"],
      Gorakhpur: ["Gorakhpur Urban", "Gorakhpur Rural", "Kushinagar", "Deoria", "Maharajganj"],
    },
  },
  Uttarakhand: {
    cities: {
      Dehradun: ["Dehradun Urban", "Dehradun Rural", "Mussoorie", "Rishikesh", "Clement Town"],
      Haridwar: ["Haridwar Urban", "Haridwar Rural", "Roorkee", "Laksar", "Bhagwanpur"],
      Nainital: ["Nainital Urban", "Nainital Rural", "Haldwani", "Ramnagar", "Bhowali"],
      Haldwani: ["Nainital", "Udham Singh Nagar", "Champawat", "Bageshwar"],
    },
  },
  "West Bengal": {
    cities: {
      Kolkata: ["Kolkata Urban", "North 24 Parganas", "South 24 Parganas", "Howrah"],
      Howrah: ["Howrah Urban", "Howrah Rural", "Hooghly", "East Midnapore"],
      Durgapur: ["Paschim Bardhaman", "Purba Bardhaman", "Birbhum", "Murshidabad"],
      Asansol: ["Paschim Bardhaman", "Purulia", "Bankura", "West Midnapore"],
      Siliguri: ["Darjeeling", "Jalpaiguri", "Cooch Behar", "Alipurduar"],
      Malda: ["Malda Urban", "Malda Rural", "Uttar Dinajpur", "Dakshin Dinajpur"],
    },
  },
  "Jammu and Kashmir": {
    cities: {
      Srinagar: ["Srinagar Urban", "Srinagar Rural", "Budgam", "Ganderbal"],
      Jammu: ["Jammu Urban", "Jammu Rural", "Samba", "Kathua"],
      Anantnag: ["Anantnag Urban", "Anantnag Rural", "Kulgam", "Shopian"],
      Baramulla: ["Baramulla Urban", "Baramulla Rural", "Kupwara", "Bandipora"],
    },
  },
  Ladakh: {
    cities: {
      Leh: ["Leh Urban", "Leh Rural", "Nubra Valley", "Chang Thang"],
      Kargil: ["Kargil Urban", "Kargil Rural", "Zanskar", "Drass"],
    },
  },
}

// Comprehensive crop database with all categories
const cropDatabase = [
  // Cereals & Millets
  {
    crop: "Rice (Basmati)",
    basePrice: 4200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Punjab", "Haryana", "Uttar Pradesh", "West Bengal"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Rice (Common)",
    basePrice: 2800,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["West Bengal", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Wheat",
    basePrice: 2150,
    icon: "🌾",
    season: "Rabi",
    category: "Cereals & Millets",
    majorStates: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Maize (Corn)",
    basePrice: 1850,
    icon: "🌽",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Barley",
    basePrice: 1650,
    icon: "🌾",
    season: "Rabi",
    category: "Cereals & Millets",
    majorStates: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Haryana"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Sorghum (Jowar)",
    basePrice: 2800,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Pearl Millet (Bajra)",
    basePrice: 2200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Rajasthan", "Gujarat", "Haryana", "Uttar Pradesh"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Finger Millet (Ragi)",
    basePrice: 3200,
    icon: "🌾",
    season: "Kharif",
    category: "Cereals & Millets",
    majorStates: ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Odisha"],
    unit: "quintal",
    demand: "High",
  },

  // Pulses & Legumes
  {
    crop: "Chickpea (Gram)",
    basePrice: 4800,
    icon: "🫛",
    season: "Rabi",
    category: "Pulses & Legumes",
    majorStates: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Karnataka"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Green Gram (Moong)",
    basePrice: 6200,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Rajasthan", "Maharashtra", "Andhra Pradesh", "Karnataka"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Black Gram (Urad)",
    basePrice: 5800,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Madhya Pradesh", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Pigeon Pea (Arhar)",
    basePrice: 6200,
    icon: "🫛",
    season: "Kharif",
    category: "Pulses & Legumes",
    majorStates: ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Lentil (Masur)",
    basePrice: 5400,
    icon: "🫛",
    season: "Rabi",
    category: "Pulses & Legumes",
    majorStates: ["Uttar Pradesh", "Madhya Pradesh", "West Bengal", "Bihar"],
    unit: "quintal",
    demand: "High",
  },

  // Vegetables
  {
    crop: "Potato",
    basePrice: 1200,
    icon: "🥔",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Onion",
    basePrice: 1800,
    icon: "🧅",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Tomato",
    basePrice: 3500,
    icon: "🍅",
    season: "All Season",
    category: "Vegetables",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Cabbage",
    basePrice: 1500,
    icon: "🥬",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["West Bengal", "Odisha", "Bihar", "Assam"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Cauliflower",
    basePrice: 1800,
    icon: "🥦",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["West Bengal", "Uttar Pradesh", "Bihar", "Haryana"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Carrot",
    basePrice: 2200,
    icon: "🥕",
    season: "Rabi",
    category: "Vegetables",
    majorStates: ["Haryana", "Punjab", "Uttar Pradesh", "Tamil Nadu"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Brinjal (Eggplant)",
    basePrice: 2500,
    icon: "🍆",
    season: "All Season",
    category: "Vegetables",
    majorStates: ["West Bengal", "Odisha", "Karnataka", "Andhra Pradesh"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Okra (Ladyfinger)",
    basePrice: 3200,
    icon: "🌶️",
    season: "Kharif",
    category: "Vegetables",
    majorStates: ["Uttar Pradesh", "Bihar", "West Bengal", "Andhra Pradesh"],
    unit: "quintal",
    demand: "High",
  },

  // Fruits
  {
    crop: "Mango",
    basePrice: 4500,
    icon: "🥭",
    season: "Summer",
    category: "Fruits",
    majorStates: ["Uttar Pradesh", "Andhra Pradesh", "Karnataka", "Gujarat"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Banana",
    basePrice: 2800,
    icon: "🍌",
    season: "All Season",
    category: "Fruits",
    majorStates: ["Tamil Nadu", "Gujarat", "Maharashtra", "Andhra Pradesh"],
    unit: "quintal",
    demand: "Very High",
  },
  {
    crop: "Apple",
    basePrice: 8500,
    icon: "🍎",
    season: "Winter",
    category: "Fruits",
    majorStates: ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Grapes",
    basePrice: 4200,
    icon: "🍇",
    season: "Winter",
    category: "Fruits",
    majorStates: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Pomegranate",
    basePrice: 6500,
    icon: "🍎",
    season: "All Season",
    category: "Fruits",
    majorStates: ["Maharashtra", "Karnataka", "Gujarat", "Andhra Pradesh"],
    unit: "quintal",
    demand: "High",
  },

  // Cash & Industrial Crops
  {
    crop: "Sugarcane",
    basePrice: 350,
    icon: "🎋",
    season: "Annual",
    category: "Cash & Industrial",
    majorStates: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Cotton",
    basePrice: 6800,
    icon: "🌿",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Gujarat", "Maharashtra", "Telangana", "Karnataka"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Groundnut",
    basePrice: 5800,
    icon: "🥜",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Karnataka"],
    unit: "quintal",
    demand: "High",
  },
  {
    crop: "Mustard",
    basePrice: 5200,
    icon: "🌻",
    season: "Rabi",
    category: "Cash & Industrial",
    majorStates: ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"],
    unit: "quintal",
    demand: "Medium",
  },
  {
    crop: "Soybean",
    basePrice: 4500,
    icon: "🫘",
    season: "Kharif",
    category: "Cash & Industrial",
    majorStates: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"],
    unit: "quintal",
    demand: "Medium",
  },
]

// Generate realistic market data based on location
const generateMarketData = (state: string, city: string, district: string) => {
  const stateMultipliers: { [key: string]: number } = {
    Punjab: 1.12,
    Haryana: 1.1,
    Maharashtra: 1.08,
    Gujarat: 1.06,
    Karnataka: 1.04,
    "Tamil Nadu": 1.03,
    "Andhra Pradesh": 1.02,
    Telangana: 1.02,
    "Uttar Pradesh": 1.0,
    "Madhya Pradesh": 0.98,
    Rajasthan: 0.97,
    "West Bengal": 0.96,
    Bihar: 0.94,
    Odisha: 0.93,
    Jharkhand: 0.92,
    Chhattisgarh: 0.91,
    Assam: 0.9,
    Kerala: 1.05,
    Delhi: 1.15,
  }

  const cityMultipliers: { [key: string]: number } = {
    Mumbai: 1.15,
    Delhi: 1.12,
    Bangalore: 1.08,
    Chennai: 1.06,
    Pune: 1.04,
    Ahmedabad: 1.02,
    Surat: 1.01,
    Ludhiana: 1.03,
    Kolkata: 1.02,
    Hyderabad: 1.04,
    Jaipur: 1.01,
  }

  const stateMultiplier = stateMultipliers[state] || 1.0
  const cityMultiplier = cityMultipliers[city] || 1.0
  const districtVariation = Math.random() * 0.1 + 0.95 // 0.95 to 1.05

  return cropDatabase.map((item) => {
    const isLocalCrop = item.majorStates.includes(state)
    const localMultiplier = isLocalCrop ? 1.0 : 1.2

    const adjustedPrice = Math.round(
      item.basePrice * stateMultiplier * cityMultiplier * districtVariation * localMultiplier,
    )
    const previousPrice = Math.round(adjustedPrice * (0.9 + Math.random() * 0.2))
    const change = ((adjustedPrice - previousPrice) / previousPrice) * 100

    return {
      ...item,
      currentPrice: adjustedPrice,
      previousPrice,
      change: Number(change.toFixed(2)),
      trend: change > 0 ? "up" : "down",
      volume: `${Math.floor(Math.random() * 2000) + 500} tonnes`,
      lastUpdated: `${Math.floor(Math.random() * 60) + 1} mins ago`,
      bestBuyers: [
        `${city} APMC Market`,
        `${district} Wholesale Market`,
        `${state} Procurement Center`,
        "Local Traders Association",
        "Cooperative Society",
      ],
      transportCost: Math.floor(Math.random() * 200) + 50,
      qualityPremium: Math.floor(Math.random() * 300) + 100,
      isLocal: isLocalCrop,
      apmc: `${city} APMC`,
      marketType: isLocalCrop ? "Primary Market" : "Secondary Market",
    }
  })
}

// Enhanced selling opportunities with more variety
const generateSellingOpportunities = (state: string, city: string, district: string) => [
  {
    crop: "Tomato",
    buyer: "BigBasket Procurement Hub",
    price: 3800,
    quantity: "500 kg minimum",
    location: `${city} Collection Center - 5km`,
    deadline: "2 days",
    premium: "Organic Premium +15%",
    contact: "+91-9876543210",
    buyerType: "E-commerce",
    paymentTerms: "Immediate",
    qualityReq: "Grade A",
  },
  {
    crop: "Wheat",
    buyer: "Government Procurement (FCI)",
    price: 2200,
    quantity: "1000 kg minimum",
    location: `${district} Mandi - 12km`,
    deadline: "5 days",
    premium: "MSP Guaranteed",
    contact: "Mandi Officer",
    buyerType: "Government",
    paymentTerms: "7 days",
    qualityReq: "FAQ Grade",
  },
  {
    crop: "Cotton",
    buyer: "Textile Mills Consortium",
    price: 7200,
    quantity: "2000 kg minimum",
    location: `${state} Processing Unit - 25km`,
    deadline: "7 days",
    premium: "Quality Bonus +8%",
    contact: "+91-9876543211",
    buyerType: "Industrial",
    paymentTerms: "15 days",
    qualityReq: "Staple Length 28mm+",
  },
  {
    crop: "Rice (Basmati)",
    buyer: "Export House Pvt Ltd",
    price: 4500,
    quantity: "5000 kg minimum",
    location: `${city} Export Terminal - 30km`,
    deadline: "10 days",
    premium: "Export Quality +20%",
    contact: "+91-9876543212",
    buyerType: "Export",
    paymentTerms: "30 days",
    qualityReq: "1121 Variety",
  },
  {
    crop: "Onion",
    buyer: "Reliance Fresh Direct",
    price: 2000,
    quantity: "1000 kg minimum",
    location: `${city} Distribution Center - 8km`,
    deadline: "3 days",
    premium: "Retail Premium +12%",
    contact: "+91-9876543213",
    buyerType: "Retail Chain",
    paymentTerms: "5 days",
    qualityReq: "Medium Size, No Damage",
  },
  {
    crop: "Potato",
    buyer: "McCain Foods India",
    price: 1400,
    quantity: "10000 kg minimum",
    location: `${state} Processing Plant - 45km`,
    deadline: "15 days",
    premium: "Processing Grade +10%",
    contact: "+91-9876543214",
    buyerType: "Food Processing",
    paymentTerms: "21 days",
    qualityReq: "Specific Gravity 1.080+",
  },
  {
    crop: "Sugarcane",
    buyer: `${state} Sugar Mills Federation`,
    price: 380,
    quantity: "50000 kg minimum",
    location: `${district} Sugar Mill - 20km`,
    deadline: "Ongoing",
    premium: "Sucrose Content Bonus",
    contact: "Mill Manager",
    buyerType: "Cooperative",
    paymentTerms: "14 days",
    qualityReq: "12% Sucrose Min",
  },
  {
    crop: "Mango",
    buyer: "Tropicana Fruit Processing",
    price: 5000,
    quantity: "2000 kg minimum",
    location: `${city} Processing Unit - 15km`,
    deadline: "5 days",
    premium: "Pulp Quality +25%",
    contact: "+91-9876543215",
    buyerType: "Food Processing",
    paymentTerms: "10 days",
    qualityReq: "Alphonso/Totapuri Variety",
  },
  {
    crop: "Soybean",
    buyer: "Cargill India Pvt Ltd",
    price: 4800,
    quantity: "5000 kg minimum",
    location: `${state} Oil Mill - 35km`,
    deadline: "12 days",
    premium: "Oil Content Bonus +15%",
    contact: "+91-9876543216",
    buyerType: "Agribusiness",
    paymentTerms: "20 days",
    qualityReq: "18% Oil Content Min",
  },
  {
    crop: "Banana",
    buyer: "Mother Dairy Fruit & Vegetable",
    price: 3200,
    quantity: "1500 kg minimum",
    location: `${city} Cold Storage - 10km`,
    deadline: "4 days",
    premium: "Ripeness Premium +10%",
    contact: "+91-9876543217",
    buyerType: "Dairy Cooperative",
    paymentTerms: "7 days",
    qualityReq: "Green Mature, No Damage",
  },
]

const priceAlerts = [
  {
    crop: "Tomato",
    targetPrice: 4000,
    currentPrice: 3500,
    status: "watching",
    trend: "approaching",
  },
  {
    crop: "Wheat",
    targetPrice: 2300,
    currentPrice: 2150,
    status: "active",
    trend: "below",
  },
  {
    crop: "Cotton",
    targetPrice: 7000,
    currentPrice: 6800,
    status: "watching",
    trend: "stable",
  },
  {
    crop: "Rice (Basmati)",
    targetPrice: 4000,
    currentPrice: 4200,
    status: "triggered",
    trend: "above",
  },
]

// APMC and market information
const getLocalMarkets = (state: string, city: string) => [
  {
    name: `${city} APMC Market`,
    type: "APMC",
    distance: "2 km",
    timings: "6:00 AM - 2:00 PM",
    contact: "+91-9876543200",
    facilities: ["Weighing", "Storage", "Banking", "Transport"],
  },
  {
    name: `${city} Wholesale Market`,
    type: "Wholesale",
    distance: "5 km",
    timings: "5:00 AM - 12:00 PM",
    contact: "+91-9876543201",
    facilities: ["Cold Storage", "Grading", "Packaging"],
  },
  {
    name: `${state} Mandi Board Market`,
    type: "Regulated Market",
    distance: "8 km",
    timings: "6:30 AM - 1:30 PM",
    contact: "+91-9876543202",
    facilities: ["Auction Hall", "Quality Testing", "Price Display"],
  },
  {
    name: "Farmers Producer Organization Hub",
    type: "FPO",
    distance: "12 km",
    timings: "7:00 AM - 6:00 PM",
    contact: "+91-9876543203",
    facilities: ["Direct Sales", "Value Addition", "Export Facilitation"],
  },
  {
    name: "Cooperative Marketing Society",
    type: "Cooperative",
    distance: "15 km",
    timings: "8:00 AM - 5:00 PM",
    contact: "+91-9876543204",
    facilities: ["Member Benefits", "Input Supply", "Credit Facility"],
  },
]

export default function MarketInsights() {
  const [selectedState, setSelectedState] = useState("Punjab")
  const [selectedCity, setSelectedCity] = useState("Ludhiana")
  const [selectedDistrict, setSelectedDistrict] = useState("Ludhiana Urban")
  const [marketData, setMarketData] = useState<any[]>([])
  const [sellingOpportunities, setSellingOpportunities] = useState<any[]>([])
  const [localMarkets, setLocalMarkets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const availableCities = locationData[selectedState as keyof typeof locationData]?.cities || {}
  const availableDistricts = availableCities[selectedCity] || []

  useEffect(() => {
    refreshMarketData()
  }, [selectedState, selectedCity, selectedDistrict])

  const refreshMarketData = () => {
    setIsLoading(true)
    setTimeout(() => {
      const data = generateMarketData(selectedState, selectedCity, selectedDistrict)
      const opportunities = generateSellingOpportunities(selectedState, selectedCity, selectedDistrict)
      const markets = getLocalMarkets(selectedState, selectedCity)
      
      setMarketData(data)
      setSellingOpportunities(opportunities)
      setLocalMarkets(markets)
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1500)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    const cities = Object.keys(locationData[state as keyof typeof locationData]?.cities || {})
    if (cities.length > 0) {
      setSelectedCity(cities[0])
      const districts = locationData[state as keyof typeof locationData]?.cities[cities[0]] || []
      if (districts.length > 0) {
        setSelectedDistrict(districts[0])
      }
    }
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    const districts = availableCities[city] || []
    if (districts.length > 0) {
      setSelectedDistrict(districts[0])
    }
  }

  const getBestSellingPrice = (crop: any) => {
    const premium = crop.qualityPremium || 0
    const transport = crop.transportCost || 0
    return crop.currentPrice + premium - transport
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Insights 📊</h1>
            <p className="text-muted-foreground">Real-time selling prices and market opportunities for your location</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Price Alerts
            </Button>
            <Button onClick={refreshMarketData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Location Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-500" />
              Select Your Location
            </CardTitle>
            <CardDescription>Choose your state, city, and district for accurate local market prices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.keys(locationData).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableCities).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected Location:</strong> {selectedDistrict}, {selectedCity}, {selectedState}
              </p>
              <p className="text-xs text-blue-600 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Market Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Market Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Live Selling Prices - {selectedCity}
                  </span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Live Data
                  </Badge>
                </CardTitle>
                <CardDescription>Real-time prices for selling your crops in {selectedDistrict}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {marketData.slice(0, 12).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg flex items-center">
                                {item.crop}
                                {item.isLocal && (
                                  <Badge variant="outline" className="ml-2 text-xs text-green-600">
                                    Local
                                  </Badge>
                                )}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.marketType}
                                </Badge>
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Badge variant={item.trend === "up" ? "default" : "destructive"} className="text-xs">
                                  {item.trend === "up" ? (
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="mr-1 h-3 w-3" />
                                  )}
                                  {Math.abs(item.change)}%
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.demand} Demand
                                </Badge>
                                <span>{item.apmc}</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <span>Volume: {item.volume}</span>
                            <span>Season: {item.season}</span>
                            <span>Transport: ₹{item.transportCost}/quintal</span>
                            <span>Updated: {item.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600">₹{item.currentPrice.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">per quintal</div>
                          <div className="text-lg font-semibold text-blue-600 mt-1">
                            Best Price: ₹{getBestSellingPrice(item).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">(incl. premium - transport)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Selling Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-green-500" />
                  Active Selling Opportunities
                </CardTitle>
                <CardDescription>Direct buyers looking for crops in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellingOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-green-800 flex items-center">
                            {opportunity.crop} - {opportunity.buyer}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {opportunity.buyerType}
                            </Badge>
                          </h4>
                          <p className="text-sm text-green-600">{opportunity.premium}</p>
                          <p className="text-xs text-green-700">Quality: {opportunity.qualityReq}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-700">₹{opportunity.price.toLocaleString()}</div>
                          <div className="text-sm text-green-600">per quintal</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <br />
                          {opportunity.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <br />
                          {opportunity.location}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <br />
                          <Badge variant="outline" className="text-orange-600">
                            <Clock className="mr-1 h-3 w-3" />
                            {opportunity.deadline}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Payment:</span>
                          <br />
                          <span className="text-blue-600">{opportunity.paymentTerms}</span>
                        </div>
                        <div>
                          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                            <Phone className="mr-1 h-3 w-3" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Local Markets & APMCs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                  Local Markets & APMCs
                </CardTitle>
                <CardDescription>Nearby markets and trading centers in {selectedCity}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localMarkets.map((market, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center">
                            {market.name}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {market.type}
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="inline mr-1 h-3 w-3" />
                            {market.distance} • {market.timings}
                          </p>
                        </div>
                        <div className="text-right">
                          <Button size="sm" variant="outline">
                            <Phone className="mr-1 h-3 w-3" />
                            Call
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {market.facilities.map((facility: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                  Market Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Crops</span>
                    <span className="font-semibold">{marketData.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Trending Up</span>
                    <span className="font-semibold text-green-600">
                      {marketData.filter((item) => item.trend === "up").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Demand Crops</span>
                    <span className="font-semibold text-blue-600">
                      {marketData.filter((item) => item.demand === "High" || item.demand === "Very High").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Selling Opportunities</span>
                    <span className="font-semibold text-orange-600">{sellingOpportunities.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Markets</span>
                    <span className="font-semibold text-purple-600">{localMarkets.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Bell className="mr-2 h-5 w-5 text-orange-500" />
                  Your Price Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAlerts.map((alert, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{alert.crop}</span>
                        <Badge 
                          variant={alert.status === "triggered" ? "default" : alert.status === "active" ? "destructive" : "secondary"} 
                          className="text-xs"
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: ₹{alert.targetPrice} | Current: ₹{alert.currentPrice}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Status: {alert.trend}</div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  Add New Alert
                </Button>
              </CardContent>
            </Card>

            {/* Best Selling Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="mr-2 h-5 w-5 text-blue-500" />
                  Selling Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong className="text-blue-800">Quality Premium:</strong>
                    <p className="text-blue-700 mt-1">Grade A quality can fetch 10-15% premium prices</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <strong className="text-green-800">Direct Sales:</strong>
                    <p className="text-green-700 mt-1">Sell directly to processors to avoid middleman costs</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <strong className="text-orange-800">Timing:</strong>
                    <p className="text-orange-700 mt-1">Early morning sales often get better prices</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <strong className="text-purple-800">APMC Benefits:</strong>
                    <p className="text-purple-700 mt-1">Use APMC markets for transparent price discovery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport & Logistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transport Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Local Mandi (0-10km)</span>
                    <span className="font-semibold">₹50-100/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>District Market (10-50km)</span>
                    <span className="font-semibold">₹100-200/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Market (50-200km)</span>
                    <span className="font-semibold">₹200-400/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interstate (200km+)</span>
                    <span className="font-semibold">₹400-800/quintal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Important Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>APMC Secretary</span>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Committee</span>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Transport Union</span>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>FPO Representative</span>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
