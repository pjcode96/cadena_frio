const fs = require("fs-extra"); // library for file treatment
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const Web3 = require('web3');


const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts");
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
console.log(compiled)
fs.ensureDirSync(buildPath);


// set ganache as provider
const ganache = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(ganache);

// Here, we get the abi from contract
const { Route } = compiled.contracts["Route.sol"]
const { abi, evm } = Route // We'll use the "evm" variable later

// Here we get the contract information
const contract = new web3.eth.Contract(abi);

console.log(contract);