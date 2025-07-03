import React from 'react';
import { motion } from 'framer-motion';
import { type walletType } from '../utilites/generatekey';

interface WalletSelectionProps {
  onWalletSelect: (type: walletType) => void;
}

const WalletSelection: React.FC<WalletSelectionProps> = (props) => {
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        
        
        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Phase supports multiple blockchains
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-gray-600 mb-12"
        >
          Choose a blockchain to get started.
        </motion.p>
        
        {/* Blockchain Selection Buttons */}
        <div className="flex gap-4 mb-12">
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ duration: 0.3, delay: 0.6 }}
            onClick={() => props.onWalletSelect('solana')}
            className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 text-lg font-medium transition-colors duration-200"
          >
            Solana
          </motion.button>
          
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ duration: 0.3, delay: 0.7 }}
            onClick={() => props.onWalletSelect('ethereum')}
            className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 text-lg font-medium transition-colors duration-200"
          >
            Ethereum
          </motion.button>
        </div>

      </div>
    </div>
  );
};

export default WalletSelection;