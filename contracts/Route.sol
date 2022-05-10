// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./SensorFactory.sol";


contract Route is SensorFactory{
    
    constructor(address _sender, address _receiver, string memory _destinyLatitude, string memory _destinyLongitude, int _limitTemperature, int _higherTemperature, address _currentManager){
        address sender = _sender;
        address receiver = _receiver;
        destinyCoordinates memory coordinates = destinyCoordinates(_destinyLatitude, _destinyLongitude);
        uint sensorId = _createSensor(_limitTemperature, _higherTemperature, _currentManager);
        Sensor memory sensor = sensors[sensorId];
    }

    struct destinyCoordinates {
        string latitude;
        string longitude;
    }

    event TemperatureExceeded(uint sensorId, uint timestamp, address currentManager);
    event ManagerChanged(uint sensorId, uint timestamp, address previousManager, address newManager);
    
    /**
     *  This function checks if the given temperature is higher than limitTemperature, if so,
     *  an alert is emitted
     */
    function checkTemperature(int _temperature, uint sensorId) public onlyOwner {

        Sensor memory sensor = sensors[sensorId];
        require(sensor.sensorAddress == msg.sender,"The sender isn't the contract's owner");
        require(_temperature <= sensor.limitTemperature,"Temperature is fine");
        if(_temperature > sensor.higherTemperature){
            sensor.higherTemperature = _temperature;
        }
        emit TemperatureExceeded(sensorId, block.timestamp, sensor.currentManager);
    }

    function changeCurrentManager(address _newManager, uint sensorId) public {
        address sensorPreviousManager = sensors[sensorId].currentManager;
        require(
            sensorPreviousManager == msg.sender,
            "You're not the current manager"
        );

        sensors[sensorId].currentManager = _newManager;
        emit ManagerChanged(sensorId, block.timestamp, sensorPreviousManager, _newManager);
    }
}