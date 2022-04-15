import tkinter as Tkinter
import wallet_operations as op
from os.path import exists

private_key = None;
account_address = None;

def createWallet():
  walletData = op.createNewWallet()
  private_key = walletData["private_key"]
  account_address = walletData["account_address"]

def getWallet():
  file_exists = exists("../private/private_key")

  if file_exists:
    data = op.getPrivateKeyAndAccountAddressDataFromFiles()
    private_key = data["private_key"]
    account_address = data["account_address"]
    print("Hola:", private_key, account_address)

  else:
    walletData = op.createNewWallet()



top = Tkinter.Tk()

# Buttons
createNewWalletButton = Tkinter.Button(top,text="Create new wallet",command=createWallet)
getWalletButton = Tkinter.Button(top,text="Get wallet",command=getWallet)

createNewWalletButton.pack()
getWalletButton.pack()

top.mainloop()