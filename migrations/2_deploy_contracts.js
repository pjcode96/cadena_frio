var RouteFactory = artifacts.require("RouteFactory");

module.exports = deployer => {
    deployer.deploy(RouteFactory);
};