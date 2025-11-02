import { useState } from 'react';

const APISelector = () => {
  const [provider, setProvider] = useState(
    import.meta.env.VITE_WEATHER_PROVIDER || 'openweather'
  );

  const handleChange = (newProvider) => {
    setProvider(newProvider);
    // This requires page reload to take effect
    localStorage.setItem('weather_provider', newProvider);
    window.location.reload();
  };

  return (
    <div className="btn-group mb-3">
      <button
        className={`btn btn-sm ${provider === 'openweather' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handleChange('openweather')}
      >
        OpenWeather
      </button>
      <button
        className={`btn btn-sm ${provider === 'weatherapi' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handleChange('weatherapi')}
      >
        WeatherAPI
      </button>
    </div>
  );
};

export default APISelector;