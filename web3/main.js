const Web3 = require('web3');   // Web3 library
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const fs = require("fs-extra"); // Library for file treatment

const from = "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6";
const contractAddress = "0x542cdbefe4d324BcD873Da4a03A33b58a7805cf6";


const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_destinyLatitude",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_destinyLongitude",
          "type": "string"
        },
        {
          "internalType": "int256",
          "name": "_limitTemperature",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "_higherTemperature",
          "type": "int256"
        },
        {
          "internalType": "address",
          "name": "_currentManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sensorId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "previousManager",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newManager",
          "type": "address"
        }
      ],
      "name": "ManagerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sensorId",
          "type": "uint256"
        }
      ],
      "name": "NewSensor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "int256",
          "name": "_temperature",
          "type": "int256"
        }
      ],
      "name": "Temp",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sensorId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "currentManager",
          "type": "address"
        }
      ],
      "name": "TemperatureExceeded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sensorToOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sensors",
      "outputs": [
        {
          "internalType": "int256",
          "name": "limitTemperature",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "higherTemperature",
          "type": "int256"
        },
        {
          "internalType": "address",
          "name": "sensorAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "currentManager",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "_temperature",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "sensorId",
          "type": "uint256"
        }
      ],
      "name": "checkTemperature",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newManager",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sensorId",
          "type": "uint256"
        }
      ],
      "name": "changeCurrentManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// set ganache as provider
const ganache = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(ganache);


const contract = new web3.eth.Contract(abi, "0x4C0fc291a4CDdB9220E82534ff57B86C7df072F9")
contract.methods.checkTemperature(20, 0).send({from: "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6"});