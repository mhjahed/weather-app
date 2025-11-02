export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

export const getBackgroundClass = (weather, isNight) => {
  const weatherMain = weather?.toLowerCase();
  
  if (isNight) return 'bg-night';
  
  switch (weatherMain) {
    case 'clear':
      return 'bg-sunny';
    case 'clouds':
      return 'bg-cloudy';
    case 'rain':
    case 'drizzle':
      return 'bg-rainy';
    case 'thunderstorm':
      return 'bg-stormy';
    case 'snow':
      return 'bg-snowy';
    case 'mist':
    case 'fog':
      return 'bg-foggy';
    default:
      return 'bg-default';
  }
};

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const isNightTime = (current, sunrise, sunset) => {
  return current < sunrise || current > sunset;
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const groupForecastByDay = (forecastList) => {
  const grouped = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  return Object.values(grouped).slice(0, 5);
};

export const getAQILevel = (aqi) => {
  const levels = {
    1: { label: 'Good', color: 'success' },
    2: { label: 'Fair', color: 'info' },
    3: { label: 'Moderate', color: 'warning' },
    4: { label: 'Poor', color: 'danger' },
    5: { label: 'Very Poor', color: 'danger' }
  };
  return levels[aqi] || levels[1];
};