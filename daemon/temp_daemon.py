from sense_hat import SenseHat
import sys

senseHat = SenseHat()
if not senseHat:
    print("The sense hat is not working, please check it's connections")
    exit()

if len(sys.argv) == 1:
    temperature = senseHat.get_temperature()
    print(temperature)

elif len(sys.argv) == 3:
    try:
        option = sys.argv[1]
        temperature = float(sys.argv[2])
        if option == "-s" and isinstance(temperature, float):
            print("The temperature is: {}º Celsius".format(temperature));
        else:
            print("Error, the command must be python3 temp_daemon.py -t temp_value")
    except:
        print("Error, you should introduce a number as input")
    
