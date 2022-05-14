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

const contract = new web3.eth.Contract(abi, "0x38Dca269f97A09053513C53D56FD62eD3912a43e")

try{
    getAddresses().then(({receiver, sender}) =>{
        to = receiver;
        from = sender;

        
        //changeCurrentManager(to, 0, from);
        //checkTemperature(50, 0, from);
        //changeCurrentManager(from, 0,to);
        //setNewTemperatureValues(0,-5, -99, from);
        //setNewDestiny(0, "50.12345123", "150.1231456", from)

        //getDestinyCoordinates(sender)
        //getCurrentSensorManager(0,from)
        //getCurrentSensorManager(0,from)
        //getAlertList();
   });

}catch(exception){
    console.error("Error trying to obtain addresses")
}


/* FUNCTIONS */

    // Setters

function checkTemperature(temperature, sensorId, senderAddress) {
    contract.methods.checkTemperature(temperature, sensorId).send({ from: senderAddress,gas: 150000, gasPrice: '3000' })
    .then((res)=>{

    })
}

function changeCurrentManager(newManager, sensorId, senderAddress) {
    contract.methods.changeCurrentManager(newManager, sensorId).send({ from: senderAddress })
        .then(() => getCurrentSensorManager(sensorId, senderAddress));
}

function setNewDestiny(sensorId, newLatitude, newLongitude, senderAddress){
    contract.methods.setNewDestiny(sensorId,newLatitude,newLongitude).send({ from: senderAddress,gas: 150000, gasPrice: '3000' });
}

function setNewTemperatureValues(sensorId, newLimitTemperature, newHigherTemperature, senderAddress){
    contract.methods.setNewTemperatureValues(sensorId,newLimitTemperature,newHigherTemperature).send({ from: senderAddress,gas: 150000, gasPrice: '3000' });
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
        console.log("\t Latitude: "+res[0])
        console.log("\t Longitude: "+res[1])
    })
}

function getAlertList(senderAddress) {
    contract.methods.getAlertList().call({ from: senderAddress }).then((res) => {
        console.log("The list of alerts:\n");
        console.table(res);
    });
}