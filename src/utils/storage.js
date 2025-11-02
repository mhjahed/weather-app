const FAVORITES_KEY = 'weather_favorites';
const UNITS_KEY = 'weather_units';
const LAST_LOCATION_KEY = 'last_location';

export const storage = {
  // Favorites
  getFavorites: () => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  addFavorite: (location) => {
    const favorites = storage.getFavorites();
    if (!favorites.find(fav => fav.name === location.name)) {
      favorites.push(location);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  },

  removeFavorite: (locationName) => {
    const favorites = storage.getFavorites();
    const filtered = favorites.filter(fav => fav.name !== locationName);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  },

  isFavorite: (locationName) => {
    const favorites = storage.getFavorites();
    return favorites.some(fav => fav.name === locationName);
  },

  // Units
  getUnits: () => {
    return localStorage.getItem(UNITS_KEY) || 'metric';
  },

  setUnits: (units) => {
    localStorage.setItem(UNITS_KEY, units);
  },

  // Last Location
  getLastLocation: () => {
    const location = localStorage.getItem(LAST_LOCATION_KEY);
    return location ? JSON.parse(location) : null;
  },

  setLastLocation: (location) => {
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
  }
};