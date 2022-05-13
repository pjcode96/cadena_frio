const Web3 = require('web3');   // Web3 library
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const fs = require("fs-extra"); // Library for file treatment

const contractAddress = "0x542cdbefe4d324BcD873Da4a03A33b58a7805cf6";

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
const from = web3.utils.toChecksumAddress("0xb4c905384a3590281D78AdF8D713d6e0bd4025B6");

// Here, we get the abi from contract
const { Route } = compiled.contracts["Route.sol"]
const { abi, evm } = Route // We'll use the "evm" variable later

const contract = new web3.eth.Contract(abi, "0x66Ae99CcF6c23FD0Dee39EEB11E153A78512c469")
//checkTemperature(30, 0, from);
getCurrentSensorManager(0, from)
//changeCurrentManager(web3.utils.toChecksumAddress("0x542cdbefe4d324BcD873Da4a03A33b58a7805cf5"), 0,from);
//getCurrentSensorManager(0,from)

// TODO: revisar el contrato inteligente para que el sensor solo tenga manager 


function checkTemperature(temperature, sensorId, senderAddress) {
    contract.methods.checkTemperature(temperature, sensorId).send({ from: senderAddress })
}

function changeCurrentManager(newManager, sensorId, senderAddress) {
    contract.methods.changeCurrentManager(newManager, sensorId).send({ from: senderAddress });
}

function getCurrentSensorManager(sensorId, senderAddress) {
    contract.methods.getCurrentSensorManager(sensorId).call({ from: senderAddress }).then((res) => {
        console.log("The current manager's address is: " + res);
    })
}