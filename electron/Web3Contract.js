const Web3 = require('web3');   // Web3 library
const solc = require('solc');   // Library for compile
const path = require("path");   // LIbrary to manage path
const fs = require("fs-extra"); // Library for file treatment

class Web3Contract {

    constructor(contractAddress) {
        this.contract = this.getContract(contractAddress);
    }

    async createRoute(sender, receiver, destinationLatitude, destinationLongitude, limitTemperature, higherTemperature, senderAddress) {
        return this.contract.methods.createRoute(sender, receiver, destinationLatitude, destinationLongitude, limitTemperature, higherTemperature)
            .send({ from: senderAddress, gas: 2000000, gasPrice: '3000000000' })
            .then((res) => res.events.NewRoute.returnValues[0]);
    }

    async checkTemperature(temperature, routeId, senderAddress) {
        return this.contract.methods.checkTemperature(temperature, routeId).send({ from: senderAddress, gas: 2000000, gasPrice: '3000000000' })
            .then((res) => {
                console.log("Temperature exceeded: " + temperature + "º");
            })
    }

    async changeCurrentManager(newManager, routeId, senderAddress) {
        return this.contract.methods.changeCurrentManager(newManager, routeId).send({ from: senderAddress })
            .then((res) => {
                let result = {
                    previousManager: res.events.ManagerChanged.returnValues[2],
                    newManager: res.events.ManagerChanged.returnValues[3]
                }
                return result;
            });
    }

    async setNewDestination(routeId, newLatitude, newLongitude, senderAddress) {
        return this.contract.methods.setNewDestination(routeId, newLatitude, newLongitude).send({ from: senderAddress, gas: 2000000, gasPrice: '3000000000' })
            .then((res) => res);
    }

    async setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature, senderAddress) {
        return this.contract.methods.setNewTemperatureValues(routeId, newLimitTemperature, newHigherTemperature).send({ from: senderAddress, gas: 150000, gasPrice: '3000' });
    }

    // Getters

    async getCurrentRouteManager(routeId, senderAddress) {
        if (routeId) {
            return this.contract.methods.getCurrentRouteManager(routeId).call({ from: senderAddress })
                .then((res) => res)
        } else return null;
    }

    async getDestinationCoordinates(routeId, senderAddress) {
        if (routeId) {
            return this.contract.methods.getDestinationCoordinates(routeId).call({ from: senderAddress }).then((res) => res)
        } else return null;
    }

    async getAlertList(senderAddress) {
        return this.contract.methods.getAlertList().call({ from: senderAddress }).then((res) => res);
    }

    async getRouteData(routeId, senderAddress) {
        return this.contract.methods.getRouteData(routeId).call({ from: senderAddress }).then((res) => {
            return res;
        }
        );
    }

    getContract(contractAddress) {

        const buildPath = path.resolve(__dirname, "../build");

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
        let { abi } = RouteFactory

        return new web3.eth.Contract(abi, contractAddress)
    }
}

module.exports = Web3Contract;
