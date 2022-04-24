import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Transfer1155 from './artifacts/contracts/Transfer1155.sol/Transfer1155.json';

const Transfer1155Address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
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
  console.log(walletAddrs, tokenIds, nftAmounts)
  csvArray.push(walletAddrs, tokenIds, nftAmounts)
}

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const sendNFTs = async () => {
    const nftAddr = '0xa07e45a987f19e25176c877d98388878622623fa'
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    const contract = new ethers.Contract(Transfer1155Address, Transfer1155.abi, signer);
    // TODO: implement onReceived1155 from user and then have to transfer out to addresses
    await contract.functions.approveTransfer(nftAddr, true).send({from: addr});
    await contract.functions.transfer1155(nftAddr, csvArray[0], csvArray[1], csvArray[2])
    // need approval for all, need nft id, nft amount
    // const nftsSent = await contract.transfer1155()
    // return txns;
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
      await sendNFTs();
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
      </form>
    </div>
  );
}

export default App;