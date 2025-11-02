import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const WeatherAlerts = ({ weather }) => {
  const getAlerts = () => {
    const alerts = [];
    
    if (weather.main.temp > 35) {
      alerts.push({
        type: 'danger',
        message: 'Extreme Heat Warning',
        description: 'Temperature is dangerously high. Stay hydrated and avoid outdoor activities.'
      });
    }
    
    if (weather.main.temp < 0) {
      alerts.push({
        type: 'info',
        message: 'Freezing Temperature',
        description: 'Temperature is below freezing. Dress warmly and be cautious of ice.'
      });
    }
    
    if (weather.wind.speed > 10) {
      alerts.push({
        type: 'warning',
        message: 'High Wind Warning',
        description: 'Strong winds detected. Secure loose objects and drive carefully.'
      });
    }
    
    if (weather.main.humidity > 80) {
      alerts.push({
        type: 'warning',
        message: 'High Humidity',
        description: 'Very humid conditions. May feel uncomfortable.'
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className={`alert alert-${alert.type} d-flex align-items-start mb-2`}
        >
          <FaExclamationTriangle className="me-3 mt-1" size={20} />
          <div>
            <h6 className="alert-heading mb-1">{alert.message}</h6>
            <p className="mb-0 small">{alert.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WeatherAlerts;