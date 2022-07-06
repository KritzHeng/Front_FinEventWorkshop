import type { NextPage } from "next";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
//   getName,
} from "../services/wallet-service";
import {
  getNetworkCurrency,
  getNetworkName,
//   getNetworkTokens,
} from "../constants/network-id";
import { formatEther, formatUnits } from "ethers/lib/utils";
// import { Token } from "../types/token.type";
// import Metamask from './Metamask';
import axios from "axios";
import abi_contract from "../ABI_CONTRACT/abi.json";


const mint = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
//   const [balance, setBalance] = useState<string | null>(null);

  const [nameToken, setNameToken] = useState<string | null>(null);
  const [maxSupply, setMaxSupply] = useState<string | null>(null);
  const [currentSupply, setCurrentSupply] = useState<string | null>(null);

  const addr_contract = "0x5e223419084f5F89d14e61e6E7022f605dcA57a0";
  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const contract = new ethers.Contract(tokenAddress, abi_contract, getProvider()!);
    return contract.balanceOf(ownerAddress);
  };
  const getNameToken = async () => {
        const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
        return contract.name();
  }
  const getMaxSupply = async () => {
        const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
        return contract.MAX_SUPPLY();
  }
  const getCurrentSupply = async () => {

        const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
        return contract.supply();
  }
  const sentpublicMint = async (
    payableAmount: string, //(ether)
    numberOfTokens: string //(uint8)
  ) => {
        const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
        
    // const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    // var number = await numberContract.number()
    // console.log("initial number ", number.toString())

    // const txResponse = await numberContract.connect(signer).incrementNumber()
    // await txResponse.wait()
    // number = await numberContract.number()
    const provider = getProvider()!;
    const signer = await provider.getSigner();
    // const signer = await getProvider();
    const options = {value: ethers.utils.parseEther("0.01")}
    const txResponse = await contract.connect(signer).publicMint(1);
    await txResponse.wait()
    // const currentSup = await contract.currentSupply().then((res) =>
    // formatUnits(res, 0)
    // )
    // setCurrentSupply(currentSup)
    
    // console.log("updated number = ", number.toString())

        
        // return contract.publicMint(payableAmount,numberOfTokens);
  }
  const handlerPublicMint = async () =>{
      const provider = getProvider()!;
      const signer = await provider.getSigner();
 
      // const options = {value: ethers.utils.parseEther("0.01")}
      const contract = new ethers.Contract(addr_contract, abi_contract, signer);

    
    const txResponse = await contract.publicMint(1, {value: ethers.utils.parseEther("0.01")})
    await txResponse.wait()

 
  }
  const loadAccountData = async () => {
    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const tokenBalance = await getTokenBalance(addr_contract, addr).then((res) =>
    formatUnits(res, 0)
    )
    console.log(tokenBalance)
    
    const name = await getNameToken()
    setNameToken(name)
    console.log(name)
    
    
    const maxSupply  = await getMaxSupply().then((res) =>
    formatUnits(res, 0)
    )
    setMaxSupply(maxSupply)
    console.log(maxSupply)
    
    const currentSup  = await getCurrentSupply().then((res) =>
    formatUnits(res, 0)
    )
    setCurrentSupply(currentSup)
    console.log(currentSup)

  };

  useEffect(() => {
    loadAccountData();

    const handleAccountChange = (addresses: string[]) => {
      setAddress(addresses[0]);
    //   setProvider(getProvider());
      loadAccountData();
    };

    const handleNetworkChange = (networkId: string) => {
      setNetwork(networkId);
      loadAccountData();
    };

    getEthereum()?.on("accountsChanged", handleAccountChange);

    getEthereum()?.on("chainChanged", handleNetworkChange);
  }, []);

  return (
    <div className="bg-[#081730]">

      <div>
        <div className="bg-[#00A3AC]  p-3 ">
        {/* <img className="font-serif text-4xl italic font-normal text-back-700 " src="../public/fin-logo.png"/> */}
          <div className="font-serif text-4xl italic font-normal text-back-700 ">
            FinEvent
          </div>

          {address ? (
            <div className="p-2 font-serif text-back text-back-70  absolute top-3 right-6">
              {address}
            </div>
          ) : (
            <button
              className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]   drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#A0D2CD] hover:-translate-y-1 hover:scale-110 hover:bg-[#00A3AC] duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}

</div>
          {address ? (
        <div className="  ">
        <div className=" py-8 ">
          <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
            {nameToken}
          </div>
          <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
          {currentSupply}/{maxSupply}
          </div>
          <div className="flex justify-center my-12'">
            
              <button
                className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]    drop-shadow-x transition ease-in-out delay-150 bg-[#2759ff] hover:-translate-y-1 hover:scale-110 hover:bg-[#7972cb]"
                onClick={handlerPublicMint}
              >
                MINT
              </button>

          </div>
        </div>
      </div>
          ) : (
            <div className="  ">
            <div className=" py-8 ">
<h1>asfasfasfas</h1>

            </div>
          </div>
          )}



      </div>


    </div>
    // <div className="bg-[#081730]">
    //   {/* <div > */}
    //   {/* {address ? ( */}

    //   {/* <div >
    //     <div className="bg-cyan-800 h-20 ">
    //       <button className="font-serif text-4xl italic font-normal text-back-700 inline-block m-4">NFT EVENT</button>
          
    //     </div>
    //     <p>Your wallet address is {address}</p>
    //     <p>
    //       Current network is {getNetworkName(network)} ({network})
    //     </p>
    //     <p>
    //       Your balance is {balance} {getNetworkCurrency(network)}
    //     </p>
  
    //   </div> */}
    //   {/* ) : */}
    //   {/* ( */}
    //   <div>
    //     <div className="bg-[#00A3AC]  p-3 ">
    //     {/* <img className="font-serif text-4xl italic font-normal text-back-700 " src="../public/fin-logo.png"/> */}
    //       <div className="font-serif text-4xl italic font-normal text-back-700 ">
    //         FinEvent
    //       </div>

    //       {address ? (
    //         <div className="p-2 font-serif text-back text-back-70  absolute top-3 right-6">
    //           {address}
    //         </div>
    //       ) : (
    //         <button
    //           className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]   drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#A0D2CD] hover:-translate-y-1 hover:scale-110 hover:bg-[#00A3AC] duration-300"
    //           onClick={connectWallet}
    //         >
    //           Connect Wallet
    //         </button>
    //       )}
    //   </div>

    //     <div className="  ">
    //       <div className=" py-8 ">
    //         <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
    //           {nameToken}
    //         </div>
    //         <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
    //         {currentSupply}/{maxSupply}
    //         </div>
    //         <div className="flex justify-center my-12'">
              
    //             <button
    //               className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]    drop-shadow-x transition ease-in-out delay-150 bg-[#2759ff] hover:-translate-y-1 hover:scale-110 hover:bg-[#7972cb]"
    //               onClick={handlerPublicMint}
    //             >
    //               MINT
    //             </button>

    //         </div>
    //       </div>
    //     </div>

    //   </div>


    // </div>


  );
};

export default mint;
