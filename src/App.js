import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Transfer1155 from './artifacts/contracts/Transfer1155.sol/Transfer1155.json';
import ApproveContractTransfer from './artifacts/contracts/Approve1155Transfer.sol/ApproveContractTransfer.json';
import MintERC1155 from './artifacts/contracts/MintERC1155.sol/AirlineTokens.json';

const ApproveNFTForTransferAddress = "0x25309138bf0177bd85c109D823cf2C0Df7D484a6";
const MintERC1155Address = "0xCB2890db00F2Ca167278341A48AF41FC40bB961E";
const Transfer1155Address = "0x643995EFFDfd3ADc6E3bf09920B6AAa9C29ec6fb";

// const polygonAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

function App() {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str, delim=',') => {
    const walletAddrs = [];
    const nftAddrs = [];
    const tokenIds = [];
    const nftAmounts = [];
    const rows = str.slice(str.indexOf('\n')+1).split('\n');
    for(let row of rows){
      const values = row.split(delim);
      walletAddrs.push(values[0]);
      tokenIds.push(values[1]);
      nftAmounts.push(1)
    }
  csvArray.push(walletAddrs, tokenIds, nftAmounts)
}

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const approveNFTs = async () => {
    const nftAddr = '0xCB2890db00F2Ca167278341A48AF41FC40bB961E';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // const addr = await signer.getAddress();
    const nftContract = new ethers.Contract(nftAddr, MintERC1155.abi, signer);
    const transferContract = new ethers.Contract(Transfer1155Address, Transfer1155.abi, signer);
    const mintERC1155Contract = new ethers.Contract(MintERC1155Address, MintERC1155.abi, signer);
    const approveTransferContract = new ethers.Contract(ApproveNFTForTransferAddress, ApproveContractTransfer.abi, signer)
    // Mint NFT logic
    // try {
    //   await mintERC1155Contract.functions.addNewAirline(30);
    // } catch (err) {
    //   console.log(err);
    // }
    try {
      await nftContract.setApprovalForAll(Transfer1155Address, true);
    } catch (err) {
      console.log(err);
    }

    // try {
    //   await approveTransferContract.functions.isApprovedForTransfer(nftAddr, Transfer1155Address);
    // } catch (err) {
    //   console.log(err);
    // }




    // approveTransferContract.on()
  }

  const sendNFTs = async () => {
    const nftAddr = '0xCB2890db00F2Ca167278341A48AF41FC40bB961E';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transferContract = new ethers.Contract(Transfer1155Address, Transfer1155.abi, signer);
    console.log(csvArray);
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
    <div className="App">
       <div>
        <div>
          <button onClick={() => activateBrowserWallet()}>Connect</button>
        </div>
        {account && <p>Account: {account}</p>}
        {etherBalance && <p>Balance: {formatEther(etherBalance)} </p>}
        {/* {polygonBalance && <p>Balance: {formatEther(polygonBalance)}</p>} */}

      </div>
      <form id='csv-form'>
        <input
          type='file'
          accept='.csv'
          id='csvFile'
          onChange={(e) => {
            setCsvFile(e.target.files[0])
          }}
        >
        </input>
        <br/>
        <button
          onClick={(e) => {
            e.preventDefault()
            if(csvFile)processAndSendNFTs()
          }}
        >
        Submit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            if(csvFile)sendNFTs()
          }}
        >
        Submit 2
        </button>
      </form>
    </div>
  );
}

export default App;