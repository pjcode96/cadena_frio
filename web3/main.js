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
const { RouteFactory } = compiled.contracts["RouteFactory.sol"]
const { abi, evm } = RouteFactory // We'll use the "evm" variable later

const getAddresses = async () => {
    const accounts = await web3.eth.getAccounts();
    const from = web3.utils.toChecksumAddress(accounts[0]);
    const to = web3.utils.toChecksumAddress(accounts[1]);
    return { receiver: to, sender: from }
}

const contract = new web3.eth.Contract(abi, "0x8E20c409E659d1e691029cB8C33275F05c701196")

try {
    getAddresses().then(({ receiver, sender }) => {
        to = receiver;
        from = sender;


        //createRoute(from, to, "30º", "120º", -10, -200, from)

        //changeCurrentManager(to, 0, from);
        //changeCurrentManager(from, 0,to);
        checkTemperature(50, 0, from);
        //setNewTemperatureValues(0,-5, -99, from);
        //setNewDestiny(0, "50.12345123", "150.1231456", from)

        //getDestinyCoordinates(3, sender)
        //getCurrentRouteManager(0,from)
        //getAlertList();
    });

} catch (exception) {
    console.error("Error trying to obtain addresses")
}


/* FUNCTIONS */

function createRoute(sender, receiver, destinyLatitude, destinyLongitude, limitTemperature, higherTemperature, senderAddress) {
    contract.methods.createRoute(sender, receiver, destinyLatitude, destinyLongitude, limitTemperature, higherTemperature)
        .send({ from: senderAddress, gas: 1500000, gasPrice: '30000' })
        .then((res) => {
            console.log("Route with ID " + res.events.NewSensor.returnValues[0] + " created");
        });
}

// Setters

function checkTemperature(temperature, routeId, senderAddress) {
    contract.methods.checkTemperature(temperature, routeId).send({ from: senderAddress, gas: 150000, gasPrice: '3000' })
        .then((res) => {
            console.log("Temperature exceeded: " + temperature + "º");
        })
}

function changeCurrentManager(newManager, routeId, senderAddress) {
    contract.methods.changeCurrentManager(newManager, routeId).send({ from: senderAddress })
        .then((res) => {
            console.log("Previous manager's address is: " + res.events.ManagerChanged.returnValues[2]);
            console.log("The new manager's address is: " + res.events.ManagerChanged.returnValues[3]);
        });
}

function setNewDestiny(routeId, newLatitude, newLongitude, senderAddress) {
    contract.methods.setNewDestiny(routeId, newLatitude, newLongitude).send({ from: senderAddress, gas: 150000, gasPrice: '3000' })
        .then(() => console.log("Destiny has been changed"));
}

function setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature, senderAddress) {
    contract.methods.setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature).send({ from: senderAddress, gas: 150000, gasPrice: '3000' });
}

// Getters

function getCurrentRouteManager(routeId, senderAddress) {
    contract.methods.getCurrentRouteManager(routeId).call({ from: senderAddress })
        .then((res) => {
            console.log("The current manager's address is: " + res);
        })
}

function getDestinyCoordinates(routeId, senderAddress) {
    contract.methods.getDestinyCoordinates(routeId).call({ from: senderAddress }).then((res) => {
        console.log("The destiny coordinates are: ");
        console.log("\t Latitude: " + res[0])
        console.log("\t Longitude: " + res[1])
    })
}

function getAlertList(senderAddress) {
    contract.methods.getAlertList().call({ from: senderAddress }).then((res) => {
        console.log("The list of alerts:\n");
        console.table(res);
    });
}