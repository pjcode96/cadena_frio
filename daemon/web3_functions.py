from web3 import Web3
from solcx import compile_source
import sys

provider = Web3.HTTPProvider('http://localhost:7545')
web3 = Web3(provider)
address = '0x608c9f595EAAe822511a89AcE833Cf7865a49DB4';
contract_address = '0x07C02FfdFD3a81C15cc06b0C1d7b1E4822578891'

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
contract.transact().createRoute(address,address,'25º', '32.5º', -20, -50)