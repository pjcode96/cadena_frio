// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./SensorFactory.sol";

contract Sensor{
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
        int limitTemperature = _limitTemperature;
        higherTemperature = _higherTemperature;
    }
 
    event alert(address indexed _to, int _temperature);

    
}