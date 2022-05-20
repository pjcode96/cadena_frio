const Web3 = require('web3');   // Web3 library
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const fs = require("fs-extra"); // Library for file treatment

class Web3Contract {

    constructor(contractAddress, owner) {
        this.owner = owner;
        this.contract = this.getContract(contractAddress);
    }

    async checkTemperature(temperature, routeId, senderAddress) {
        this.contract.methods.checkTemperature(temperature, routeId).send({ from: senderAddress, gas: 2000000, gasPrice: '3000000000' })
            .then((res) => {
                console.log("Temperature exceeded: " + temperature + "º");
            })
    }

    async changeCurrentManager(newManager, routeId, senderAddress) {
        this.contract.methods.changeCurrentManager(newManager, routeId).send({ from: senderAddress })
            .then((res) => {
                console.log("Previous manager's address is: " + res.events.ManagerChanged.returnValues[2]);
                console.log("The new manager's address is: " + res.events.ManagerChanged.returnValues[3]);
            });
    }

    async setNewDestiny(routeId, newLatitude, newLongitude, senderAddress) {
        this.contract.methods.setNewDestiny(routeId, newLatitude, newLongitude).send({ from: senderAddress, gas: 2000000, gasPrice: '3000000000' })
            .then(() => console.log("Destiny has been changed"));
    }

    async setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature, senderAddress) {
        this.contract.methods.setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature).send({ from: senderAddress, gas: 150000, gasPrice: '3000' });
    }

    // Getters

    async getCurrentRouteManager(routeId, senderAddress) {
        this.contract.methods.getCurrentRouteManager(routeId).call({ from: senderAddress })
            .then((res) => {
                console.log("The current manager's address is: " + res);
            })
    }

    async getDestinyCoordinates(routeId, senderAddress) {
        this.contract.methods.getDestinyCoordinates(routeId).call({ from: senderAddress }).then((res) => {
            console.log("The destiny coordinates are: ");
            console.log("\t Latitude: " + res[0])
            console.log("\t Longitude: " + res[1])
        })
    }

    async getAlertList(senderAddress) {
        this.contract.methods.getAlertList().call({ from: senderAddress }).then((res) => {
            console.log("The list of alerts:\n");
            console.table(res);
        });
    }

    getContract(contractAddress){

        const buildPath = path.resolve(__dirname, "../build");
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
                        "*": ["abi"],
                    },
                },
            },
        };

        let compiled = JSON.parse(solc.compile(JSON.stringify(compileInfo)));
        fs.ensureDirSync(buildPath);

        let ganache = new Web3.providers.HttpProvider("http://localhost:7545");
        let web3 = new Web3(ganache);

        // Here, we get the abi from contract
        let { RouteFactory } = compiled.contracts["RouteFactory.sol"]
        let { abi} = RouteFactory

        return new web3.eth.Contract(abi, contractAddress)
    }
}

module.exports = Web3Contract;
