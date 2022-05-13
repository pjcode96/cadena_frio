var Route = artifacts.require("Route");
var SensorFactory = artifacts.require("SensorFactory");
var address = "0xb4c905384a3590281D78AdF8D713d6e0bd4025B6";
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