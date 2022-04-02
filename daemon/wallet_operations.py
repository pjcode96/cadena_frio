from eth_account import Account
import wallet
from os.path import exists
import secrets

def getNewPrivateKey():
    secret = secrets.token_hex(32)
    private_key = "0x" + secret
    print ("Your private key is:", private_key)
    return private_key;

def getNewAccountAddress(private_key):
    account_address = Account.from_key(private_key)
    print("Your account's address:", account_address.address)
    return account_address

def saveNewAccountAddressInFile(account_address):
    try:
        file = open("../private/count_address", "w")
        file.write(account_address)
        file.close()
        return True
    except:
        print("Error, can't write on the especified path")

def saveNewPrivateKeyInFile(private_key):
    try:
        file = open("../private/private_key", "w")
        file.write(private_key)
        file.close()
    except:
        print("Error, can't write on the especified path")

def getDataFromFiles():

    file = open("../private/private_key")
    private_key = file.read()

    file = open("../private/account_address")
    account_address = file.read()

    data = {
        "private_key": private_key,
        "account_address": account_address
    }

    return data

private_key = None;
account_address = None;

file_exists = exists("../private/private_key")

if file_exists:
    data = getDataFromFiles()
    private_key = data["private_key"]
    account_address = data["account_address"]

else:
    private_key = getNewPrivateKey()
    saveNewPrivateKeyInFile(private_key)

    account_address = getNewAccountAddress(private_key)
    saveNewAccountAddressInFile(account_address)
    
