// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Ownable.sol";

contract Temperature is Ownable{

    //State variables
    address public contractOwner;
    int public limitTemperature;
    int public higherTemperature;

    constructor() {
        //contractOwner = address goes here;
        limitTemperature = -10;
        higherTemperature = -99;
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