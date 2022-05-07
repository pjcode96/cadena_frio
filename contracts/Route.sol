// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./SensorFactory.sol";


contract Route is SensorFactory{
    
    constructor(address _sender, address _receiver, address _currentRouteManager, string memory _destinyLatitude, string memory _destinyLongitude){
        address sender = _sender;
        address receiver = _receiver;
        address currentRouteManager = _currentRouteManager;
        destinyCoordinates memory coordinates = destinyCoordinates(_destinyLatitude, _destinyLongitude);
    }

    struct destinyCoordinates {
        string latitude;
        string longitude;
    }
    


    /**
     *  This function checks if the given temperature is higher than limitTemperature, if so,
     *  an alert is emitted
     */
    function checkTemperature(int _temperature) public onlyOwner {
        require(
            _temperature <= limitTemperature,
            "Temperature is fine"
        );

        if(_temperature > higherTemperature){
            higherTemperature = _temperature;
        }
        emit alert(contractOwner, _temperature);
    }
}