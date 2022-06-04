from sense_hat import SenseHat
import time
from web3 import Web3
from solcx import compile_source
import sys

def checkTemperature(sensorId):
    contract.functions.checkTemperature(temperature, sensorId).transact()
    
def compile_contract(contract_path):
    with open(contract_path, 'r') as contract_file:
        code = contract_file.read()

    return compile_source(code)

provider = Web3.HTTPProvider('http://localhost:7545')
web3 = Web3(provider)
address = '0x1421BB0212dF4865aF2a617A54F74Dbb2B081d9c';
contract_address = '0x4e7b8Fe2c459141D4fc9AAD6b807cbaF0464ceEE'

contract_path = "/home/pj/Desktop/proyecto/cadena_frio/contracts/RouteFactory.sol"
compiled_contract = compile_contract(contract_path)

contract_interface = compiled_contract.popitem()

abi = contract_interface[1]['abi']

contract = web3.eth.contract(address=contract_address, abi=abi)

account = '0x1421BB0212dF4865aF2a617A54F74Dbb2B081d9c'
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
    time.sleep(300)



