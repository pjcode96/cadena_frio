from sense_hat import SenseHat
import time
from web3 import Web3
from web3.middleware import geth_poa_middleware
import json

def checkTemperature(temperature, sensorId):
    contract.functions.checkTemperature(int(temperature), sensorId).transact()

def getTemperatureValue(sensorId):
    return contract.functions.getTemperatureValue(sensorId).call()

def getCurrentRouteManager(sensorId):
    return contract.functions.getCurrentRouteManager(sensorId).call()

provider = Web3.HTTPProvider('http://192.168.1.239:8545')
web3 = Web3(provider)
sensorId = 0
contract_address = '0xE6Fa929Cde6580bf12337F453B0987d2B1997118'

with open("build/contracts/RouteFactory.json") as buidlFile:
    info_json = json.load(buidlFile)
abi = info_json["abi"]

contract = web3.eth.contract(address=contract_address, abi=abi)
account = getCurrentRouteManager(sensorId)
print("Manager account set to", account)
web3.eth.defaultAccount = account
web3.middleware_onion.inject(geth_poa_middleware, layer=0)

senseHat = SenseHat()
limitTemperature = getTemperatureValue(sensorId)
previousLimitTemperature = getTemperatureValue(sensorId)
previousManager = account
isContinued = False;

temperature = senseHat.get_temperature()
print("Temperature limit set to", limitTemperature)

while True:
    newTemperature = getTemperatureValue(sensorId)
    newManager = getCurrentRouteManager(sensorId)
    if previousLimitTemperature and newTemperature != previousLimitTemperature:
        limitTemperature = newTemperature
        previousLimitTemperature = newTemperature
        print("Temperature updated to", limitTemperature)
    
    if previousManager and newManager != previousManager:
        account = newManager
        previousManager = newManager
        web3.eth.defaultAccount = account
        print("Manager updated to", account)

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