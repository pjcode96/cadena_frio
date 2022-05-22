const Web3Contract = require('./Web3Contract.js');

const contractAddress = "0x9a420beAe19F55C4F02D7d3493C81114187B9Fb8"
const address = "0x5154bE9474673cC5C1134Ff021DEce8369ae9743"

function main(args) {

    let w3contract = new Web3Contract(contractAddress, address);

    if (args.length > 2) {
        switch (args[2]) {
            case '-m':
                w3contract.getCurrentRouteManager(args[3], address).then(
                    (res) => {
                        if (res) console.log("The current route manager's address is:" + res)
                        else console.log("Error")
                    }
                )
                break;

            case '-d':
                w3contract.getDestinationCoordinates(args[3], address).then(
                    (res) => {
                        if (res) {
                            console.log('The destination coordinates are: ');
                            console.log('\t Latitude: ' + res[0]);
                            console.log('\t Longitude: ' + res[1]);
                        } else console.log('Error')
                    }
                )
                break;

            case '-a':
                w3contract.getAlertList(address).then(
                    (res) => {
                        if (res) {
                            console.log('Alert list:')
                            console.table(res);
                        } else console.log('Error')
                    }
                )
                break;

            case '-n':
                if (args.length == 9) {
                    w3contract.createRoute(
                        sender = args[3],
                        receiver = args[4],
                        destinationLatitude = args[5],
                        destinationLongitude = args[6],
                        limitTemperature = args[7],
                        higherTemperature = args[8],
                        senderAddress = address
                    ).then((res) => {
                        if (res) {
                            console.log("The new route's id is: " + res)
                        } else console.log('Error')
                    })

                } else {
                    console.log("You must enter the correct number of arguments in a command like the following command:");
                    console.log("node -n js_file sender_address receiver_address destination_latitude destination_longitude limit_temperature higher_temperature")
                }
                break;

            case '-sm':
                w3contract.changeCurrentManager(newManager = args[4], routeId = args[3], address).then((res) => {
                    if (res) {
                        console.log("Previous manager's address is: " + res.previousManager);
                        console.log("The new manager's address is: " + res.newManager);
                    } else console.log("Error");
                })
                break;

            case '-sd':
                w3contract.setNewDestination().then((res) => {
                    console.log("Destination has been changed to:" + res)
                })
                break;

            case '-st':
                w3contract.setNewTemperatureValues(routeId = args[3], newLimitTemperature = args[4], newHigherTemperature = args[5], address).then((res) => {
                    console.log("Temperature limit changed to: " + args[4])
                    console.log("Highest temperature changed to: " + args[5])
                })
                break;

            case '-t':
                
                break;


            case '-h':

        }
    }
}

main(process.argv);