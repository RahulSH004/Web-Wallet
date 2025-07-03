import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import {derivePath} from 'ed25519-hd-key';
import nacl from 'tweetnacl';

export type walletType = 'solana' | 'ethereum';


interface Walletdata {
    mnemonic: string;
    publickey: string;
    privatekey: string;
    walletType: walletType;
    
}

const generatekeys = (walletType: walletType): Walletdata => {
 const mnemonic = generateMnemonic();
 const seed = mnemonicToSeedSync(mnemonic);

 let derivedPath: string
 switch(walletType){
    case 'solana':
        derivedPath = `m/44'/501'/0'/0'`;
        break;
    case 'ethereum':
        derivedPath = `m/44'/60'/0'/0'`;
        break;
    default:
        derivedPath = `m/44'/501'/0'/0'`;
 }
 
 const derivedSeed = derivePath(derivedPath, seed.toString('hex'));
 const keypair = nacl.sign.keyPair.fromSeed(derivedSeed.key);

 return { 
    mnemonic: mnemonic, 
    publickey: Buffer.from(keypair.publicKey).toString('hex'), 
    privatekey: Buffer.from(keypair.secretKey).toString('hex'),
    walletType: walletType
  };
}

export  {generatekeys, type Walletdata};