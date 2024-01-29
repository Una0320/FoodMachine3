# socketio_client/sockets.py

import socketio
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

sio = socketio.Client() 

@sio.event
def connect():
    print('connection established')

@sio.event
def getMessage(data):
    print('message received with ', data)
    sio.emit('myresponse', {'response': 'my django response'})

@sio.event
def fromreact(data):
    print('message received with ', data)
    # sio.emit('myresponse', {'response': 'my django response'})

@sio.event
def disconnect():
    print('disconnected from Server')

sio.connect('http://127.0.0.1:3001')
sio.wait()
