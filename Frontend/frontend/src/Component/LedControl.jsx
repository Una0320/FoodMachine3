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

const LedControl = () =>
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
    }, []);

    function onSubmit(event){
        alert('submit');
        // 阻止預設行為, 整個畫面被換頁了
        // 原來是因為提交 form 的時候本來就會因為傳送資料而換頁。所以就需要使用 event.preventDefault() 
        event.preventDefault();

    }
    return(
        <div>
            {Ledstatus && <DeviceInfo data={Ledstatus}></DeviceInfo>}
            <h3>Brightness : {Ledstatus ? Ledstatus[0].devicemode : null}</h3>
            <form onSubmit={onSubmit}>

                <button type="submit" value = "submit">Submit</button>
            </form>
        </div>
    );
};

export default LedControl;