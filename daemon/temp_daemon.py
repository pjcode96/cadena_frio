from sense_hat import SenseHat
import time
from web3 import Web3
from solcx import compile_source,install_solc
import sys

def checkTemperature(temperature, sensorId):
    contract.functions.checkTemperature(int(temperature), sensorId).transact()
    
def compile_contract(contract_path):
    with open(contract_path, 'r') as contract_file:
        code = contract_file.read()

    return compile_source(code)

provider = Web3.HTTPProvider('http://192.168.1.238:7545')
web3 = Web3(provider)
address = '0x608c9f595EAAe822511a89AcE833Cf7865a49DB4';
contract_address = '0x066f2FcffD038eB4C1D1bbBfe24ac831cb6Df6F8'


abi = '[{"anonymous":false,"inputs":[{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"indexed":false,"internalType":"struct RouteFactory.Coordinates","name":"previousCoordinates","type":"tuple"},{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"indexed":false,"internalType":"struct RouteFactory.Coordinates","name":"newCoordinates","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"manager","type":"address"}],"name":"DestinationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"routeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"previousManager","type":"address"},{"indexed":false,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"routeId","type":"uint256"}],"name":"NewRoute","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"sensorId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"currentManager","type":"address"}],"name":"TemperatureExceeded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int256","name":"previousLimitTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"previousHigherTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"newLimitTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"newHigherTemperature","type":"int256"},{"indexed":false,"internalType":"address","name":"manager","type":"address"}],"name":"TemperatureValuesChanged","type":"event"},{"inputs":[{"internalType":"address","name":"_newManager","type":"address"},{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"changeCurrentManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"_temperature","type":"int256"},{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"checkTemperature","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"string","name":"_destinationLatitude","type":"string"},{"internalType":"string","name":"_destinationLongitude","type":"string"},{"internalType":"int256","name":"_limitTemperature","type":"int256"},{"internalType":"int256","name":"_higherTemperature","type":"int256"}],"name":"createRoute","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAlertList","outputs":[{"components":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"int256","name":"registeredTemperature","type":"int256"},{"internalType":"address","name":"manager","type":"address"}],"internalType":"struct RouteFactory.AlertRecord[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"getCurrentRouteManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"getDestinationCoordinates","outputs":[{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"internalType":"struct RouteFactory.Coordinates","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"getRouteData","outputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"string","name":"destinationLatitude","type":"string"},{"internalType":"string","name":"destinationLongitude","type":"string"},{"internalType":"address","name":"currentManager","type":"address"},{"internalType":"uint256","name":"sensorId","type":"uint256"}],"internalType":"struct RouteFactory.Route","name":"","type":"tuple"},{"components":[{"internalType":"int256","name":"limitTemperature","type":"int256"},{"internalType":"int256","name":"higherTemperature","type":"int256"}],"internalType":"struct RouteFactory.Sensor","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sensorId","type":"uint256"}],"name":"getTemperatureValues","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"},{"internalType":"string","name":"_latitude","type":"string"},{"internalType":"string","name":"_longitude","type":"string"}],"name":"setNewDestination","outputs":[{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"internalType":"struct RouteFactory.Coordinates","name":"","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"},{"internalType":"int256","name":"_limitTemperature","type":"int256"},{"internalType":"int256","name":"_higherTemperature","type":"int256"}],"name":"setNewTemperatureValues","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

contract = web3.eth.contract(address=contract_address, abi=abi)

account = '0x608c9f595EAAe822511a89AcE833Cf7865a49DB4'
web3.eth.defaultAccount = account

senseHat = SenseHat()
limitTemperature = 0;
isContinued = False;
sensorId = 0;


while True:
    temperature = senseHat.get_temperature()

    if(temperature > limitTemperature):
        print("max temp exceeded, waiting for next reading...")
        if(isContinued):
            print("The overpassed temperature is continuous, sending value to Blockchain...")
            checkTemperature(temperature, sensorId)
        else:
            isContinued = True


    print(temperature)
    time.sleep(5)



