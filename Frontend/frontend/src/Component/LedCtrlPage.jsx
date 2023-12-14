import React, {useState, useEffect} from "react";
import { useSocket } from './SocketContext';
import '../CSS/LedCtrl.css'

const DeviceInfo = ({ data }) => (
    <div>
        <h1>Device Info</h1>
        {data.map((dev) => (
            <div key={dev.id}>
                <p>Dev ID: {dev.id}</p>
                <p>Dev name: {dev.devicename}</p>
                <p>Box ID: {dev.boxid_id}</p>
                <p>RGB: {dev.parameter.RGB[0]}, {dev.parameter.RGB[1]}, {dev.parameter.RGB[2]}</p>
                {/* <p>亮度: {dev.devicemode}</p> */}
            </div>
        ))}
    </div>
);

const LedCtrlPage = ( ) =>
{
    const [Ledstatus, setLedstatus] = useState();
    const socket = useSocket();

    const fetchData = async (boxId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/deviceinfo/${boxId}`);
            
            if (response.ok) {
                const jsonData = await response.json();
                setLedstatus(jsonData);
            } else {
                const errorData = await response.json();
                console.log(errorData)
            }
        } 
        catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {    
        fetchData(1);
        console.log(socket.connected);
        
    }, []);

    function time2array(timeString)
    {
        const [hours, mins] = timeString.split(':')
        return([parseInt(hours), parseInt(mins)]);
    }

    function onSubmit(event){
        // 阻止預設行為, 整個畫面被換頁了
        // 原來是因為提交 form 的時候本來就會因為傳送資料而換頁。所以就需要使用 event.preventDefault() 
        event.preventDefault();

        // 讀取表單數據
        //使用 FormData(form) 來建立這個對象時，它會收集表單中的所有輸入元素的數據，然後將這些數據按照表單中輸入元素的 name 屬性打包成一個對象。
        const form = event.target;
        const formData = new FormData(form);
        console.log(formData);
        // formData.get(name),  表單中輸入元素的 name 屬性來指定
        // console.log(formData.get('brightness'));

        const formJson = Object.fromEntries(formData.entries());
        formJson['boxid'] = 1;
        formJson['opentime'] = time2array(formJson['opentime'])
        formJson['closetime'] = time2array(formJson['closetime'])
        formJson['brightness'] = parseFloat(formJson['brightness'])
        formJson['RGB'] = [parseInt(formJson['red']), parseInt(formJson['green']), parseInt(formJson['blue'])];

        // 要刪除的 keys
        const keysToDelete = ['red', 'green', 'blue'];

        // 創建一個新的 JavaScript 物件，只包含想要保留的 key-value
        const newFormJson = {};
        for (const key in formJson) {
            if (!keysToDelete.includes(key)) {
                newFormJson[key] = formJson[key];
            }
        }

        //const newFormJsonString = JSON.stringify(newFormJson);
        //將 JavaScript 物件轉換為 JSON 字串
        console.log(JSON.stringify(newFormJson));
        console.log(socket.connected)
        socket.emit('LED_ctrl', JSON.stringify(newFormJson));

        alert('submit');
        fetchData(1);
    }

    return(
        <div className="container">
            <h2>LED Control</h2>
            <button onClick={() => window.history.back()}>Go Back</button>
            
            {Ledstatus && <DeviceInfo className="left-column" data={Ledstatus}></DeviceInfo>}
            {/* <h3 className="heading">Brightness : {Ledstatus ? Ledstatus[0].devicemode : null}</h3> */}
            <div className="right-column">
            <form onSubmit={onSubmit} className="form">
                <div className="input-container">
                    <label htmlFor="brightness" className="label">Brightness:
                    <input type="number" id="brightness" name="brightness" min="0" max="1" step="0.01" defaultValue= {Ledstatus ? Ledstatus[0].devicemode:null} className="input"/>
                    </label>
                </div>
                <div className="input-container">
                    <label htmlFor="red" className="label">Red:
                    <input type="number" id="red" name="red" min="0" max="255" defaultValue= {Ledstatus ? Ledstatus[0].parameter['RGB'][0]:null} className="input"/>
                    </label>
                </div>

                <div className="input-container">
                    <label htmlFor="green" className="label">Green:
                    <input type="number" id="green" name="green" min="0" max="255" defaultValue={Ledstatus ? Ledstatus[0].parameter['RGB'][1]:null} className="input"/>
                    </label>
                </div>

                <div className="input-container">
                    <label htmlFor="blue" className="label">Blue:
                    <input type="number" id="blue" name="blue" min="0" max="255" defaultValue={Ledstatus ? Ledstatus[0].parameter['RGB'][2]:null} className="input"/>
                    </label>
                </div>

                <div className="time-container">
                    <div className="input-container">
                        <label htmlFor="opentime" className="label">
                            Open Time:
                        </label>
                        <input type="time" id="opentime" name="opentime" min="1" max="24" defaultValue="12" className="input" />
                    </div>

                    <div className="input-container">
                        <label htmlFor="closetime" className="label">
                            Close Time:
                        </label>
                        <input type="time" id="closetime" name="closetime" min="1" max="24" defaultValue="12" className="input" />
                    </div>
                </div>
                <button type="submit" value="Submit" className="submit-button">Submit</button>
            </form>
            </div>
        </div>
    );
};

export default LedCtrlPage;