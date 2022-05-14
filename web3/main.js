const Web3 = require('web3');   // Web3 library
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const fs = require("fs-extra"); // Library for file treatment

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

const getAddresses = async () => {
    const accounts = await web3.eth.getAccounts();
    const from = web3.utils.toChecksumAddress(accounts[0]);
    const to = web3.utils.toChecksumAddress(accounts[1]);
    return {receiver:to, sender:from}
}

const contract = new web3.eth.Contract(abi, "0x5Df84076493c93251a3D36551d1ea23D57d3A69F")

try{
    getAddresses().then(({receiver, sender}) =>{
        to = receiver;
        from = sender;

        //getDestinyCoordinates(sender)
        //getCurrentSensorManager(0, from)
        //changeCurrentManager(to, 0, from);
        checkTemperature(10, 0, from);
        //changeCurrentManager(from, 0,to);
        //getCurrentSensorManager(0,from)
   });

}catch(exception){
    console.error("Error trying to obtain addresses")
}


/* FUNCTIONS */

    // Setters

function checkTemperature(temperature, sensorId, senderAddress) {
    contract.methods.checkTemperature(temperature, sensorId).send({ from: senderAddress,gas: 150000, gasPrice: '3000' })
}

function changeCurrentManager(newManager, sensorId, senderAddress) {
    contract.methods.changeCurrentManager(newManager, sensorId).send({ from: senderAddress })
        .then(() => getCurrentSensorManager(sensorId, senderAddress));
}

    // Getters

function getCurrentSensorManager(sensorId, senderAddress) {
    contract.methods.getCurrentSensorManager(sensorId).call({ from: senderAddress }).then((res) => {
        console.log("The current manager's address is: " + res);
    })
}

function getDestinyCoordinates(senderAddress) {
    contract.methods.getDestinyCoordinates().call({ from: senderAddress }).then((res) => {
        console.log("The destiny coordinates are: " + res);
        console.log("\t Langitude: "+res[0])
        console.log("\t Longitude: "+res[1])
    })
}