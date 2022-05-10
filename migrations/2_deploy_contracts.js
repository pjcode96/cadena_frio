var Route = artifacts.require("Route");
var SensorFactory = artifacts.require("SensorFactory");
var address = "0x4552F91A80Fc9242f3B1cEb26276e9DCADb65C76";
module.exports = deployer => {
    deployer.deploy(Route,
        address,
        address,
        "40º",
        "39º",
        -10,
        -99,
        address
        );
        
    deployer.deploy(SensorFactory);
};