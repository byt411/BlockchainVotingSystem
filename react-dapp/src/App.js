import './App.css';
import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
const greeterAddress = "0x69CFE272aD2A9e264d73D7df49E6bef0B63b7B06"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState()
  const [localGreeting, setLocalGreeting] = useState()
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        setGreetingValue(data)
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function sendGreeting() {
    if (!localGreeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(localGreeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{greeting} is the current greeting!</p>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={sendGreeting}>Set Greeting</button>
        <input onChange={e => setLocalGreeting(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;