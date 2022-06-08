import time
from web3 import Web3
from solcx import compile_source

def checkTemperature(temperature, routeId):
  contract.functions.checkTemperature(temperature, routeId).transact()

def getLimitTemperatureValue(sensorId):
  prueba = contract.functions.getLimitTemperatureValue(sensorId).call()
  return contract.functions.getLimitTemperatureValue(sensorId).call()
    
def compile_contract(contract_path):
  with open(contract_path, 'r') as contract_file:
    code = contract_file.read()

  return compile_source(code)

provider = Web3.HTTPProvider('http://localhost:7545')
web3 = Web3(provider)
address = '0x608c9f595EAAe822511a89AcE833Cf7865a49DB4';
contract_address = '0xf8c138163595f78c2B29003Cb08AD7eaD8E0834E'

contract_path = "/home/pj/Desktop/proyecto/cadena_frio/contracts/RouteFactory.sol"
compiled_contract = compile_contract(contract_path)

contract_interface = compiled_contract.popitem()

abi = contract_interface[1]['abi']

contract = web3.eth.contract(address=contract_address, abi=abi)

account = '0x608c9f595EAAe822511a89AcE833Cf7865a49DB4'
web3.eth.defaultAccount = account

isContinued = False;
routeId = 0;
sensorId = 0;
limitTemperature = getLimitTemperatureValue(sensorId);


while True:
  temperature = 10;

  if(temperature > limitTemperature):
    print("max temp exceeded, waiting for the next reading...")
    if(isContinued):
      print("Temperature limit continues to be exceeded, sending value to Blockchain...")
      checkTemperature(temperature, routeId)
    else:
      isContinued = True
  else:
    print("Temperature under limits")
    isContinued = False

  print(temperature)
  limitTemperature = getLimitTemperatureValue(sensorId)
  time.sleep(5)