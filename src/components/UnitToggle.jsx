import { motion } from 'framer-motion';

const UnitToggle = ({ units, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="btn-group"
      role="group"
    >
      <button
        className={`btn ${units === 'metric' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={onToggle}
      >
        °C
      </button>
      <button
        className={`btn ${units === 'imperial' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={onToggle}
      >
        °F
      </button>
    </motion.div>
  );
};

export default UnitToggle;