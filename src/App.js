import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Transfer1155 from './artifacts/contracts/Transfer1155.sol/Transfer1155.json';
import MintERC1155 from './artifacts/contracts/MintERC1155.sol/AirlineTokens.json';

const MintERC1155Address = "0xCB2890db00F2Ca167278341A48AF41FC40bB961E";
const Transfer1155Address = "0xDD6a1922854e83515d015C4ac4CD85C8ae5A6F37";


const App = () => {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const processCSV = (str, delim=',') => {
    const walletAddrs = [];
    const tokenIds = [];
    const nftAmounts = [];
    const rows = str.slice(str.indexOf('\n')+1).split('\n');
    for(let row of rows){
      const values = row.split(delim);
      walletAddrs.push(values[0]);
      tokenIds.push(values[1]);
      nftAmounts.push(1)
    }
  setCsvArray((csvArray) => [
    ...csvArray,
    walletAddrs,
    tokenIds,
    nftAmounts
  ]);
}

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const approveNFTs = async () => {
    const nftAddr = '0xCB2890db00F2Ca167278341A48AF41FC40bB961E';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftAddr, MintERC1155.abi, signer);
    const mintERC1155Contract = new ethers.Contract(MintERC1155Address, MintERC1155.abi, signer);
    // Mint NFT logic
    try {
      await mintERC1155Contract.functions.addNewAirline(30);
    } catch (err) {
      console.log(err);
    }
    // try {
    //   await nftContract.setApprovalForAll(Transfer1155Address, true);
    // } catch (err) {
    //   console.log(err);
    // }
  }

  const sendNFTs = async () => {
    const nftAddr = '0xCB2890db00F2Ca167278341A48AF41FC40bB961E';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transferContract = new ethers.Contract(Transfer1155Address, Transfer1155.abi, signer);
    try {
      await transferContract.functions.transfer1155(nftAddr, csvArray[0], csvArray[1], csvArray[2]);
    } catch (err) {
      console.log(err);
    }
  }

  const processAndSendNFTs = async () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = async function(e) {
      const text = e.target.result;
      await processCSV(text);
    };
    await reader.readAsText(file);

    if(typeof window.ethereum !== 'undefined') {
      await approveNFTs();
    }
  }

  return (
    <div className="App" >
      <h1 className="title">NFT ERC1155 Airdrop Helper</h1>
        <div>
          <div>
            <button
            onClick={() => activateBrowserWallet()}
            className="
              connect
              h-10
              px-5
              text-indigo-100
              bg-sky-600
              rounded-lg
              transition-colors
              duration-150
              focus:shadow-outline
              hover:bg-sky-700"
            >
              Connect
            </button>
          </div>
        </div>
      <div>
        <form id="csv-form">
            <input
              className="
                file
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
              "
              type='file'
              accept='.csv'
              id='csvFile'
              title=' '
              onChange={(e) => {
                setCsvFile(e.target.files[0])
              }}

            >
            </input>
            <br/>
            <div className="approvetransfer">
              <button
              onClick={(e) => {
                e.preventDefault()
                if(csvFile){
                  processAndSendNFTs()
                } else {
                  console.log("Please upload a csv file!") // TODO: Push errors to frontend
                }
              }}
              className="
                approve
                h-10
                px-5
                text-indigo-100
                bg-violet-700
                rounded-lg
                transition-colors
                duration-150
                focus:shadow-outline
                hover:bg-violet-900"
            >
            Approve
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                if(csvFile){
                  sendNFTs()
                } else {
                  console.log("Please upload a csv file!"); // TODO: Push errors to frontend
                }
              }}
              className="
                transfer
                h-10
                px-5
                text-indigo-100
                bg-indigo-700
                rounded-lg
                transition-colors
                duration-150
                focus:shadow-outline
                hover:bg-indigo-900"
            >
            Transfer NFTs
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default App;