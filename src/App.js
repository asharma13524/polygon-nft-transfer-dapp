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
    const nftContractAddrs = [];
    const tokenIds = [];
    const nftAmounts = [];
    const rows = str.slice(str.indexOf('\n')+1).split(/\r?\n/);
    for(let row of rows){
      const values = row.split(delim);
      walletAddrs.push(values[0]);
      nftContractAddrs.push(values[1]);
      tokenIds.push(values[2]);
      nftAmounts.push(values[3]);
    }
  setCsvArray((csvArray) => [
    ...csvArray,
    walletAddrs,
    nftContractAddrs,
    tokenIds,
    nftAmounts
  ]);
}

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const approveNFTs = async () => {
    // TODO: How to handle multiple editions? One at a time?
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const mintERC1155Contract = new ethers.Contract(MintERC1155Address, MintERC1155.abi, signer);
    // Mint NFT logic
    // try {
    //   await mintERC1155Contract.functions.addNewAirline(30);
    // } catch (err) {
    //   console.log(err);
    // }
    try {
      for(let nftContract of csvArray[1]) {
        await nftContract.setApprovalForAll(Transfer1155Address, true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const sendNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transferContract = new ethers.Contract(Transfer1155Address, Transfer1155.abi, signer);
    try {
      for(let nftContractAddr of csvArray[1]) {
        await transferContract.functions.transfer1155(nftContractAddr, csvArray[0], csvArray[1], csvArray[2]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const processCsvFile = async (csvFile) => {
    setCsvFile(csvFile)
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = async function(e) {
      const text = e.target.result;
      await processCSV(text);
    };
    await reader.readAsText(file);
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
                processCsvFile(e.target.files[0])
              }}
            >
            </input>
            <br/>
            <div className="approvetransfer">
              <button
              onClick={(e) => {
                e.preventDefault()
                if(csvFile){
                  approveNFTs()
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