# Food Machine

## Developed in 2023 Fall UROP, City Science Lab@Tapei Tech

# Project Goals

1. 模組化的植物種植箱，搭配感側器與攝影機，即時監控植物生長環境。
2. 使用Kratky method種植作物，減少水資源使用。
3. 使用Neopixel LED，可依據實驗切換並控制植物生長照明的顏色、亮度與時長。

# Demo Video

[https://drive.google.com/file/d/1JadbFEV81gBqRMKxOh_h2evabVn7TF5c/view?usp=sharing](https://drive.google.com/file/d/1JadbFEV81gBqRMKxOh_h2evabVn7TF5c/view?usp=sharing)

# Block Diagram

![Untitled](Food%20Machine%200e840244ae894fa3ad3ab767d4a71af0/Untitled.png)

# Mechanism

- CAD請切換至Branch: SensorBoxCad
- 箱體
    
    參考 ~/0129 food machine skeleton element/
    
- 控制箱 (Control Box)
    - 使用方法
        
        下載所有元件的檔案，並點擊1219 ControlBox Version(SOLIDWORKS Assembly Document)，即可取得檔案。
        
    - 特色
        1. **簡潔外觀**
            - 透過最少的螺絲固定蓋子與箱體。
            - 避免露出螺絲的位置出現在顯眼處。
        2. **空間利用率高**
            - 將所有的元件規劃在最小的空間中。
            - 利用最大化箱體內的空間。
        3. **維修方便**
            - 設計所有元件在同一層，
            - 其中EC sensor、PH sensor、STM32放在下層，O2、CO2、Converter、Relay放在上層
    - 外觀
    
    ![**前視圖**](Food%20Machine%200e840244ae894fa3ad3ab767d4a71af0/Untitled%201.png)
    
    **前視圖**
    
    ![ **側視圖**](Food%20Machine%200e840244ae894fa3ad3ab767d4a71af0/Untitled%202.png)
    
     **側視圖**
    

# Front-end

- React（v18.2.0） + Vite（v5.0.12）
- npm -v：10.2.4 → v10.4.0
- nvm -v：20.9.0
- 終端機啟動指令（要先更改nvm版本才可正常啟動，且使用cd切換到對應資料夾底下）
    
    ```bash
    nvm use v20.9.0
    npm run dev
    ```
    
    1. nvm use v20.9.0
    2. npm run dev
- 主要語法：Javascript + HTML (JSX)、CSS
- 讓其他人能夠連線上（就不會只有localhost、127.0.0.1)，Host：使用0.0.0.0
- PORT：3000（於 vite.config.js 設定）
- socket連線處理事件：數據資料的新增事件ngrowout_update、ngrowin_update；燈光控制事件LED_ctrl
- 使用useContext產生socket連線實例，讓其他子物件都可以使用同一個連線，達到同步更新。
    - 程式碼：SocketContext.jsx
    - 在要使用的地方先`import {SocketProvider} from './Component/SocketContext’`
    - 並使用`<SocketProvider>`去包裹會使用到socket的子元件
    - 在子元件的部份
        - `import { useSocket } from "./SocketContext";`
        - 使用socket實例，`const socket = useSocket();`
        - 在useEffect hook裡，監聽／發送socket事件

網頁前端設計

![Untitled](Food%20Machine%200e840244ae894fa3ad3ab767d4a71af0/Untitled.gif)

# Firmware

- 硬體
    - Board: STM32F303K8
    - SCD30 sensor: [https://github.com/sparkfun/SparkFun_SCD30_Arduino_Library](https://github.com/sparkfun/SparkFun_SCD30_Arduino_Library)
    - EC sensor: [https://wiki.dfrobot.com/Gravity__Analog_Electrical_Conductivity_Sensor___Meter_V2__K=1__SKU_DFR0300](https://wiki.dfrobot.com/Gravity__Analog_Electrical_Conductivity_Sensor___Meter_V2__K=1__SKU_DFR0300)
    - Water level sensor : [https://wiki.seeedstudio.com/Grove-Water-Level-Sensor/](https://wiki.seeedstudio.com/Grove-Water-Level-Sensor/)
    - O2 sensor: [https://wiki.dfrobot.com/Gravity_I2C_Oxygen_Sensor_SKU_SEN0322](https://wiki.dfrobot.com/Gravity_I2C_Oxygen_Sensor_SKU_SEN0322)
    - PH sensor: [https://wiki.dfrobot.com/Gravity__Analog_pH_Sensor_Meter_Kit_V2_SKU_SEN0161-V2](https://wiki.dfrobot.com/Gravity__Analog_pH_Sensor_Meter_Kit_V2_SKU_SEN0161-V2)
- 使用方法
    - 使用ArduinoIDE
    - 設定Preferences URL: [https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json](https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json)
    - 下載或安裝所需的Library
    - 設定Board為Nucleo-32
    - Build並Upload

# Back-end

![Untitled](Food%20Machine%200e840244ae894fa3ad3ab767d4a71af0/Untitled%203.png)

- Django Server
    - Ubuntu作業系統底下，目前測試要先關閉防火牆，不然box client資料傳送失敗
    - Ctrl + Alt + T開啟終端機即可
    
    ```bash
    systemctl stop firewalld.service
    ```
    
    - Django (v4.2.6)
    - PORT：8000
    - Database：Sqlite
    - 終端機啟動（須使用cd切換到對應的資料夾）
    
    ```bash
    python3 manage.py runserver 0.0.0.0:8000
    ```
    
    - 時間格式 - 時區要更改，以免儲存或是讀取顯示有差異。
        
        ```bash
        LANGUAGE_CODE = 'en-us'
        
        TIME_ZONE = 'Asia/Taipei'
        DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
        
        USE_I18N = True
        
        USE_TZ = False
        ```
        
    - 在Django settings.py中，白名單加入要連線的ip地址（含port)
        
        ```python
        CORS_ORIGIN_WHITELIST = (
            'http://127.0.0.1:3000',
            'http://192.168.XXX.XXX:3000',
            'http://192.168.XXX.XXX:4040',
        )
        ```
        
    - 當資料庫中任一APP的models.py有所改動都須使用以下指令來更新
        
        ```bash
        python3 manage.py makemigrations
        python3 manage.py migrate
        ```
        
- Socket.IO server
    - 安裝函式庫：[https://pypi.org/project/python-socketio/](https://pypi.org/project/python-socketio/)
    - 更改IP位址
    - 執行
    
    ```bash
    python3 box-server.py
    ```
    
- WebCAM streaming
    - 安裝函式庫：[https://zhuanlan.zhihu.com/p/471467404](https://zhuanlan.zhihu.com/p/471467404)
    - 使用raspi-config設定RaspberryPi cam: [https://dev.to/elbruno/raspberrypi-install-raspi-config-on-ubuntu-22041-lts-195j](https://dev.to/elbruno/raspberrypi-install-raspi-config-on-ubuntu-22041-lts-195j)
    - 執行
    
    ```bash
    cd mjpg-streamer/mjpg-streamer-experimental
    sudo bash start.sh
    ```
    
- BOX (SocketIO client)
    - 安裝函式庫：[https://learn.adafruit.com/neopixels-on-raspberry-pi/python-usage](https://learn.adafruit.com/neopixels-on-raspberry-pi/python-usage)
    - 長按啟動Termites閃爍藍燈
    - 執行
    
    ```bash
    sudo python3 box-client.py
    ```
    
    - 如果需要長時間開啟，使用nohup在後台執行
    
    ```bash
    nohup sudo python3 box-client.py &
    ```