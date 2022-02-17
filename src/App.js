import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

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

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const sendNFTs = async (nftInfo) => {
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    const txns = [];
    await nftInfo.map((nft) => {
      const transaction = contract.transferNFT({nft})
      // txns.push(transaction)
      // console.log(transaction)
    })
    return txns;
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
      return await sendNFTs(csvArray);
    }
  }

  return (
    <div className="App">
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

  // async function fetchGreeting() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
  //     try {
  //       const data = await contract.greet()
  //       console.log('data: ', data)
  //     } catch (err) {
  //       console.log("Error: ", err)
  //     }
  //   }
  // }

  // async function setGreeting() {
  //   if(!greeting) return
  //   if(typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
  //     const transaction = await contract.setGreeting(greeting)
  //     await transaction.wait()
  //     fetchGreeting()
  //   }
  // }

export default App;