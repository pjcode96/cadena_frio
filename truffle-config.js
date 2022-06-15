const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");

module.exports = {
    
    networks: {
        development: {
            host: "192.168.239",    // Localhost (default: none)
            port: 8545,             // Standard Ethereum port (default: none)
            network_id: "*"         // Any network (default: none)
        }
    },
    compilers: {
        solc: {
            version: "0.8.0"
        }
    }
};
