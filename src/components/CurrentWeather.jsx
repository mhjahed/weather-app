import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { getWeatherIcon, formatTime } from '../utils/helpers';

const CurrentWeather = ({ weather, units, isFavorite, onToggleFavorite, onShare }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card shadow-lg border-0 mb-4 weather-card"
    >
      <div className="card-body text-center p-5">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="card-title mb-1">{weather.name}</h2>
            <p className="text-muted mb-0">{weather.sys.country}</p>
          </div>
          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleFavorite}
              className="btn btn-outline-danger rounded-circle"
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="btn btn-outline-primary rounded-circle"
            >
              <FaShare />
            </motion.button>
          </div>
        </div>

        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          src={getWeatherIcon(weather.weather[0].icon)}
          alt={weather.weather[0].description}
          className="weather-icon"
          style={{ width: '150px', height: '150px' }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="display-1 fw-bold mb-0">
            {Math.round(weather.main.temp)}{tempUnit}
          </h1>
          <p className="lead text-capitalize mb-3">
            {weather.weather[0].description}
          </p>
          <p className="text-muted">
            Feels like {Math.round(weather.main.feels_like)}{tempUnit}
          </p>
        </motion.div>

        <div className="row g-3 mt-3">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded">
              <p className="text-muted mb-1 small">Humidity</p>
              <h5 className="mb-0">{weather.main.humidity}%</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded">
              <p className="text-muted mb-1 small">Wind</p>
              <h5 className="mb-0">{Math.round(weather.wind.speed)} {speedUnit}</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded">
              <p className="text-muted mb-1 small">Sunrise</p>
              <h5 className="mb-0">{formatTime(weather.sys.sunrise)}</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded">
              <p className="text-muted mb-1 small">Sunset</p>
              <h5 className="mb-0">{formatTime(weather.sys.sunset)}</h5>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;