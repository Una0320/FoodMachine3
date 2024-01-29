from serial import *
import time
from threading import Thread
import socketio
from datetime import datetime
import json
import requests
import board
import neopixel
import cv2
import numpy as np
import base64

url = 'http://192.168.1.213:8000/'
img_url = "http://192.168.1.201:8080/?action=snapshot"

LED_NUM = 286   # set led numbers
BOX_ID = 1
PERIOD = 10   # termites post period

sio = socketio.Client()
LED_data = {'RGB': [255,255,255], 'brightness': 1.0, 'opentime': [9,0], 'closetime': [21,0], 'boxid': BOX_ID} # 255,190,205
LED_flag = False

def LED():
    boxLog('run LED()')
    @sio.event
    def LED_ctrl(LED_json):
        boxLog(LED_json)
        global LED_data
        global LED_flag
        LED_data = json.loads(LED_json)
        if(LED_data['boxid']==BOX_ID):
            color = LED_data["RGB"]
            time.sleep(1)
            if(LED_flag):
                pixels = neopixel.NeoPixel(board.D18, LED_NUM, brightness=LED_data["brightness"])
                pixels.fill(color)
                try:
                    response = json.loads((requests.put(url+'editdevice/'+str(BOX_ID)+'/1/', data=json.dumps(LED_data))).text)
                    boxLog(response)
                    if(response["message"]):
                        sio.emit('frontend_update') # emit to socketio server
                except Exception as e: 
                    boxLog('django put error: '+str(e))
            if((color[0]==0 and color[1]==0 and color[2]==0)or(LED_data["brightness"]==0.0)):
                LED_flag = False
                boxLog("LED:OFF")

def LED_onoff():    
    boxLog('run LED_onoff()')
    while True:
        global LED_data
        global LED_flag
        color = LED_data["RGB"]
        if((color[0]==0 and color[1]==0 and color[2]==0)or(LED_data["brightness"]==0.0)):
                continue
        elif(datetime.now().hour==LED_data["opentime"][0] and datetime.now().minute==LED_data["opentime"][1] and LED_flag==False):
            LED_flag = True
            pixels = neopixel.NeoPixel(board.D18, LED_NUM, brightness=LED_data["brightness"])
            pixels.fill(LED_data["RGB"])
            boxLog("LED:ON")
        elif(datetime.now().hour==LED_data["closetime"][0] and datetime.now().minute==LED_data["closetime"][1] and LED_flag==True):
            LED_flag = False
            pixels = neopixel.NeoPixel(board.D18, LED_NUM, brightness=LED_data["brightness"])
            pixels.fill([0, 0, 0])
            boxLog("LED:OFF")
        time.sleep(1)

def TerMITes():
    boxLog('run TerMITes()')
    try:
        TerMITes_board = Serial('/dev/ttyUSB0', baudrate=115200)
        boxLog('Termites connect to /dev/ttyUSB0')
    except:
        TerMITes_board = Serial('/dev/ttyUSB1', baudrate=115200)
        boxLog('Termites connect to /dev/ttyUSB1')
    # configure Termites to JSON formate
    boxLog('TerMITes COMMAND: CMD')
    TerMITes_board.write(("CMD").encode())
    time.sleep(3)
    boxLog('TerMITes COMMAND: JSON')
    TerMITes_board.write(("JSON").encode())
    time.sleep(3)
    boxLog('TerMITes COMMAND: EXT')
    TerMITes_board.write(("EXT").encode())
    update_flag = True
    while True:
        global LED_data
        try:
            termites_json = TerMITes_board.readline().decode("utf-8")
        except Exception as e: 
            boxLog('termites_json decode error: '+str(e))
            continue
        if((datetime.now().minute)%PERIOD == 0 and update_flag):
            try:
                termites_data = json.loads(termites_json)
                termites_data["boxid"] = BOX_ID
                termites_data["RGB"] = LED_data["RGB"]
                termites_data["time"] = LED_data["closetime"][0]-LED_data["opentime"][0]
                try:
                    img_cv = img()
                    termites_data['img'] = base64.b64encode(cv2.imencode('.jpg', img_cv)[1]).decode()
                except:
                    termites_data['img'] = None
                    boxLog('Image Error')

                termites_json_update = json.dumps(termites_data)
                response = json.loads((requests.post(url+'ngrowin/', data=termites_json_update)).text)
                boxLog('ngrowin/'+str(response))
                if(response["message"]):
                    sio.emit('ngrowin_update') # emit to socketio server
                update_flag = False
            except Exception as e: 
                boxLog('TerMITes post error: '+str(e))
                update_flag = False
                continue
        elif((datetime.now().minute)%PERIOD != 0):
            update_flag = True

def STM32():
    boxLog('run STM32()')
    try:
        stm32_board = Serial('/dev/ttyACM0', baudrate=115200)
        boxLog('stm32 connect to /dev/ttyACM0')
    except:
        stm32_board = Serial('/dev/ttyACM1', baudrate=115200)
        boxLog('stm32 connect to /dev/ttyACM1')

    update_flag = True
    while True:
        if((datetime.now().minute)%PERIOD == 9 and update_flag):   # activate 1 min earlier
            boxLog('stm32 COMMAND: start')
            stm32_board.write(("start").encode())
            update_flag = False
            try:
                stm32_json = stm32_board.readline().decode("utf-8")
            except Exception as e: 
                boxLog('stm32 decode error: '+str(e))
                continue
            try:
                stm32_data = json.loads(stm32_json)
                stm32_data["boxid"] = [1, 2]
                stm32_json_update = json.dumps(stm32_data)
                response = json.loads((requests.post(url+'ngrowout/', data=stm32_json_update)).text)
                boxLog('ngrowout/'+str(response))
                boxLog(str(stm32_json_update))
                if(response["message"]):
                    sio.emit('ngrowout_update') # emit to socketio server
            except Exception as e: 
                boxLog('STM32 post error: '+str(e))
                continue
        elif((datetime.now().minute)%PERIOD != 9):
            update_flag = True

# for debug
def boxLog(log_mes):
    print('log:', '['+str(datetime.now())+']' , log_mes)
    if(socket_connect):
        sio.emit('box_log', log_mes)

def img():
    response = requests.get(img_url)
    content = response.content
    img1 = np.frombuffer(content, np.uint8)
    img_cv = cv2.imdecode(img1, cv2.IMREAD_ANYCOLOR)
    return img_cv
        
if __name__ ==  '__main__':
    LED_flag = True
    socket_connect = False
    
    Thread(target=LED_onoff).start()    # start LED control
    Thread(target=LED).start()  # start LED
    Thread(target=TerMITes).start() # start Termites
    Thread(target=STM32).start()    # start stm32
    
    pixels = neopixel.NeoPixel(board.D18, LED_NUM, brightness=LED_data["brightness"])
    pixels.fill(LED_data["RGB"])
    boxLog("LED:ON")

    @sio.event
    def connect():
        global socket_connect
        socket_connect = True
        boxLog('Connected to server')

    @sio.event
    def disconnect():
        global socket_connect
        socket_connect = False
        boxLog('Disconnected from server')
    
    sio.connect('http://192.168.1.182:4040')
    sio.wait()


