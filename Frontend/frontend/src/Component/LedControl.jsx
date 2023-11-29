import React, {useState, useEffect} from "react";
import { socket } from "../socket";

const DeviceInfo = ({ data }) => (
    <div>
        <h1>Device Info</h1>
        {data.map((dev) => (
            <div key={dev.id}>
                <p>Dev ID: {dev.id}</p>
                <p>Dev name: {dev.devicename}</p>
                <p>Box ID: {dev.boxid_id}</p>
                <p>RGB: {dev.parameter.RGB[0]}, {dev.parameter.RGB[1]}, {dev.parameter.RGB[2]}</p>
                <p>亮度: {dev.devicemode}</p>
            </div>
        ))}
    </div>
);

const LedControl = ( {socket} ) =>
{
    const [Ledstatus, setLedstatus] = useState();

    useEffect(() => {
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
        fetchData(1);
        console.log(socket.connected);
          
    }, []);

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
        console.log(formData.get('brightness'));

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        //將 JavaScript 物件轉換為 JSON 字串
        console.log(JSON.stringify(formJson));
        socket.emit('ledcontrol', JSON.stringify(formJson));
        alert('submit');
    }

    return(
        <div>
            {Ledstatus && <DeviceInfo data={Ledstatus}></DeviceInfo>}

            <h3>Brightness : {Ledstatus ? Ledstatus[0].devicemode : null}</h3>
            <form onSubmit={onSubmit}>
                <label htmlFor="brightness">Brightness:
                <input type="number" id="brightness" name="brightness" min="0" max="1" step="0.01" defaultValue="0" />
                </label>

                <label htmlFor="red">Red:
                <input type="number" id="red" name="red" min="0" max="255" defaultValue="128" />
                </label>

                <label htmlFor="green">Green:
                <input type="number" id="green" name="green" min="0" max="255" defaultValue="128" />
                </label>

                <label htmlFor="blue">Blue:
                <input type="number" id="blue" name="blue" min="0" max="255" defaultValue="128" />
                </label>

                <button type="submit" value="Submit">Submit</button>
            </form>
        </div>
    );
};

export default LedControl;