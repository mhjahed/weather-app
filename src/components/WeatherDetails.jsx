import { motion } from 'framer-motion';
import {
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaEye,
  FaCompress,
  FaCloudRain
} from 'react-icons/fa';
import { getWindDirection } from '../utils/helpers';

const WeatherDetails = ({ weather, units }) => {
  const pressureUnit = 'hPa';
  const visibilityKm = (weather.visibility / 1000).toFixed(1);

  const details = [
    {
      icon: <FaTemperatureHigh size={24} />,
      label: 'Min / Max',
      value: `${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°`,
      color: 'primary'
    },
    {
      icon: <FaTint size={24} />,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      color: 'info'
    },
    {
      icon: <FaWind size={24} />,
      label: 'Wind',
      value: `${Math.round(weather.wind.speed)} ${units === 'metric' ? 'm/s' : 'mph'} ${getWindDirection(weather.wind.deg)}`,
      color: 'success'
    },
    {
      icon: <FaEye size={24} />,
      label: 'Visibility',
      value: `${visibilityKm} km`,
      color: 'warning'
    },
    {
      icon: <FaCompress size={24} />,
      label: 'Pressure',
      value: `${weather.main.pressure} ${pressureUnit}`,
      color: 'danger'
    },
    {
      icon: <FaCloudRain size={24} />,
      label: 'Clouds',
      value: `${weather.clouds.all}%`,
      color: 'secondary'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card shadow border-0 mb-4"
    >
      <div className="card-body">
        <h5 className="card-title mb-4">Weather Details</h5>
        <div className="row g-3">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="col-md-6 col-lg-4"
            >
              <div className={`d-flex align-items-center p-3 bg-${detail.color} bg-opacity-10 rounded`}>
                <div className={`text-${detail.color} me-3`}>
                  {detail.icon}
                </div>
                <div>
                  <p className="mb-0 small text-muted">{detail.label}</p>
                  <h6 className="mb-0">{detail.value}</h6>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherDetails;