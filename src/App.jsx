import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLocationArrow, FaSync } from 'react-icons/fa';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { storage } from './utils/storage';
import { getBackgroundClass, isNightTime } from './utils/helpers';
import { testAPI, weatherAPI } from './utils/api'; // ✅ Added testAPI import

// Components
import SearchBar from './components/SearchBar';
import VoiceSearch from './components/VoiceSearch';
import UnitToggle from './components/UnitToggle';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import ForecastCard from './components/ForecastCard';
import FavoriteLocations from './components/FavoriteLocations';
import WeatherAlerts from './components/WeatherAlerts';
import ShareCard from './components/ShareCard';

import './styles/weather.css';

function App() {
  const { location: geoLocation, error: geoError, loading: geoLoading } = useGeolocation();
  const [initialLocation, setInitialLocation] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const {
    weather,
    forecast,
    loading,
    error,
    units,
    toggleUnits,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    refresh
  } = useWeather(initialLocation);

  // ✅ TEST API ON COMPONENT MOUNT
  useEffect(() => {
    console.log('🧪 Testing Weather API...');
    console.log('📡 Current Provider:', weatherAPI.getProvider());
    
    testAPI().then(success => {
      if (success) {
        console.log('✅ Weather API is working perfectly!');
      } else {
        console.log('⚠️ API test failed. Please check your API keys in .env file');
        console.log('💡 Make sure to restart dev server after editing .env');
      }
    });
  }, []); // Run only once on mount

  // Initialize with geolocation or last location
  useEffect(() => {
    const lastLocation = storage.getLastLocation();
  
    if (geoLocation && !geoLoading) {
      setInitialLocation({ type: 'coords', ...geoLocation });
    } else if (lastLocation) {
      setInitialLocation(lastLocation);
    } else if (!geoLoading && geoError) {
      // Default to a city if geolocation fails
      setInitialLocation({ type: 'city', name: 'London' });
    }
  }, [geoLocation, geoLoading, geoError]);

  const handleSearch = (city) => {
    fetchWeatherByCity(city);
  };

  const handleCurrentLocation = () => {
    if (geoLocation) {
      fetchWeatherByCoords(geoLocation.lat, geoLocation.lon);
    }
  };

  const handleToggleFavorite = () => {
    if (weather) {
      const location = { name: weather.name, country: weather.sys.country };
      if (storage.isFavorite(weather.name)) {
        storage.removeFavorite(weather.name);
      } else {
        storage.addFavorite(location);
      }
      refresh(); // Trigger re-render
    }
  };

  const backgroundClass = weather 
    ? getBackgroundClass(
        weather.weather[0].main,
        isNightTime(weather.dt, weather.sys.sunrise, weather.sys.sunset)
      )
    : 'bg-default';

  return (
    <div className={`app-container ${backgroundClass}`}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-4"
        >
          <h1 className="display-4 fw-bold mb-2">☀️ Weather App</h1>
          <p className="lead">Get real-time weather updates</p>
          {/* ✅ Show current API provider */}
          <small className="badge bg-info">
            Using: {weatherAPI.getProvider().toUpperCase()}
          </small>
        </motion.div>

        {/* Search & Controls */}
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow border-0 p-3">
              <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
                <div className="flex-grow-1">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <VoiceSearch onSearch={handleSearch} />
              </div>
              
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <UnitToggle units={units} onToggle={toggleUnits} />
                
                <div className="btn-group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCurrentLocation}
                    className="btn btn-success"
                    disabled={!geoLocation}
                  >
                    <FaLocationArrow className="me-2" />
                    Current Location
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={refresh}
                    className="btn btn-info"
                    disabled={!weather}
                  >
                    <FaSync />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-5"
            >
              <div className="loader mx-auto"></div>
              <p className="text-white mt-3">Loading weather data...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-danger text-center"
          >
            <h5>⚠️ Error</h5>
            <p className="mb-0">{error}</p>
            {/* ✅ Show helpful error message */}
            <small className="d-block mt-2">
              💡 Tip: Check browser console for detailed error information
            </small>
          </motion.div>
        )}

        {/* Weather Content */}
        {weather && forecast && !loading && (
          <div className="row">
            {/* Main Column */}
            <div className="col-lg-8">
              {/* Favorites */}
              <FavoriteLocations onSelectLocation={handleSearch} />

              {/* Weather Alerts */}
              <WeatherAlerts weather={weather} />

              {/* Current Weather */}
              <CurrentWeather
                weather={weather}
                units={units}
                isFavorite={storage.isFavorite(weather.name)}
                onToggleFavorite={handleToggleFavorite}
                onShare={() => setShowShare(!showShare)}
              />

              {/* Share Options */}
              <AnimatePresence>
                {showShare && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ShareCard weather={weather} units={units} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Weather Details */}
              <WeatherDetails weather={weather} units={units} />

              {/* Hourly Forecast */}
              <HourlyForecast forecast={forecast} units={units} />
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">
              {/* 5-Day Forecast */}
              <ForecastCard forecast={forecast} units={units} />
            </div>
          </div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white mt-5 pb-4"
        >
          <p className="mb-0">
            Powered by {weatherAPI.getProvider() === 'openweather' ? 'OpenWeatherMap' : 'WeatherAPI'} | Made by JAHED using React & Bootstrap
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;