import './App.css';
import React, {useState} from 'react'
import Web3 from 'web3';

// This is the main component/function 
const App =  () => {

  // Variable declaration along with their state
  let connectMessage = "";
  const [msg,setMessage] = useState(connectMessage);
  
  let walletAddress = "0x0000";
  const [waltAddress,setWalletAddress] = useState(walletAddress);

  let walletBalance = "";
  const [waltBalance,setWalletBalance] = useState(walletBalance);
  // Variable declaration ends 


  // This is the functionality for connecting to Web3 provider (Metamask)
  // window.ethereum looks for injected web, enable loads the metamask extension
  // When user logs in to the Metamask wallet successfully, setState changes accordingly
  const connectToWeb3Provider = () => {
    return new Promise((resolve, reject) => {
      if(typeof window.ethereum !== 'undefined') {
        //const web3 = new Web3(window.ethereum);
        window.ethereum.enable()
          .then(() => {
            setMessage("Connected to Metamask")
            console.log(connectMessage)
            resolve(
              new Web3(window.ethereum)
            );
          })
          .catch(e => {
            reject(e);
          });
        return;
      }
    });
  };
  
  
  // This function gets the account address from injected web3 instance i.e. Metamask address
  // accounts[0] - is the first account from the connected wallet 
  const getAddress = async () => {
    const web3AddObj = new Web3(window.ethereum)
    web3AddObj.eth.getAccounts().then(accounts =>{
      let waltAddrMsg = "Current wallet address is " + accounts[0]
      setWalletAddress(waltAddrMsg)
    })
    //console.log("Wallet address is ",walletAddress)
  }
  

  // This function gets the balance of the first and the only address ETHER balance 
  const getBalance = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const webObj = new Web3(window.ethereum)
    webObj.eth.getBalance(accounts[0].toString(), function(err, result) {
      if (err) {
        console.log(err)
      } else {
        let walBal = ("Wallet balance is "+ webObj.utils.fromWei(result, "ether") + " ETH").toString()
        setWalletBalance(walBal)
        //console.log(webObj.utils.fromWei(result, "ether") + " ETH")
      }
    })
  }

  // The HTML section 
  return (
    <div className="App">
      <div>  
        <button onClick= {connectToWeb3Provider}>Connect to  Metamask</button>
        <h2>{msg}</h2>
        <p></p>
      </div>
      
      <div>
        <button onClick = {getAddress}> Show Wallet address </button>
        <h2>{waltAddress}</h2>
        <p></p>
      </div>
      <div>
        <button onClick= {getBalance}> Show Wallet balance  </button>
        <h2>{waltBalance}</h2>
        <div></div>
        <p></p>
      </div>
    </div>
  );
}






export default App;
