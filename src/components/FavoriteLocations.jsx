import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { storage } from '../utils/storage';
import { useState, useEffect } from 'react';

const FavoriteLocations = ({ onSelectLocation }) => {
  const [favorites, setFavorites] = useState(storage.getFavorites());

  const handleRemove = (locationName) => {
    storage.removeFavorite(locationName);
    setFavorites(storage.getFavorites());
  };

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card shadow border-0 mb-4"
    >
      <div className="card-body">
        <h5 className="card-title mb-3">
          <FaMapMarkerAlt className="me-2" />
          Favorite Locations
        </h5>
        <div className="d-flex flex-wrap gap-2">
          <AnimatePresence>
            {favorites.map((location) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="btn-group"
              >
                <button
                  className="btn btn-outline-primary"
                  onClick={() => onSelectLocation(location.name)}
                >
                  {location.name}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRemove(location.name)}
                >
                  <FaTrash size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteLocations;