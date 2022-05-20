const Web3Contract = require('./Web3Contract.js');
contractAddress = "0x58bAA8CFB788Fbf64c1a6498d6dAe5ADC4B8EF7a"
address = "0x5154bE9474673cC5C1134Ff021DEce8369ae9743"

contract = new Web3Contract(contractAddress, address);


contract.getCurrentRouteManager(0, address);
