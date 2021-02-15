import Web3 from "web3";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    console.log('new promise '); 
    // Wait for loading completion to avoid race conditions with web3 injection timing.              
      // Modern dapp browsers...
      console.log('before window eth'); 
      if (window.ethereum) {
        console.log('after window eth');
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          //await window.ethereum.enable();
            console.log('before await');
             window.ethereum.enable();
            console.log('after await');            
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;        
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {      
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:9545"
        );
        const web3 = new Web3(provider);        
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
        }      
  });



// async function InitWeb3() {      
//       // Modern dapp browsers...
//       console.log('before window eth'); 
//       if (window.ethereum) {
//         console.log('after window eth');
//         const web3 = new Web3(window.ethereum);
//         try {
//           // Request account access if needed
//           //await window.ethereum.enable();
//             await window.ethereum.enable();
//             InitFlag = true;
//           // Acccounts now exposed
//           resolve(web3);
//         } catch (error) {
//           reject(error);
//         }
//       }
//       // Legacy dapp browsers...
//       else if (window.web3) {
//         // Use Mist/MetaMask's provider.
//         const web3 = window.web3;
//         InitFlag = true;
//         console.log("Injected web3 detected.");
//         resolve(web3);
//       }
//       // Fallback to localhost; use dev console port by default...
//       else {
//         const provider = new Web3.providers.HttpProvider(
//           "http://localhost:9545"
//         );
//         const web3 = new Web3(provider);
//         InitFlag = true;
//         console.log("No web3 instance injected, using Local web3.");
//         resolve(web3);
//         }
//       }            
};

export { getWeb3 };
