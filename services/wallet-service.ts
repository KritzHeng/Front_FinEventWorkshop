import { ethers } from "ethers";
import abi from "../ABI_CONTRACT/abi.json";

declare global {
  interface Window {
    ethereum: any; // TODO: find the type
  }
}

export const getEthereum = () => {
  if (typeof window.ethereum !== "undefined") {
    return window.ethereum;
  }
  return null;
};

export const getProvider = () => {
  const ethereum = getEthereum();
  if (ethereum) {
    return new ethers.providers.Web3Provider(getEthereum());
  }
  return null;
};

export const connectWallet = () => {
  return getEthereum()?.request({
    method: "eth_requestAccounts",
  }) as Promise<string>;
};

export const getWalletAddress = () => {
  return getEthereum()?.selectedAddress as string;
};

export const getChainId = () => {
  return getEthereum()?.request({ method: "eth_chainId" }) as Promise<string>;
};

export const getBalance = (address: string) => {
  const provider = getProvider();
  return provider?.getBalance(address);
};


// -------------------readDataFromSmartContract----------------------------
// export const getName = () => {
//   const provider = new ethers.providers.Web3Provider(getEthereum())
//   const nameContract = new ethers.Contract("0x5e223419084f5F89d14e61e6E7022f605dcA57a0", abi, provider);
//   return nameContract.name;
// };
// const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    
// const name = await usdtContract.name()
// const symbol = await usdtContract.symbol()
// const decimals = await usdtContract.decimals()
// const totalSupply = await usdtContract.totalSupply()
// const myBalance = await usdtContract.balanceOf("0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9")