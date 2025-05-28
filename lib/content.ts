// Fetch news from API or return mock data
export async function fetchNews(category = "") {
  try {
    // If NEWS_API_KEY is available, use real API
    if (process.env.NEWS_API_KEY) {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=et&category=${category}&apiKey=${process.env.NEWS_API_KEY}`,
      )
      const data = await response.json()

      return (
        data.articles?.map((article: any) => ({
          title: article.title,
          description: article.description || "No description available",
          url: article.url,
          imageUrl: article.urlToImage,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error fetching news from API:", error)
  }

  // Return mock data for demonstration
  return [
    {
      title: "Ethiopia Announces New Economic Reforms to Boost Growth",
      description:
        "The Ethiopian government has announced a comprehensive series of economic reforms aimed at boosting growth and attracting foreign investment to the country.",
      url: "https://example.com/news/economic-reforms",
      imageUrl: "https://example.com/images/ethiopia-economy.jpg",
    },
    {
      title: "Ethiopian Airlines Expands Fleet with 10 New Aircraft",
      description:
        "Ethiopian Airlines has added ten new Boeing 737 MAX aircraft to its fleet as part of its ambitious expansion strategy for 2024.",
      url: "https://example.com/news/ethiopian-airlines",
      imageUrl: "https://example.com/images/ethiopian-airlines.jpg",
    },
    {
      title: "Addis Ababa Hosts Major African Union Summit",
      description:
        "The African Union headquarters in Addis Ababa is hosting a major summit focusing on continental trade and economic cooperation.",
      url: "https://example.com/news/au-summit",
      imageUrl: "https://example.com/images/au-summit.jpg",
    },
    {
      title: "Ethiopia's Coffee Export Reaches Record High",
      description:
        "Ethiopian coffee exports have reached a record high this year, contributing significantly to the country's foreign exchange earnings.",
      url: "https://example.com/news/coffee-export",
      imageUrl: "https://example.com/images/coffee-export.jpg",
    },
    {
      title: "New Hydroelectric Dam Project Launched in Ethiopia",
      description:
        "A new hydroelectric dam project has been launched in the Oromia region, expected to increase the country's power generation capacity.",
      url: "https://example.com/news/hydroelectric-dam",
      imageUrl: "https://example.com/images/dam-project.jpg",
    },
  ]
}

// Fetch memes
export async function fetchMemes() {
  // Return mock Ethiopian memes for demonstration
  return [
    {
      imageUrl: "https://via.placeholder.com/500x400/FF6B6B/FFFFFF?text=Ethiopian+Meme+1",
      caption: "When you try to explain Ethiopian time to a foreigner 😂",
    },
    {
      imageUrl: "https://via.placeholder.com/500x400/4ECDC4/FFFFFF?text=Ethiopian+Meme+2",
      caption: "Me trying to eat injera with a fork for the first time",
    },
    {
      imageUrl: "https://via.placeholder.com/500x400/45B7D1/FFFFFF?text=Ethiopian+Meme+3",
      caption: "When someone says they don't like Ethiopian coffee ☕",
    },
    {
      imageUrl: "https://via.placeholder.com/500x400/96CEB4/FFFFFF?text=Ethiopian+Meme+4",
      caption: "Ethiopian mothers when you haven't eaten in 2 hours",
    },
    {
      imageUrl: "https://via.placeholder.com/500x400/FFEAA7/000000?text=Ethiopian+Meme+5",
      caption: "When you hear Ethiopian music and start dancing automatically 🎵",
    },
  ]
}

// Fetch videos
export async function fetchVideos(category = "") {
  try {
    // If YOUTUBE_API_KEY is available, use real API
    if (process.env.YOUTUBE_API_KEY) {
      const query = `Ethiopia ${category}`.trim()
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`,
      )
      const data = await response.json()

      return (
        data.items?.map((item: any) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnailUrl: item.snippet.thumbnails.high.url,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error fetching videos from API:", error)
  }

  // Return mock data for demonstration
  return [
    {
      title: "Traditional Ethiopian Coffee Ceremony - Complete Guide",
      description:
        "Learn about the traditional Ethiopian coffee ceremony, its cultural significance, and step-by-step process.",
      videoUrl: "https://www.youtube.com/watch?v=example1",
      thumbnailUrl: "https://via.placeholder.com/480x360/8B4513/FFFFFF?text=Coffee+Ceremony",
    },
    {
      title: "Exploring Addis Ababa - Ethiopia's Vibrant Capital",
      description: "A comprehensive tour of Addis Ababa showcasing its culture, food, and attractions.",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      thumbnailUrl: "https://via.placeholder.com/480x360/228B22/FFFFFF?text=Addis+Ababa",
    },
    {
      title: "Ethiopian Traditional Music and Dance Performance",
      description: "Experience the rich musical heritage of Ethiopia through traditional performances.",
      videoUrl: "https://www.youtube.com/watch?v=example3",
      thumbnailUrl: "https://via.placeholder.com/480x360/FF4500/FFFFFF?text=Music+Dance",
    },
    {
      title: "Lalibela Rock Churches - UNESCO World Heritage Site",
      description:
        "Discover the magnificent rock-hewn churches of Lalibela, one of Ethiopia's most famous attractions.",
      videoUrl: "https://www.youtube.com/watch?v=example4",
      thumbnailUrl: "https://via.placeholder.com/480x360/8B4513/FFFFFF?text=Lalibela",
    },
    {
      title: "Ethiopian Cuisine - Injera and Traditional Dishes",
      description: "Learn about Ethiopian cuisine, including how injera is made and popular traditional dishes.",
      videoUrl: "https://www.youtube.com/watch?v=example5",
      thumbnailUrl: "https://via.placeholder.com/480x360/DC143C/FFFFFF?text=Ethiopian+Food",
    },
  ]
}

// Fetch weather
export async function fetchWeather(city = "Addis Ababa") {
  try {
    // If WEATHER_API_KEY is available, use real API
    if (process.env.WEATHER_API_KEY) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
      )
      const data = await response.json()

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      }
    }
  } catch (error) {
    console.error("Error fetching weather from API:", error)
  }

  // Return mock data for demonstration
  const mockWeatherData: { [key: string]: any } = {
    "addis ababa": {
      temperature: 22,
      condition: "Partly cloudy",
      humidity: 65,
      windSpeed: 8,
    },
    "dire dawa": {
      temperature: 28,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 12,
    },
    mekelle: {
      temperature: 25,
      condition: "Clear sky",
      humidity: 55,
      windSpeed: 6,
    },
    "bahir dar": {
      temperature: 24,
      condition: "Light rain",
      humidity: 75,
      windSpeed: 10,
    },
  }

  const cityKey = city.toLowerCase()
  return mockWeatherData[cityKey] || mockWeatherData["addis ababa"]
}

// Fetch sports updates
export async function fetchSports(category = "") {
  // Return mock Ethiopian sports data for demonstration
  return [
    {
      title: "Ethiopian Premier League: St. George FC Wins Championship",
      description:
        "St. George FC has clinched the Ethiopian Premier League title for the 30th time after a decisive 2-1 victory over Ethiopia Coffee FC in the final match of the season.",
      url: "https://example.com/sports/premier-league",
    },
    {
      title: "Ethiopian Athletes Dominate Berlin Marathon",
      description:
        "Ethiopian runners secured the top three positions in both men's and women's categories at the prestigious Berlin Marathon, continuing the country's dominance in long-distance running.",
      url: "https://example.com/sports/berlin-marathon",
    },
    {
      title: "Haile Gebrselassie Opens New Athletics Training Center",
      description:
        "Ethiopian running legend Haile Gebrselassie has inaugurated a state-of-the-art athletics training center in Addis Ababa to nurture the next generation of Ethiopian runners.",
      url: "https://example.com/sports/training-center",
    },
    {
      title: "Ethiopian National Football Team Qualifies for AFCON",
      description:
        "The Ethiopian national football team has secured qualification for the Africa Cup of Nations after a thrilling 1-0 victory over their regional rivals.",
      url: "https://example.com/sports/afcon-qualification",
    },
    {
      title: "Young Ethiopian Boxer Wins International Championship",
      description:
        "19-year-old Ethiopian boxer Dawit Tekle has won the international youth boxing championship, bringing pride to the nation and promising a bright future for Ethiopian boxing.",
      url: "https://example.com/sports/boxing-championship",
    },
  ]
}

// Fetch social media trends
export async function fetchSocialMedia() {
  try {
    // If TWITTER_BEARER_TOKEN is available, use real API
    if (process.env.TWITTER_BEARER_TOKEN) {
      // Note: Twitter API v2 requires different endpoint and authentication
      // This is a simplified example
      const response = await fetch("https://api.twitter.com/2/trends/by/woeid/1313479", {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      })
      const data = await response.json()

      return (
        data.data?.map((trend: any) => ({
          topic: trend.trend,
          count: trend.tweet_count || 0,
          url: `https://twitter.com/search?q=${encodeURIComponent(trend.trend)}`,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error fetching social media trends from API:", error)
  }

  // Return mock Ethiopian social media trends for demonstration
  return [
    { topic: "#EthiopianCuisine", count: 15420, url: "https://twitter.com/hashtag/EthiopianCuisine" },
    { topic: "#AddisAbaba", count: 12350, url: "https://twitter.com/hashtag/AddisAbaba" },
    { topic: "#EthiopianMusic", count: 9870, url: "https://twitter.com/hashtag/EthiopianMusic" },
    { topic: "#Timket2024", count: 8640, url: "https://twitter.com/hashtag/Timket2024" },
    { topic: "#EthiopianAirlines", count: 7230, url: "https://twitter.com/hashtag/EthiopianAirlines" },
    { topic: "#EthiopianCoffee", count: 6890, url: "https://twitter.com/hashtag/EthiopianCoffee" },
    { topic: "#Lalibela", count: 5670, url: "https://twitter.com/hashtag/Lalibela" },
    { topic: "#EthiopianCulture", count: 4950, url: "https://twitter.com/hashtag/EthiopianCulture" },
    { topic: "#VisitEthiopia", count: 4320, url: "https://twitter.com/hashtag/VisitEthiopia" },
    { topic: "#EthiopianFashion", count: 3780, url: "https://twitter.com/hashtag/EthiopianFashion" },
  ]
}
