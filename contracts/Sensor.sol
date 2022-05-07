// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./SensorFactory.sol";

contract Sensor is SensorFactory{
    //TODO
    /*
    Añadir responsable,
    checkpoints,
    receptor,
    emisor,
    coordenadas,
    timestamp de la medida
    */

    constructor(int _limitTemperature, int _higherTemperature) { //Parametrizar límites de temperatura
        //contractOwner = address goes here;
        limitTemperature = _limitTemperature;
        higherTemperature = _higherTemperature;
    }
 
    event alert(address indexed _to, int _temperature);

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