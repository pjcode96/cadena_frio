const fs = require("fs-extra"); // Library for file treatment
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const Web3 = require('web3');   // Web3 library


const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "../contracts");
const fileNames = fs.readdirSync(contractPath);

const compileInfo = {
  language: "Solidity",
  sources: fileNames.reduce((input, fileName) => {
    const filePath = path.resolve(contractPath, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    return { ...input, [fileName]: { content: source } };
  }, {}),
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(compileInfo)));
fs.ensureDirSync(buildPath);


// set ganache as provider
const ganache = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(ganache);

// Here, we get the abi from contract
const { Route } = compiled.contracts["Route.sol"]
const { abi, evm } = Route // We'll use the "evm" variable later

// Here we get the contract information
const contract = new web3.eth.Contract(abi);

// Here, using the the bytecode, we deploy the contract
const deploy = async () => {
  const addresses = await web3.eth.getAccounts();
  const gasPrice = await web3.eth.getGasPrice();

  contract.deploy({
    data: evm.bytecode.object,
    arguments: [
      "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6",
      "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6",
      "40º",
      "39º",
      -10,
      -99,
      "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6"
    ]
  })
  .send({
    from: addresses[0],
    gas: 1000000,
    gasPrice,
  })
  .on('confirmation', async (confNumber, receipt) => {
    const { contractAddress } = receipt
    console.log("Contract's address: ", contractAddress);
    const contractInstance = new web3.eth.Contract(abi, contractAddress)
    let metodos = contractInstance.methods;
    contractInstance.methods.checkTemperature(20, 0).send({from: "0x6cAc62cAd7813ad4c3F5C58c17a9197E1Ac11B00"});
  })
  .on('error', (err) => {
    console.log("Failed to deploy:", error) 
  })
}

deploy();


