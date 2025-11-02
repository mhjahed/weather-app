import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaWhatsapp, FaCopy } from 'react-icons/fa';
import { useState } from 'react';

const ShareCard = ({ weather, units }) => {
  const [copied, setCopied] = useState(false);
  const tempUnit = units === 'metric' ? '°C' : '°F';
  
  const shareText = `Current weather in ${weather.name}: ${Math.round(weather.main.temp)}${tempUnit}, ${weather.weather[0].description}`;
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'info'
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'primary'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'success'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="d-flex gap-2 mb-3 flex-wrap"
    >
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-${link.color} btn-sm`}
        >
          {link.icon} {link.name}
        </motion.a>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="btn btn-secondary btn-sm"
      >
        <FaCopy /> {copied ? 'Copied!' : 'Copy'}
      </motion.button>
    </motion.div>
  );
};

export default ShareCard;