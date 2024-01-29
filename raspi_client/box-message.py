import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.event
def box_log(data):
    print(data)

sio.connect('http://192.168.1.182:4040')
sio.wait()
