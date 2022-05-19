// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract RouteFactory {
    
    Route [] routes;
    Sensor [] sensors;
    AlertRecord [] alerts;


    // STRUCTS

    struct Sensor {
        int limitTemperature;
        int higherTemperature;
    }

    struct Route{
        address sender;
        address receiver;
        string destinyLatitude;
        string destinyLongitude;
        address currentManager;
        uint sensorId;
    }

    struct Coordinates {
        string latitude;
        string longitude;
    }

    struct AlertRecord { 
        uint256 timestamp;
        int registeredTemperature;
        address manager;
    }

    // EVENTS

    event NewSensor(uint sensorId);

    event TemperatureExceeded(
        uint256 sensorId,
        uint256 timestamp,
        address currentManager
    );

    event ManagerChanged(
        uint256 routeId,
        uint256 timestamp,
        address previousManager,
        address newManager
    );

    event DestinyChanged(
        Coordinates previousCoordinates,
        Coordinates newCoordinates,
        uint256 timestamp,
        address manager
    );

    event TemperatureValuesChanged(
        int previousLimitTemperature,
        int previousHigherTemperature,
        int newLimitTemperature,
        int newHigherTemperature,
        address manager
    );
    

    /* CONTRACT'S FUNCTIONS */

    function createSensor(int _limitTemperature, int _higherTemperature) internal returns(uint){
        
        uint sensorId = 0;

        sensors.push(Sensor(_limitTemperature, _higherTemperature));

        sensorId = sensors.length -1;
        emit NewSensor(sensorId);
        return sensorId;
    }

    function createRoute(address _sender,address _receiver,string memory _destinyLatitude,string memory _destinyLongitude, int _limitTemperature, int _higherTemperature) public returns(uint){
        uint routeId = 0;
        uint sensorId = createSensor(_limitTemperature, _higherTemperature);

        routes.push(Route(_sender, _receiver, _destinyLatitude, _destinyLongitude, msg.sender, sensorId));
        routeId = routes.length-1;
        return routeId;
    }  

        // SETTERS
    /**
     *  This function checks if the given temperature is higher than limitTemperature, if so,
     *  an alert is emitted
     */
    function checkTemperature(int256 _temperature, uint256 _routeId) public  returns(uint){
        require(routes[_routeId].currentManager == msg.sender,"The sender isn't the contract's owner");

        Sensor memory sensor = sensors[routes[_routeId].sensorId];
        address currentManager = routes[_routeId].currentManager;

        if (_temperature > sensor.limitTemperature) {
            if (_temperature > sensor.higherTemperature) {
                sensor.higherTemperature = _temperature;
            }
            
            alerts.push(AlertRecord(block.timestamp, _temperature, currentManager));
            emit TemperatureExceeded(
                routes[_routeId].sensorId,
                block.timestamp,
                currentManager
            );
            return alerts.length-1;
        }
    }

    function changeCurrentManager(address _newManager, uint256 _routeId) public returns(address){
        address sensorPreviousManager = routes[_routeId].currentManager;

        require(
            sensorPreviousManager == msg.sender,
            "You're not the current manager"
        );

        routes[_routeId].currentManager = _newManager;
        emit ManagerChanged(_routeId,block.timestamp,sensorPreviousManager,_newManager);
        return _newManager;
    }

    function setNewDestiny(uint _routeId, string memory _latitude, string memory _longitude) public {
        require(routes[_routeId].currentManager == msg.sender,
                "You're not the current manager"
        );

        Coordinates memory previousCoordinates = Coordinates(routes[_routeId].destinyLatitude, routes[_routeId].destinyLongitude);
        Coordinates memory newCoordinates = Coordinates(_latitude, _longitude);

        routes[_routeId].destinyLatitude = _latitude;
        routes[_routeId].destinyLongitude = _longitude;

        emit DestinyChanged(previousCoordinates, newCoordinates, block.timestamp, routes[_routeId].currentManager);
    }

    function setNewTemperatureValues(uint _routeId, int _limitTemperature, int _higherTemperature) public{
        require(routes[_routeId].currentManager == msg.sender,
            "You're not the current manager"
        );
        
        uint sensorId = routes[_routeId].sensorId;

        emit TemperatureValuesChanged(
            sensors[sensorId].limitTemperature,
            sensors[sensorId].higherTemperature, 
            _limitTemperature, 
            _higherTemperature, 
            routes[_routeId].currentManager
        );

        sensors[sensorId].limitTemperature = _limitTemperature;
        sensors[sensorId].higherTemperature = _higherTemperature;
    }


        // GETTERS  

    function getCurrentRouteManager(uint _routeId) public view returns(address){
        return routes[_routeId].currentManager;
    }

    function getDestinyCoordinates(uint _routeId) public view returns(Coordinates memory){
        return Coordinates(routes[_routeId].destinyLatitude,routes[_routeId].destinyLongitude);
    }

    function getAlertList() public view returns(AlertRecord [] memory){
        return alerts;
    }
}
