const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const Web3 = new Web3(window.ethereum);
          try {
            
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(Web3);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("Must install MetaMask");
        }
      });
    });
  };