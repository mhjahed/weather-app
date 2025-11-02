import { motion } from 'framer-motion';
import { formatDate, getWeatherIcon, groupForecastByDay } from '../utils/helpers';

const ForecastCard = ({ forecast, units }) => {
  const dailyForecasts = groupForecastByDay(forecast.list);
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card shadow border-0 mb-4"
    >
      <div className="card-body">
        <h5 className="card-title mb-4">5-Day Forecast</h5>
        <div className="row g-3">
          {dailyForecasts.map((dayData, index) => {
            const temps = dayData.map(item => item.main.temp);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);
            const mainWeather = dayData[Math.floor(dayData.length / 2)];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="col-md-6 col-lg-12"
              >
                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{formatDate(mainWeather.dt)}</h6>
                    <p className="mb-0 small text-muted text-capitalize">
                      {mainWeather.weather[0].description}
                    </p>
                  </div>
                  <img
                    src={getWeatherIcon(mainWeather.weather[0].icon)}
                    alt={mainWeather.weather[0].description}
                    style={{ width: '60px', height: '60px' }}
                  />
                  <div className="text-end">
                    <h5 className="mb-0">
                      {Math.round(maxTemp)}{tempUnit}
                    </h5>
                    <p className="mb-0 text-muted small">
                      {Math.round(minTemp)}{tempUnit}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ForecastCard;