import { useState, useEffect, useCallback } from 'react';
import { weatherAPI } from '../utils/api';
import { storage } from '../utils/storage';

export const useWeather = (initialLocation) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState(storage.getUnits());

  const fetchWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherAPI.getWeatherByCity(city, units),
        weatherAPI.getForecast(city, units)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      storage.setLastLocation({ type: 'city', name: city });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [units]);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherAPI.getWeatherByCoords(lat, lon, units),
        weatherAPI.getForecastByCoords(lat, lon, units)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      storage.setLastLocation({ type: 'coords', lat, lon });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [units]);

  const toggleUnits = useCallback(() => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    storage.setUnits(newUnits);
  }, [units]);

  useEffect(() => {
    if (initialLocation) {
      if (initialLocation.type === 'coords') {
        fetchWeatherByCoords(initialLocation.lat, initialLocation.lon);
      } else {
        fetchWeatherByCity(initialLocation.name);
      }
    }
  }, [initialLocation, fetchWeatherByCity, fetchWeatherByCoords]);

  return {
    weather,
    forecast,
    loading,
    error,
    units,
    toggleUnits,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    refresh: () => {
      if (weather) {
        fetchWeatherByCoords(weather.coord.lat, weather.coord.lon);
      }
    }
  };
};