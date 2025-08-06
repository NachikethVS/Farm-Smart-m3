import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const type = searchParams.get('type') || 'current'

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Try to get API key from environment variables
    const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    
    if (!API_KEY || API_KEY === "demo_key") {
      // Return mock data if no API key is available
      console.log("No OpenWeather API key found, returning mock data")
      return NextResponse.json(generateMockWeatherData(type))
    }
    
    let apiUrl = ""
    if (type === 'current') {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    } else if (type === 'forecast') {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    }

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FarmingApp/1.0'
      }
    })
    
    if (!response.ok) {
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`)
      // Return mock data on API error
      return NextResponse.json(generateMockWeatherData(type))
    }

    const data = await response.json()
    
    // Check if the API returned an error
    if (data.cod && data.cod !== 200 && data.cod !== "200") {
      console.error("OpenWeather API returned error:", data.message)
      return NextResponse.json(generateMockWeatherData(type))
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error("Weather API error:", error)
    
    // Return mock data as fallback
    return NextResponse.json(generateMockWeatherData(type))
  }
}

function generateMockWeatherData(type: string) {
  const baseTemp = 28
  const tempVariation = Math.random() * 8 - 4

  if (type === 'current') {
    return {
      main: {
        temp: Math.round(baseTemp + tempVariation),
        feels_like: Math.round(baseTemp + tempVariation + 3),
        humidity: Math.round(60 + Math.random() * 20),
        pressure: 1013 + Math.round(Math.random() * 20 - 10)
      },
      weather: [{
        main: ["Clear", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
        description: ["clear sky", "partly cloudy", "overcast clouds"][Math.floor(Math.random() * 3)],
        icon: ["01d", "02d", "03d"][Math.floor(Math.random() * 3)]
      }],
      wind: {
        speed: Math.round((2 + Math.random() * 6) * 10) / 10, // 2-8 m/s
        deg: Math.round(Math.random() * 360)
      },
      visibility: 10000,
      sys: {
        sunrise: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        sunset: Math.floor(Date.now() / 1000) + 7200   // 2 hours from now
      },
      cod: 200
    }
  } else {
    // Generate 5-day forecast (40 entries, 8 per day)
    const forecastList = []
    const now = Date.now() / 1000
    
    for (let i = 0; i < 40; i++) {
      const timestamp = now + (i * 3 * 3600) // Every 3 hours
      const dayTemp = baseTemp + Math.sin(i * 0.5) * 4 + Math.random() * 4 - 2
      
      forecastList.push({
        dt: timestamp,
        main: {
          temp: Math.round(dayTemp),
          temp_max: Math.round(dayTemp + 2 + Math.random() * 2),
          temp_min: Math.round(dayTemp - 3 - Math.random() * 2),
          humidity: Math.round(50 + Math.random() * 30)
        },
        weather: [{
          main: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)],
          description: ["clear sky", "scattered clouds", "light rain"][Math.floor(Math.random() * 3)],
          icon: ["01d", "02d", "10d"][Math.floor(Math.random() * 3)]
        }],
        wind: {
          speed: Math.round((2 + Math.random() * 8) * 10) / 10
        },
        pop: Math.round(Math.random() * 100) / 100 // Probability of precipitation
      })
    }

    return {
      list: forecastList,
      cod: "200"
    }
  }
}
