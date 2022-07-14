import type { NextPage } from "next";
import * as ethers from "ethers";
// import * as web3 from "web3";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
} from "../services/wallet-service";
import {
  getNetworkCurrency,
  getNetworkName,
  //   getNetworkTokens,
} from "../constants/network-id";
import { formatEther, formatUnits, Logger } from "ethers/lib/utils";
// import { Token } from "../types/token.type";
// import Metamask from './Metamask';
import axios from "axios";
import abi_contract from "../ABI_CONTRACT/abi.json";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  //   const [balance, setBalance] = useState<string | null>(null);

  const [nameToken, setNameToken] = useState<string | null>(null);
  const [maxSupply, setMaxSupply] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [currentSupply, setCurrentSupply] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const addr_contract = "0x866C800F1B873e56356C4AC14Fe576F26a77d1B8";
  const linkOpenSea = "https://testnets.opensea.io/collection/finevent";

  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const contract = new ethers.Contract(
      tokenAddress,
      abi_contract,
      getProvider()!
    );
    return contract.balanceOf(ownerAddress);
  };
  const getNameToken = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.name();
  };
  const getMaxSupply = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.MAX_SUPPLY();
  };
  const getCurrentSupply = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.supply();
  };
  // const getBalanceOf = async () => {

  //       const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
  //       return contract.balanceOf();
  // }

  // const handlerPublicMint = async () =>{

  //   const addr = getWalletAddress();
  //   setAddress(addr);
  //   const chainId = await getChainId();
  //   setNetwork(chainId);

  //   const tokenBalance = await getTokenBalance(addr_contract, addr).then((res) =>
  //   formatUnits(res, 0)
  //   )
  //   console.log(tokenBalance)

  //     const provider = getProvider()!;
  //     const signer = provider.getSigner();
  //     if(Number(tokenBalance) + 1 > 2){
  //       setStatus("you already have 2 Tickets. ");

  //     }
  //     else{

  //       // const options = {value: ethers.utils.parseEther("0.01")}
  //       const contract = new ethers.Contract(addr_contract, abi_contract, signer);

  //       const txResponse = await contract.publicMint(1, {value: ethers.utils.parseEther("0.01"), gasPrice: 300000,
  //       gasLimit: 9000000});

  //       // try{
  //         await txResponse.wait();

  //         loadAccountData();

  //       //   {
  //         //     gasPrice: 100,
  //         //     gasLimit: 9000000
  //         // }

  //       }

  // }
  const handlerPublicMint = async () => {
    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const tokenBalance = await getTokenBalance(addr_contract, addr).then(
      (res) => formatUnits(res, 0)
    );
    console.log(tokenBalance);

    const provider = getProvider()!;
    const signer = provider.getSigner();

    if (Number(tokenBalance) + 1 > 2) {
      setStatus("you already have 2 Tickets. ");
    } else {
      // // const options = {value: ethers.utils.parseEther("0.01")}
      const contract = new ethers.Contract(addr_contract, abi_contract, signer);
      const txResponse = await contract
        .publicMint(1, {
          value: ethers.utils.parseEther("0.01"),
          gasPrice: 300000,
          gasLimit: 9000000,
        })
        .then((res: any) => {
          console.log(`Transaction hash1: ${res.hash}`);
          setTxHash(`https://rinkeby.etherscan.io/tx/${res.hash}`);
          (document as any).getElementById(
            "myAnchor"
          ).href = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        });

      // let link = "https://rinkeby.etherscan.io/tx/" + tx.hash;
      // console.log(link);
      // console.log(tx.hash);
      // setStatus(tx.hash);
      // await tx
      //   .wait()
      //   .catch(() => new Promise((r) => {}))
      //   .then(() => {});
      // .on('transactionHash', (transactionHash: any) => {
      //   // Show tx hash
      //   console.log(transactionHash)

      //   loadAccountData();
      //   // $("#tx_link").attr("href", link)
      //   // $("#tx_link").text(link)

      //   // // Clear status
      //   // $("#status_value").text('-');
      // })
      //     // The transactions was mined without issue
      //     myProcessMinedTransaction(tx, receipt);
      //   }
      // //   catch(_e){
      // //     let e:Error= _e;
      // //     result = e.message;
      // // }

      // // catch(e){
      // //     result = (e as Error).message;
      // // }

      //   catch (_e) {
      //     let error = (_e as Error).message;
      //     if (error.code === Logger.errors.TRANSACTION_REPLACED) {
      //       if (error.cancelled) {
      //         // The transaction was replaced  :'(
      //         // myProcessCancelledTransaction(tx, error.replacement);
      //       } else {
      //         // The user used "speed up" or something similar
      //         // in their client, but we now have the updated info
      //         // myProcessMinedTransaction(error.replacement, error.receipt);
      //       }
      //     }
      //   }
      // setStatus("complete")
      // loadAccountData();
    }
  };
  const loadAccountData = async () => {
    // try{

    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const name = await getNameToken();
    setNameToken(name);
    console.log(name);

    const maxSupply = await getMaxSupply().then((res) => formatUnits(res, 0));
    setMaxSupply(maxSupply);
    console.log(maxSupply);

    const currentSup = await getCurrentSupply().then((res) =>
      formatUnits(res, 0)
    );
    setCurrentSupply(currentSup);
    console.log(currentSup);
    // }
    // catch(e){
    //   console.log("Error getting contract");
    //   return;
    // }
  };

  useEffect(() => {
    loadAccountData();
    setStatus(null);
    const handleAccountChange = (addresses: string[]) => {
      setAddress(addresses[0]);
      setStatus(null);
      loadAccountData();
    };

    const handleNetworkChange = (networkId: string) => {
      setNetwork(networkId);
      setStatus(null);
      loadAccountData();
    };

    getEthereum()?.on("accountsChanged", handleAccountChange);

    getEthereum()?.on("chainChanged", handleNetworkChange);
  }, []);

  // function openContractOnEtherScan() {
  //   let url = "https://" + network + ".etherscan.io/token/" + addr_contract;
  //   window.open(url, "_blank");
  // }

  // function openUserAddressOnEtherScan() {
  //   let url = 'https://' + network + '.etherscan.io/address/' + userAccount
  //   window.open(url, '_blank');
  // }
  return (
    <div className="bg-[#002368]">
      <div>
        <div className="bg-[#000937] p-3 rounded-t-lg  rounded-[30px]">
          {/* <img className="font-serif text-4xl italic font-normal text-back-700 " src="../public/fin-logo.png"/> */}
          <div className="p-2 flex pl-6 ">
            <img src="/fin-logo.png" className="mr-3 h-6 sm:h-7 lg:h-12" />
            <div>
              <p className="self-center lg:text-4xl  font-serif whitespace-nowrap dark:text-white sm: text-sm">
                FinEvent
              </p>
            </div>
          </div>

          {address ? (
            <div className="p-4 font-serif text-back text-white outline outline-offset-1 text-back-700 sm: text-sm  outline-[#00A8E8] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300">
              {address}
            </div>
          ) : (
            <button
              className="p-4  font-serif text-back text-white outline outline-offset-1 text-back-700 sm: text-sm outline-[#00A8E8] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        {address ? (
          <div className="  ">
            <div className="flex justify-center py-4">

            <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
              {nameToken}
            </div>
              <a href={linkOpenSea} target="_blank" className="px-4 py-4"><img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.svg" width="55" height="5" /></a>
            </div>
            <div className=" py-2 flex justify-center  ">
              <div className=" py-8 box-content border-solid h-80 w-96 p-4  border-2 bg-origin-padding rounded-lg  bg-gradient-to-r from-cyan-500 to-blue-500">
                <img
                  className=" bg-origin-padding rounded-full h-80 w-96 "
                  src="ticket2.png"
                  onClick={handlerPublicMint}
                ></img>
                </div>
            </div>
            <div className="flex justify-center">

            </div>
            
            <div className=" text-center font-serif text-white text-2xl  text-back-700">
                <div className=" py-10  "></div>
              <div>contract address: {addr_contract}</div>
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
              <div className="text-center text-red-700">{status}</div>
              <div className=" py-10  "></div>
              <a id="myAnchor" href="" className="text-center text-red-700">
                {txHash}
              </a>
            </div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
          </div>
        ) : (
          <div className=" py-8 box-content content-none ">
            <div className=" py-8  self-center lg:text-4xl flex justify-center font-serif whitespace-nowrap dark:text-white sm: text-sm">
              Please connect wallet...
            </div>

            <div className=" py-8 flex justify-center  ">
              <div className=" py-8 box-content border-solid h-80 w-96 p-4  border-2 bg-origin-padding rounded-lg  bg-gradient-to-r from-cyan-500 to-blue-500">
                <img
                  className=" bg-origin-padding rounded-full h-80 w-96 "
                  src="ticket2.png"
                  onClick={connectWallet}
                ></img>
              </div>
            </div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
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
export default Home;
