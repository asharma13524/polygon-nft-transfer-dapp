import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Transfer1155 from './artifacts/contracts/Transfer1155.sol/Transfer1155.json';

const Transfer1155Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const polygonAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

function App() {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str, delim=',') => {
    const headers = str.slice(0, str.indexOf('\n')).split(delim);
    const rows = str.slice(str.indexOf('\n')+1).split('\n');
    const newArray = rows.map(row => {
      const values = row.split(delim);
      const eachObj = headers.reduce((obj, header, i) => {
        if(values[i]) {
          obj[header] = values[i]
        }
        return obj;
      }, {})
      return eachObj;
    })
    setCsvArray(newArray.slice(0,-1));
  }

  // activate browser wallet
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const polygonBalance = useTokenBalance(polygonAddress, account);


  const sendNFTs = async (nftInfo) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log('no')
    const contract = new ethers.Contract(Transfer1155, Transfer1155.abi, signer)
    const txns = [];
    const nftsSent = await contract.transfer1155()
    return txns;
  }

  const processAndSendNFTs = async () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = async function(e) {
      const text = e.target.result;
      console.log(text)
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
        {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
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