import eventlet
import socketio
import json
import datetime
import time

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'},
})


# connect
@sio.event
def connect(sid, environ):
    print('client connect', sid)

# disconnect
@sio.event
def disconnect(sid):
    print('client disconnect ', sid)

@sio.event
def LED_ctrl(sid, data):
    print(data)
    sio.emit('LED_ctrl', data)

@sio.event
def ngrowin_update(sid):
    sio.emit('ngrowin_update')
    
@sio.event
def ngrowout_update(sid):
    sio.emit('ngrowout_update')

@sio.event
def box_log(sid, data):
    sio.emit('box_log', data)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('192.168.1.182', 4040)), app, log_output=True)
