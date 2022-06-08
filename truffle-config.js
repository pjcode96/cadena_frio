const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "192.168.1.238", // Localhost (default: none)
            port: 7545, // Standard Ethereum port (default: none)
            network_id: "*" // Any network (default: none)
        }
    },
    compilers: {
        solc: {
            version: "0.8.0"
        }
    }
};
