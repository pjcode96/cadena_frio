// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Route.sol";

contract SensorFactory is Ownable {

    struct Sensor {
        int limitTemperature;
        int higherTemperature;
        address currentOwner;
    }

    struct AlertRecord { 
        int timestamp;
        int registeredTemperature;
        int owner;
    }

    Sensor[] public sensors;
    event NewSensor(uint sensorId);

    function _createSensor(int _limitTemperature, int _higherTemperature, address _to, address _from) internal {
        
        sensors.push(Sensor(_limitTemperature, _higherTemperature,_to,_from, msg.sender));
        uint id = sensors.length-1;
        emit NewSensor(id);
    }
}
