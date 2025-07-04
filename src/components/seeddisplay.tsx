import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeedPhraseDisplayProps {
  mnemonic: string;
  isVisible: boolean;
  onToggle: () => void;
}

const SeedPhraseDisplay: React.FC<SeedPhraseDisplayProps> = ({ mnemonic, isVisible, onToggle }) => {
  const words = mnemonic.split(' ');

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Your Secret Phrase
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
        >
          <motion.svg 
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-gray-50 p-3 sm:p-6 rounded-lg border overflow-hidden"
          >
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
            >
              {words.map((word, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm min-w-0"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-700 block text-center break-words">
                    {word}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeedPhraseDisplay;