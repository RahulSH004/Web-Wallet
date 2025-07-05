import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClearwalletsDialog from "./clearwallet";
import {
  generatekeys,
  type Walletdata,
  type walletType,
} from "../utilites/generatekey";
import {
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Layout from "./Layout";
import WalletSelection from "./walletsection";
import SeedPhraseDisplay from "./seeddisplay";
import { toast } from "sonner";

// Local storage keys
const STORAGE_KEYS = {
  WALLET_DATA: 'phase_wallet_data',
  SELECTED_WALLET_TYPE: 'phase_selected_wallet_type'
};

const Wallet = () => {
  const [walletData, setWalletData] = useState<Walletdata[]>([]);
  const [selectedWalletType, setSelectedWallet] = useState<walletType | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState<{
    [key: number]: boolean;
  }>({});

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual wallet data
    if (walletData.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.WALLET_DATA, JSON.stringify(walletData));
      } catch (error) {
        console.error('Error saving wallet data to localStorage:', error);
        toast.error("Failed to save wallet data", {
          description: "Your wallets may not persist",
        });
      }
    }
  }, [walletData]);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedWalletData = localStorage.getItem(STORAGE_KEYS.WALLET_DATA);
      const savedWalletType = localStorage.getItem(STORAGE_KEYS.SELECTED_WALLET_TYPE);

      if (savedWalletData) {
        const parsedWalletData = JSON.parse(savedWalletData);
        // Only set if it's a valid array with data
        if (Array.isArray(parsedWalletData) && parsedWalletData.length > 0) {
          setWalletData(parsedWalletData);
        }
      }

      if (savedWalletType) {
        setSelectedWallet(savedWalletType as walletType);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEYS.WALLET_DATA);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_WALLET_TYPE);
      toast.error("Failed to load saved wallets", {
        description: "Starting with a fresh session",
      });
    }
  }, []);

  // Save selected wallet type to localStorage whenever it changes
  useEffect(() => {
    if (selectedWalletType) {
      try {
        localStorage.setItem(STORAGE_KEYS.SELECTED_WALLET_TYPE, selectedWalletType);
      } catch (error) {
        console.error('Error saving wallet type to localStorage:', error);
      }
    }
  }, [selectedWalletType]);

  const handleWalletTypeSelect = (type: walletType) => {
    setSelectedWallet(type);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} blockchain selected!`, {
      description: "You can now create wallets for this blockchain",
    });
  };

  const generateWallet = () => {
    if (selectedWalletType) {
      try {
        const newwallet = generatekeys(selectedWalletType);
        setWalletData((prev) => [...prev, newwallet]);
        toast.success("Wallet Created Successfully", {
          description: `New ${selectedWalletType} wallet has been generated and saved`,
        });
      } catch (error) {
        console.error('Error generating wallet:', error);
        toast.error("Error generating wallet", {
          description: "Please try again or check your inputs.",
        });
      }
    }
  };

  const clearAllwallets = () => {
    const walletCount = walletData.length;
    setWalletData([]);
    setSelectedWallet(null);
    
    // Clear localStorage completely
    try {
      localStorage.removeItem(STORAGE_KEYS.WALLET_DATA);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_WALLET_TYPE);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }

    toast.success("All wallets cleared!", {
      description: `${walletCount} wallet(s) have been permanently deleted`,
    });
  };

  const deleteWallet = (index: number) => {
    setWalletData((prev) => prev.filter((_, i) => i !== index));
    toast.success("Wallet deleted!", {
      description: `Wallet ${index + 1} has been removed and saved`,
    });
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setShowPrivateKey((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    if (!showPrivateKey[index]) {
      toast.info("Private key revealed", {
        description: "Keep your private key secure and never share it",
      });
    }
  };

  const copyToClipboard = async (text: string, type: string = "Text") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied!`, {
        description: "Copied to clipboard successfully",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Failed to copy", {
        description: "Please try copying manually",
      });
    }
  };

  // Show wallet selection screen if no wallet type is selected
  if (!selectedWalletType) {
    return (
      <Layout showFooter={true}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <WalletSelection onWalletSelect={handleWalletTypeSelect} />
        </motion.div>
      </Layout>
    );
  }

  // Show wallet management interface
  return (
    <Layout showFooter={true}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-2 sm:p-4"
      >
        <div className="max-w-4xl mx-auto">
          {/* Seed Phrase Display */}
          <AnimatePresence>
            {walletData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SeedPhraseDisplay
                  mnemonic={walletData[0]?.mnemonic}
                  isVisible={showMnemonic}
                  onToggle={() => {
                    setShowMnemonic(!showMnemonic);
                    if (!showMnemonic) {
                      toast.info("Secret phrase revealed", {
                        description: "Keep your seed phrase safe and never share it",
                      });
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wallet Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold capitalize">
                  {selectedWalletType} Wallet
                </h2>
                <p className="text-gray-600">
                  {walletData.length} wallet(s)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateWallet}
                  className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
                >
                  Add Wallet
                </button>
                <ClearwalletsDialog onConfirm={clearAllwallets}>
                  <button
                    className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                  >
                    Clear Wallets
                  </button>
                </ClearwalletsDialog>
              </div>
            </div>
          </div>

          {/* Wallet List */}
          <div className="space-y-4 mb-16">
            {walletData.map((wallet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold">Wallet {index + 1}</h3>
                  <ClearwalletsDialog onConfirm={() => deleteWallet(index)}>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </ClearwalletsDialog>
                </div>

                <div className="space-y-4">
                  {/* Public Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public Key
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 bg-gray-50 p-3 rounded-lg border min-w-0">
                        <p className="text-xs sm:text-sm font-mono text-gray-800 break-all">
                          {wallet.publickey}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(wallet.publickey, "Public key")}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 self-center sm:self-auto"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Private Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Private Key
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 bg-gray-50 p-3 rounded-lg border min-w-0">
                        <p className="text-xs sm:text-sm font-mono text-gray-800 break-all">
                          {showPrivateKey[index]
                            ? wallet.privatekey
                            : "•".repeat(40)}
                        </p>
                      </div>
                      <div className="flex gap-1 self-center sm:self-auto">
                        <button
                          onClick={() => togglePrivateKeyVisibility(index)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPrivateKey[index] ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                        {showPrivateKey[index] && (
                          <button
                            onClick={() => copyToClipboard(wallet.privatekey, "Private key")}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Wallet;