// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
import "./SensorFactory.sol";

contract Route is SensorFactory {
    constructor(
        address _sender,
        address _receiver,
        string memory _destinyLatitude,
        string memory _destinyLongitude,
        int256 _limitTemperature,
        int256 _higherTemperature,
        address _currentManager
    ) {
        address sender = _sender;
        address receiver = _receiver;
        destinyCoordinates memory coordinates = destinyCoordinates(
            _destinyLatitude,
            _destinyLongitude
        );
        uint256 sensorId = _createSensor(
            _limitTemperature,
            _higherTemperature,
            _currentManager
        );
        Sensor storage sensor = sensors[sensorId];
    }

    struct destinyCoordinates {
        string latitude;
        string longitude;
    }

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
    event Temp(int256 _temperature);

    /**
     *  This function checks if the given temperature is higher than limitTemperature, if so,
     *  an alert is emitted
     */
    function checkTemperature(int256 _temperature, uint256 sensorId) public {
        require(sensors[sensorId].sensorAddress == msg.sender,"The sender isn't the contract's owner");

        if (_temperature > sensors[sensorId].limitTemperature) {
            if (_temperature > sensors[sensorId].higherTemperature) {
                sensors[sensorId].higherTemperature = _temperature;
            }
            emit TemperatureExceeded(
                sensorId,
                block.timestamp,
                sensors[sensorId].currentManager
            );
        }
    }

    function changeCurrentManager(address _newManager, uint256 sensorId)
        public
    {
        address sensorPreviousManager = sensors[sensorId].currentManager;
        require(
            sensorPreviousManager == msg.sender,
            "You're not the current manager"
        );

        sensors[sensorId].currentManager = _newManager;
        emit ManagerChanged(
            sensorId,
            block.timestamp,
            sensorPreviousManager,
            _newManager
        );
    }
}
