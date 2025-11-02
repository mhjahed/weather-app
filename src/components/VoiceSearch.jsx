import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

const VoiceSearch = ({ onSearch }) => {
  const { isListening, startListening, stopListening, isSupported } = useVoiceSearch(onSearch);

  if (!isSupported) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isListening ? stopListening : startListening}
      className={`btn ${isListening ? 'btn-danger' : 'btn-outline-primary'} rounded-circle p-3`}
      title="Voice Search"
    >
      {isListening ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
    </motion.button>
  );
};

export default VoiceSearch;