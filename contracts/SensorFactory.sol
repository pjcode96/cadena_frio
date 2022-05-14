// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "@openzeppelin/contracts/access/Ownable.sol";

contract SensorFactory {

    struct Sensor {
        int limitTemperature;
        int higherTemperature;
        address currentManager;
    }

    Sensor[] public sensors;
    mapping (uint=>address) public sensorToOwner;
    event NewSensor(uint sensorId);

    function _createSensor(int _limitTemperature, int _higherTemperature, address _currentManager) internal returns(uint){
        
        uint id = 0;
        sensors.push(Sensor(_limitTemperature, _higherTemperature, _currentManager));
        if(sensors.length == 0){
            id = 1;
        }else{
            id = sensors.length -1;
        }
        emit NewSensor(id);
        return id;
    }
}