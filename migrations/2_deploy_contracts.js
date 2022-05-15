// var Route = artifacts.require("Route");
// var SensorFactory = artifacts.require("SensorFactory");
var RouteFactory = artifacts.require("RouteFactory");
//var address = "0x5aD56bEEE5980a974AE121257b61A16E882407D9";
module.exports = deployer => {
    deployer.deploy(RouteFactory);
        
    //deployer.deploy(SensorFactory);
};