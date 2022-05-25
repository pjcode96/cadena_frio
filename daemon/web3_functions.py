from web3 import Web3
from solcx import compile_source
import sys

provider = Web3.IPCProvider('http://localhost:7545')
web3 = Web3(provider)

contract_address = '0x9a420beAe19F55C4F02D7d3493C81114187B9Fb8'

abi = '[{"anonymous":false,"inputs":[{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"indexed":false,"internalType":"struct RouteFactory.Coordinates","name":"previousCoordinates","type":"tuple"},{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"indexed":false,"internalType":"struct RouteFactory.Coordinates","name":"newCoordinates","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"manager","type":"address"}],"name":"DestinyChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"routeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"previousManager","type":"address"},{"indexed":false,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"sensorId","type":"uint256"}],"name":"NewSensor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"sensorId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"currentManager","type":"address"}],"name":"TemperatureExceeded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int256","name":"previousLimitTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"previousHigherTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"newLimitTemperature","type":"int256"},{"indexed":false,"internalType":"int256","name":"newHigherTemperature","type":"int256"},{"indexed":false,"internalType":"address","name":"manager","type":"address"}],"name":"TemperatureValuesChanged","type":"event"},{"inputs":[{"internalType":"address","name":"_newManager","type":"address"},{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"changeCurrentManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"_temperature","type":"int256"},{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"checkTemperature","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"string","name":"_destinyLatitude","type":"string"},{"internalType":"string","name":"_destinyLongitude","type":"string"},{"internalType":"int256","name":"_limitTemperature","type":"int256"},{"internalType":"int256","name":"_higherTemperature","type":"int256"}],"name":"createRoute","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"},{"internalType":"string","name":"_latitude","type":"string"},{"internalType":"string","name":"_longitude","type":"string"}],"name":"setNewDestiny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"},{"internalType":"int256","name":"_limitTemperature","type":"int256"},{"internalType":"int256","name":"_higherTemperature","type":"int256"}],"name":"setNewTemperatureValues","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAlertList","outputs":[{"components":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"int256","name":"registeredTemperature","type":"int256"},{"internalType":"address","name":"manager","type":"address"}],"internalType":"struct RouteFactory.AlertRecord[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"getCurrentRouteManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_routeId","type":"uint256"}],"name":"getDestinyCoordinates","outputs":[{"components":[{"internalType":"string","name":"latitude","type":"string"},{"internalType":"string","name":"longitude","type":"string"}],"internalType":"struct RouteFactory.Coordinates","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}]'


def compile_contract(contract_path):
    with open(contract_path, 'r') as contract_file:
        code = contract_file.read()

    return compile_source(code)


contract_path = './contracts/RouteFactory.sol'
compiled_contract = compile_contract(contract_path)

contract_interface = compiled_contract.popitem()

abi = contract_interface[1]['abi']

contract = web3.eth.contract(address=contract_address, abi=abi)

account = '0x5154bE9474673cC5C1134Ff021DEce8369ae9743'
web3.eth.defaultAccount = account
result = contract.functions.getCurrentRouteManager(0).call()#createRoute(account, account, "50º", "30º", -10, -150)
print(contract.functions.getCurrentRouteManager(0))