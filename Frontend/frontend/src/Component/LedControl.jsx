import React, {useState, useEffect} from "react";
import '../CSS/LedCtrl.css'
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

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

const PrettoSlider  = styled(Slider)(({ editcolor }) => ({
    color: editcolor,
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: editcolor,
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&::before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
}));

const LedControl = ( {socket, onBack} ) =>
{
    const [Ledstatus, setLedstatus] = useState();
    const [brightness, setbrightness] = useState(1);
    const [red, setRed] = useState(255);
    const [green, setGreen] = useState(255);
    const [blue, setBlue] = useState(255);
    const [opentime, setopentime] = useState({ hours: 9, minutes: 0 });
    const [closetime, setclosetime] = useState({ hours: 21, minutes: 0 });

    // const handleBlur = (color) => {
    //     let value;
    //     switch (color) {
    //         case 'red':
    //             value = red;
    //             break;
    //         case 'green':
    //             value = green;
    //             break;
    //         case 'blue':
    //             value = blue;
    //             break;
    //         default:
    //             break;
    //     }
      
    //     if (value < 0) {
    //         value = 0;
    //     } else if (value > 255) {
    //         value = 255;
    //     }
      
    //     switch (color) {
    //         case 'red':
    //             setRed(value);
    //             break;
    //         case 'green':
    //             setGreen(value);
    //             break;
    //         case 'blue':
    //             setBlue(value);
    //             break;
    //         default:
    //             break;
    //     }
    // };

    const handleOpenTimeChange = (newValue) => {
        const newHours = dayjs(newValue).hour();
        const newMinutes = dayjs(newValue).minute();

        // 更新狀態
        setopentime({ hours: newHours, minutes: newMinutes });
        console.log(opentime)
    };

    const handleCloseTimeChange = (newValue) => {
        const newHours = dayjs(newValue).hour();
        const newMinutes = dayjs(newValue).minute();
        setclosetime({ hours: newHours, minutes: newMinutes });
    };
      

    const fetchData = async (boxId) => {
        try {
            const response = await fetch(`http://192.168.1.213:8000/deviceinfo/${boxId}`);
            
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
        // fetchData(1);
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
        // console.log(formData);

        // const formJson = Object.fromEntries(formData.entries());
        // formJson['opentime'] = time2array(formJson['opentime'])
        // formJson['closetime'] = time2array(formJson['closetime'])
        // formJson['brightness'] = parseFloat(formJson['brightness'])
        // formJson['RGB'] = [parseInt(formJson['red']), parseInt(formJson['green']), parseInt(formJson['blue'])];
        const formJson = {};
        formJson['boxid'] = 1;
        formJson['opentime'] = [opentime.hours, opentime.minutes]
        formJson['closetime'] = [closetime.hours, closetime.minutes]
        formJson['brightness'] = parseFloat(brightness);
        formJson['RGB'] = [parseInt(red), parseInt(green), parseInt(blue)];
    
        //將 JavaScript 物件轉換為 JSON 字串
        console.log(JSON.stringify(formJson));
        console.log(socket.connected)
        socket.emit("LED_ctrl", JSON.stringify(formJson));

        // alert('submit');
        // fetchData(1);
    }

    return(
        <div className="container">
            <h2>LED Control</h2>
            {/* <button onClick={onBack}>Go Back</button> */}
            
            {/* {Ledstatus && <DeviceInfo className="left-column" data={Ledstatus}></DeviceInfo>} */}
            <div className="right-column">
            <form onSubmit={onSubmit} className="form">
                <div className="input-container">
                    <label htmlFor="brightness" className="label">
                    Brightness:
                    </label>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={brightness}
                        onChange={(e) => {
                            setbrightness(e.target.value);
                        }}
                        min={0}
                        max={1}
                        step={0.1}
                        editcolor={`rgb(240, 230, 140)`}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="red" className="label">
                    Red:
                    </label>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={255}
                        min={0}
                        max={255}
                        step={1}
                        onChange={(e) => {
                            setRed(e.target.value);
                        }}
                        // onBlur={() => handleBlur('red')}
                        aria-labelledby="red-slider"
                        editcolor={`rgb(${red}, 0, 0)`}
                    />
                </div>
                
                <div className="input-container">
                    <label htmlFor="green" className="label">
                    Green:
                    </label>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={255}
                        min={0}
                        max={255}
                        step={1}
                        // onBlur={() => handleBlur('green')}
                        onChange={(e) => {
                            setGreen(e.target.value);
                        }}
                        aria-labelledby="green-slider"
                        editcolor={`rgb(0, ${green}, 0)`}
                    />
                </div>
                
                <div className="input-container">
                    <label htmlFor="blue" className="label">
                    Blue:
                    </label>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={255}
                        min={0}
                        max={255}
                        step={1}
                        // onBlur={() => handleBlur('blue')}
                        onChange={(e) => {
                            setBlue(e.target.value);
                        }}
                        aria-labelledby="BsetBlue-slider"
                        editcolor={`rgb(0, 0, ${blue})`}
                    />
                </div>

                <div className="time-container">
                    <div className="input-container">
                        {/* <label htmlFor="opentime" className="label">
                            Open Time:
                        </label>
                        <input type="time" id="opentime" name="opentime" min="1" max="24" defaultValue="12" className="input" /> */}
                        <div className="timeclock">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                <TimePicker
                                        label="Open Time"
                                        ampm={false}
                                        defaultValue={dayjs().set('hour', `${opentime.hours}`).set('minute', `${opentime.minutes}`)} 
                                        onChange={handleOpenTimeChange}
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>

                    <div className="input-container">
                        {/* <label htmlFor="closetime" className="label">
                            Close Time:
                        </label>
                        <input type="time" id="closetime" name="closetime" min="1" max="24" defaultValue="12" className="input" /> */}
                        <div className="timeclock">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                        label="Close Time"
                                        ampm={false} // 设置为24小时制
                                        defaultValue={dayjs().set('hour', `${closetime.hours}`).set('minute', `${closetime.minutes}`)} 
                                        onChange={handleCloseTimeChange}
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <button type="submit" value="Submit" className="submit-button">Submit</button>
            </form>
            </div>
        </div>
    );
};

export default LedControl;