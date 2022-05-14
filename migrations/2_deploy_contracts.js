var Route = artifacts.require("Route");
var SensorFactory = artifacts.require("SensorFactory");
var address = "0x082D009811daD1460BEF0BB858cb671bc3A96888";
module.exports = deployer => {
    deployer.deploy(Route,
        address,
        address,
        "40º",
        "39º",
        -10,
        -30,
        address
        );
        
    deployer.deploy(SensorFactory);
};