import axios from 'axios';

// ==================== CONFIGURATION ====================
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '264c0472ada293e018319ced731dd729';
const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY || '7b9fcbd5a63249da86d184844250211';
const WEATHER_PROVIDER = import.meta.env.VITE_WEATHER_PROVIDER || 'openweather';

// API Base URLs
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

// ==================== CACHE HELPERS ====================
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached data for:', key);
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// ==================== OPENWEATHERMAP API ====================
const openWeatherAPI = {
  // Get current weather by city
  getWeatherByCity: async (city, units = 'metric') => {
    const cacheKey = `ow-weather-${city}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units
        }
      });
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'City not found');
    }
  },

  // Get weather by coordinates
  getWeatherByCoords: async (lat, lon, units = 'metric') => {
    const cacheKey = `ow-weather-${lat}-${lon}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units
        }
      });
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch weather data');
    }
  },

  // Get 5-day forecast by city
  getForecast: async (city, units = 'metric') => {
    const cacheKey = `ow-forecast-${city}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units
        }
      });
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch forecast data');
    }
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat, lon, units = 'metric') => {
    const cacheKey = `ow-forecast-${lat}-${lon}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units
        }
      });
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch forecast data');
    }
  },

  // Get air pollution data
  getAirPollution: async (lat, lon) => {
    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Air pollution data unavailable');
      return null;
    }
  }
};

// ==================== WEATHERAPI.COM API ====================
const weatherAPIcom = {
  // Get current weather by city
  getWeatherByCity: async (city, units = 'metric') => {
    const cacheKey = `wa-weather-${city}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHERAPI_BASE_URL}/current.json`, {
        params: {
          key: WEATHERAPI_KEY,
          q: city,
          aqi: 'yes'
        }
      });
      const transformed = transformWeatherAPIResponse(response.data, units);
      setCachedData(cacheKey, transformed);
      return transformed;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'City not found');
    }
  },

  // Get weather by coordinates
  getWeatherByCoords: async (lat, lon, units = 'metric') => {
    const cacheKey = `wa-weather-${lat}-${lon}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHERAPI_BASE_URL}/current.json`, {
        params: {
          key: WEATHERAPI_KEY,
          q: `${lat},${lon}`,
          aqi: 'yes'
        }
      });
      const transformed = transformWeatherAPIResponse(response.data, units);
      setCachedData(cacheKey, transformed);
      return transformed;
    } catch (error) {
      throw new Error('Unable to fetch weather data');
    }
  },

  // Get forecast
  getForecast: async (city, units = 'metric') => {
    const cacheKey = `wa-forecast-${city}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHERAPI_KEY,
          q: city,
          days: 5,
          aqi: 'yes',
          alerts: 'yes'
        }
      });
      const transformed = transformWeatherAPIForecast(response.data, units);
      setCachedData(cacheKey, transformed);
      return transformed;
    } catch (error) {
      throw new Error('Unable to fetch forecast data');
    }
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat, lon, units = 'metric') => {
    const cacheKey = `wa-forecast-${lat}-${lon}-${units}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHERAPI_KEY,
          q: `${lat},${lon}`,
          days: 5,
          aqi: 'yes',
          alerts: 'yes'
        }
      });
      const transformed = transformWeatherAPIForecast(response.data, units);
      setCachedData(cacheKey, transformed);
      return transformed;
    } catch (error) {
      throw new Error('Unable to fetch forecast data');
    }
  },

  getAirPollution: async (lat, lon) => {
    // WeatherAPI includes AQI in weather calls
    return null;
  }
};

// ==================== TRANSFORM WEATHERAPI TO OPENWEATHER FORMAT ====================
const transformWeatherAPIResponse = (data, units) => {
  const isMetric = units === 'metric';
  const temp = isMetric ? data.current.temp_c : data.current.temp_f;
  const feelsLike = isMetric ? data.current.feelslike_c : data.current.feelslike_f;
  const windSpeed = isMetric ? data.current.wind_kph / 3.6 : data.current.wind_mph; // Convert to m/s for metric

  // Get icon code from WeatherAPI and map to OpenWeather format
  const weatherCode = data.current.condition.code;
  const isDay = data.current.is_day === 1;
  const iconCode = mapWeatherAPIIconToOpenWeather(weatherCode, isDay);

  // Calculate sunrise/sunset (WeatherAPI provides this in forecast, use defaults)
  const now = Math.floor(Date.now() / 1000);
  const sunrise = now - (3 * 3600); // 3 hours ago
  const sunset = now + (3 * 3600); // 3 hours from now

  return {
    coord: {
      lon: data.location.lon,
      lat: data.location.lat
    },
    weather: [{
      id: weatherCode,
      main: data.current.condition.text.split(' ')[0], // First word as main
      description: data.current.condition.text.toLowerCase(),
      icon: iconCode
    }],
    base: "stations",
    main: {
      temp: temp,
      feels_like: feelsLike,
      temp_min: temp - 2, // Approximation
      temp_max: temp + 2, // Approximation
      pressure: data.current.pressure_mb,
      humidity: data.current.humidity
    },
    visibility: data.current.vis_km * 1000, // Convert to meters
    wind: {
      speed: windSpeed,
      deg: data.current.wind_degree,
      gust: isMetric ? data.current.gust_kph / 3.6 : data.current.gust_mph
    },
    clouds: {
      all: data.current.cloud
    },
    dt: data.current.last_updated_epoch,
    sys: {
      country: data.location.country,
      sunrise: sunrise,
      sunset: sunset
    },
    timezone: 0,
    id: 0,
    name: data.location.name,
    cod: 200
  };
};

const transformWeatherAPIForecast = (data, units) => {
  const isMetric = units === 'metric';
  
  const list = [];
  
  // Transform forecast data
  data.forecast.forecastday.forEach(day => {
    day.hour.forEach(hour => {
      const temp = isMetric ? hour.temp_c : hour.temp_f;
      const feelsLike = isMetric ? hour.feelslike_c : hour.feelslike_f;
      const windSpeed = isMetric ? hour.wind_kph / 3.6 : hour.wind_mph;
      
      list.push({
        dt: hour.time_epoch,
        main: {
          temp: temp,
          feels_like: feelsLike,
          temp_min: temp - 1,
          temp_max: temp + 1,
          pressure: hour.pressure_mb,
          humidity: hour.humidity
        },
        weather: [{
          id: hour.condition.code,
          main: hour.condition.text.split(' ')[0],
          description: hour.condition.text.toLowerCase(),
          icon: mapWeatherAPIIconToOpenWeather(hour.condition.code, hour.is_day === 1)
        }],
        clouds: {
          all: hour.cloud
        },
        wind: {
          speed: windSpeed,
          deg: hour.wind_degree
        },
        visibility: hour.vis_km * 1000,
        pop: hour.chance_of_rain / 100,
        dt_txt: hour.time
      });
    });
  });

  return {
    cod: "200",
    message: 0,
    cnt: list.length,
    list: list,
    city: {
      id: 0,
      name: data.location.name,
      coord: {
        lat: data.location.lat,
        lon: data.location.lon
      },
      country: data.location.country,
      timezone: 0
    }
  };
};

// Map WeatherAPI condition codes to OpenWeather icon codes
const mapWeatherAPIIconToOpenWeather = (code, isDay) => {
  const dayNight = isDay ? 'd' : 'n';
  
  const mapping = {
    1000: `01${dayNight}`, // Sunny/Clear
    1003: `02${dayNight}`, // Partly cloudy
    1006: `03${dayNight}`, // Cloudy
    1009: `04${dayNight}`, // Overcast
    1030: `50${dayNight}`, // Mist
    1063: `10${dayNight}`, // Patchy rain possible
    1066: `13${dayNight}`, // Patchy snow possible
    1069: `13${dayNight}`, // Patchy sleet possible
    1072: `13${dayNight}`, // Patchy freezing drizzle
    1087: `11${dayNight}`, // Thundery outbreaks possible
    1114: `13${dayNight}`, // Blowing snow
    1117: `13${dayNight}`, // Blizzard
    1135: `50${dayNight}`, // Fog
    1147: `50${dayNight}`, // Freezing fog
    1150: `09${dayNight}`, // Patchy light drizzle
    1153: `09${dayNight}`, // Light drizzle
    1168: `09${dayNight}`, // Freezing drizzle
    1171: `09${dayNight}`, // Heavy freezing drizzle
    1180: `10${dayNight}`, // Patchy light rain
    1183: `10${dayNight}`, // Light rain
    1186: `10${dayNight}`, // Moderate rain at times
    1189: `10${dayNight}`, // Moderate rain
    1192: `10${dayNight}`, // Heavy rain at times
    1195: `10${dayNight}`, // Heavy rain
    1198: `10${dayNight}`, // Light freezing rain
    1201: `10${dayNight}`, // Moderate or heavy freezing rain
    1204: `13${dayNight}`, // Light sleet
    1207: `13${dayNight}`, // Moderate or heavy sleet
    1210: `13${dayNight}`, // Patchy light snow
    1213: `13${dayNight}`, // Light snow
    1216: `13${dayNight}`, // Patchy moderate snow
    1219: `13${dayNight}`, // Moderate snow
    1222: `13${dayNight}`, // Patchy heavy snow
    1225: `13${dayNight}`, // Heavy snow
    1237: `13${dayNight}`, // Ice pellets
    1240: `09${dayNight}`, // Light rain shower
    1243: `09${dayNight}`, // Moderate or heavy rain shower
    1246: `09${dayNight}`, // Torrential rain shower
    1249: `13${dayNight}`, // Light sleet showers
    1252: `13${dayNight}`, // Moderate or heavy sleet showers
    1255: `13${dayNight}`, // Light snow showers
    1258: `13${dayNight}`, // Moderate or heavy snow showers
    1261: `13${dayNight}`, // Light showers of ice pellets
    1264: `13${dayNight}`, // Moderate or heavy showers of ice pellets
    1273: `11${dayNight}`, // Patchy light rain with thunder
    1276: `11${dayNight}`, // Moderate or heavy rain with thunder
    1279: `11${dayNight}`, // Patchy light snow with thunder
    1282: `11${dayNight}`, // Moderate or heavy snow with thunder
  };

  return mapping[code] || `01${dayNight}`;
};

// ==================== UNIFIED API INTERFACE ====================
export const weatherAPI = {
  getWeatherByCity: async (city, units = 'metric') => {
    console.log(`🌦️ Fetching weather for ${city} using ${WEATHER_PROVIDER}`);
    
    if (WEATHER_PROVIDER === 'weatherapi') {
      return await weatherAPIcom.getWeatherByCity(city, units);
    }
    return await openWeatherAPI.getWeatherByCity(city, units);
  },

  getWeatherByCoords: async (lat, lon, units = 'metric') => {
    console.log(`🌦️ Fetching weather for ${lat},${lon} using ${WEATHER_PROVIDER}`);
    
    if (WEATHER_PROVIDER === 'weatherapi') {
      return await weatherAPIcom.getWeatherByCoords(lat, lon, units);
    }
    return await openWeatherAPI.getWeatherByCoords(lat, lon, units);
  },

  getForecast: async (city, units = 'metric') => {
    console.log(`📅 Fetching forecast for ${city} using ${WEATHER_PROVIDER}`);
    
    if (WEATHER_PROVIDER === 'weatherapi') {
      return await weatherAPIcom.getForecast(city, units);
    }
    return await openWeatherAPI.getForecast(city, units);
  },

  getForecastByCoords: async (lat, lon, units = 'metric') => {
    console.log(`📅 Fetching forecast for ${lat},${lon} using ${WEATHER_PROVIDER}`);
    
    if (WEATHER_PROVIDER === 'weatherapi') {
      return await weatherAPIcom.getForecastByCoords(lat, lon, units);
    }
    return await openWeatherAPI.getForecastByCoords(lat, lon, units);
  },

  getAirPollution: async (lat, lon) => {
    if (WEATHER_PROVIDER === 'weatherapi') {
      return await weatherAPIcom.getAirPollution(lat, lon);
    }
    return await openWeatherAPI.getAirPollution(lat, lon);
  },

  // Clear cache
  clearCache: () => {
    cache.clear();
    console.log('🗑️ Cache cleared');
  },

  // Get current provider
  getProvider: () => WEATHER_PROVIDER
};

// Export individual APIs for direct access if needed
export { openWeatherAPI, weatherAPIcom };

// Test API connection
export const testAPI = async () => {
  try {
    console.log('🧪 Testing API connection...');
    const data = await weatherAPI.getWeatherByCity('London');
    console.log('✅ API Test Successful!', data);
    return true;
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return false;
  }
};