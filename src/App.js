import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Transfer1155 from './artifacts/contracts/Transfer1155.sol/Transfer1155.json';

const Transfer1155Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const polygonAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

function App() {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str, delim=',') => {
    const walletAddrs = [];
    const nftAddrs = [];
    const nftAmounts = [];
    console.log(str, "STRING")
    const rows = str.slice(str.indexOf('\n', '\r')+1).split('\n', '\r');
    for(let row of rows){
      const values = row.split(delim);
      walletAddrs.push(values[0]);
      nftAddrs.push(values[1]);
      nftAmounts.push(values[2])
    }
  csvArray.push(walletAddrs, nftAddrs, nftAmounts)
  setCsvArray(csvArray)
}

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  const sendNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(Transfer1155, Transfer1155.abi, signer)
    // console.log(contract.transfer1155())
    return 'hi'
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
      await sendNFTs(csvArray);
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