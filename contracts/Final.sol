// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
import "./SensorFactory.sol";

contract Route is SensorFactory {
    address sender;
    address receiver;
    Coordinates destinyCoordinates;
    uint sensorId;
    AlertRecord [] alerts;
    
    constructor(address _sender,address _receiver,string memory _destinyLatitude,string memory _destinyLongitude,int256 _limitTemperature,int256 _higherTemperature,address _currentManager) {
        sender = _sender;
        receiver = _receiver;
        destinyCoordinates = Coordinates(_destinyLatitude,_destinyLongitude);
        sensorId = _createSensor(_limitTemperature,_higherTemperature,_currentManager);
    }


    









    // STRUCTS
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
    event TemperatureExceeded(
        uint256 sensorId,
        uint256 timestamp,
        address currentManager
    );

    event ManagerChanged(
        uint256 sensorId,
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

        // SETTERS
    /**
     *  This function checks if the given temperature is higher than limitTemperature, if so,
     *  an alert is emitted
     */
    function checkTemperature(int256 _temperature, uint256 _sensorId) public {
        require(sensors[_sensorId].currentManager == msg.sender,"The sender isn't the contract's owner");

        if (_temperature > sensors[_sensorId].limitTemperature) {
            if (_temperature > sensors[_sensorId].higherTemperature) {
                sensors[_sensorId].higherTemperature = _temperature;
            }
            
            alerts.push(AlertRecord(block.timestamp, _temperature, sensors[_sensorId].currentManager));
            emit TemperatureExceeded(_sensorId,block.timestamp,sensors[_sensorId].currentManager);
        }
    }

    function changeCurrentManager(address _newManager, uint256 _sensorId)
        public
    {
        address sensorPreviousManager = sensors[_sensorId].currentManager;
        require(
            sensorPreviousManager == msg.sender,
            "You're not the current manager"
        );

        sensors[sensorId].currentManager = _newManager;
        emit ManagerChanged(sensorId,block.timestamp,sensorPreviousManager,_newManager);
    }

    function setNewDestiny(uint _sensorId, string memory _latitude, string memory _longitude) public {
        require(sensors[_sensorId].currentManager == msg.sender,
                "You're not the current manager"
        );

        Coordinates memory previousCoordinates = destinyCoordinates;

        destinyCoordinates.latitude = _latitude;
        destinyCoordinates.longitude = _longitude;

        emit DestinyChanged(previousCoordinates, destinyCoordinates, block.timestamp, sensors[_sensorId].currentManager);
    }

    function setNewTemperatureValues(uint _sensorId, int _limitTemperature, int _higherTemperature) public{
        require(sensors[_sensorId].currentManager == msg.sender,
            "You're not the current manager"
        );

        emit TemperatureValuesChanged(
            sensors[_sensorId].limitTemperature,
            sensors[_sensorId].higherTemperature, 
            _limitTemperature, 
            _higherTemperature, 
            sensors[_sensorId].currentManager
        );

        sensors[_sensorId].limitTemperature = _limitTemperature;
        sensors[_sensorId].higherTemperature = _higherTemperature;
    }


        // GETTERS

    function getCurrentSensorManager(uint _sensorId) public view returns(address){
        return sensors[_sensorId].currentManager;
    }

    function getDestinyCoordinates() public view returns(Coordinates memory){
        return destinyCoordinates;
    }

    function getAlertList() public view returns(AlertRecord [] memory){
        return alerts;
    }
}
