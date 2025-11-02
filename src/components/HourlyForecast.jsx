import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTime, getWeatherIcon } from '../utils/helpers';

const HourlyForecast = ({ forecast, units }) => {
  const hourlyData = forecast.list.slice(0, 8);
  const tempUnit = units === 'metric' ? '°C' : '°F';

  const chartData = hourlyData.map(item => ({
    time: formatTime(item.dt),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card shadow border-0 mb-4"
    >
      <div className="card-body">
        <h5 className="card-title mb-4">Hourly Forecast</h5>
        
        {/* Chart */}
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#0d6efd" strokeWidth={2} />
              <Line type="monotone" dataKey="feels_like" stroke="#6c757d" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly cards */}
        <div className="d-flex overflow-auto pb-2 gap-3">
          {hourlyData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="text-center p-3 bg-light rounded flex-shrink-0"
              style={{ minWidth: '100px' }}
            >
              <p className="mb-2 small text-muted">{formatTime(item.dt)}</p>
              <img
                src={getWeatherIcon(item.weather[0].icon)}
                alt={item.weather[0].description}
                style={{ width: '50px', height: '50px' }}
              />
              <h6 className="mb-0">{Math.round(item.main.temp)}{tempUnit}</h6>
              <p className="mb-0 small text-muted">{item.weather[0].main}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;