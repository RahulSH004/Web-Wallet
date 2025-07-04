import { useState } from "react";
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


const Wallet = () => {
  const [walletData, setWalletData] = useState<Walletdata[]>([]);
  const [selectedWalletType, setSelectedWallet] = useState<walletType | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState<{
    [key: number]: boolean;
  }>({});

  const handleWalletTypeSelect = (type: walletType) => {
    setSelectedWallet(type);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} blockchain selected!`, {
      description: "You can now create wallets for this blockchain",
    });
  };

  const generateWallet = () => {
    if (selectedWalletType) {
      try{
        const newwallet = generatekeys(selectedWalletType);
        setWalletData((prev) => [...prev, newwallet]);
        toast.success("Wallet Created Successfully",{
          description: `New ${selectedWalletType} wallet has been generated`,
        });
      }catch{
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
    toast.success("All wallets cleared!", {
      description: `${walletCount} wallet(s) have been permanently deleted`,
    });
  };

  const deleteWallet = (index: number) => {
    setWalletData((prev) => prev.filter((_, i) => i !== index));
    toast.success("Wallet deleted!", {
      description: `Wallet ${index + 1} has been removed`,
    });
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setShowPrivateKey((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
                  {walletData.length}{" "}
                  wallet(s)
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
                  <button
                    onClick={() => deleteWallet(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
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
                        onClick={() => copyToClipboard(wallet.publickey)}
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
                            onClick={() => copyToClipboard(wallet.privatekey)}
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