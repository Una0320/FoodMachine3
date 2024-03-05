// LastGrowAll.jsx
import React, { useState, useEffect, useContext } from 'react';
import '../CSS/Dashboard.css'
import '../CSS/LastGrowAll.css'
import CustomBtn from './CustomBtn';
import { useCtrline } from './ChartCtlContext';
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
// import { Button, Dialog, DialogTitle } from '@mui/material';

const LastGrowAll = ({ socket, boxId, url }) => {

    //{ socket, boxId }
    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    //Fetch data
    const [ gdata, setdata] = useState([]);
    const [ goutdata, setoutdata] = useState([]);

    //Control alert status
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMsg, setalertMsg] = useState([]);

    //line chart visibility
    const {chartVisibilityMap, toggleChartVisibility, updateSelectedHour} = useCtrline()

    let roundDecimal = function (val, precision) {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }

    const fetchINdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `${url}/boxgrowin/${boxId}/?start_date=${fulldate}`
            );

            if (response.ok) {
                const json_inData = await response.json();
                setdata(json_inData[0]);
                console.log(json_inData[0]);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const fetchOUTdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `${url}/boxgrowout/?box_id=${boxId}&start_date=${fulldate}`
            );

            if (response.ok) {
                const json_outData = await response.json();
                setoutdata(json_outData[0]);
                // console.log(json_outData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        const alertParams = [];
        if(gdata){
            if(gdata.luminance < 7000 || gdata.luminance > 8000){
                alertParams.push('Luminance abnormal.');
            }
        }
        if(goutdata){
            if(goutdata.watertemp < 20 || goutdata.watertemp >= 26){
                alertParams.push('Water Temp abnormal.');
            }
            if(goutdata.ec < 0.9 || goutdata.ec > 1.4){
                alertParams.push('EC abnormal.');
            }
            if(goutdata.ph < 5 || goutdata.ph > 7.9){
                alertParams.push('pH abnormal.');
            }
            if(goutdata.oxygen < 20 || goutdata.oxygen > 20.99){
                alertParams.push('Oxygen abnormal.');
            }
            if(goutdata.co2 < 500 || goutdata.co2 > 1000){
                alertParams.push('CO2 abnormal.')
            }
        }
        if(alertParams.length > 0){
            setalertMsg(alertParams);
            setOpenAlert(true);
        }
        
    },[gdata, goutdata])

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    useEffect(() =>{
        fetchINdata(boxId);
        fetchOUTdata(boxId);
        
        function ngrowout_update() {
            console.log("N-growout_LastGrow");
            fetchOUTdata(boxId);
        }
        
        function ngrowin_update() {
            console.log(socket.connected);
            console.log("N-growin_LastGrow");
            fetchINdata(boxId);
        }

        // 移除之前的 ngrowout_update 事件監聽器
        // socket.off("ngrowout_update");
        socket.on("ngrowout_update", ngrowout_update);

        // socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);
        return () => {
            // 在组件卸载时取消事件监听
            socket.off("ngrowin_update");
            socket.off("ngrowout_update");
        };
    }, [boxId]);

    return(
        <>
            <Dialog open={openAlert} onClose={handleCloseAlert}>
                <DialogTitle>Alert</DialogTitle>
                <DialogContent>
                    {alertMsg.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>OK</Button>
                </DialogActions>
            </Dialog>
            <div className='up_right_btnArea'>
                {/* Data buttons */}
                {gdata ?
                    (<>
                        {/* <button className={`${chartVisibilityMap['luminance'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('luminance')}>Brightness<br/>{data.luminance || ''}LUX</button>
                        <button className={`${chartVisibilityMap['inhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inhumidity')}>Humidity {data.humidity || ''}%</button>
                        <button className={`${chartVisibilityMap['inairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inairtemp')}>Airtemp {data.airtemp || ''} &#8451;</button>
                        <button className={`${chartVisibilityMap['sunlong'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('sunlong')}>Sunshine Duration {data.sunlong || ''}hr</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['luminance']? '/luminance.png':'unluminance.png'} 
                                    text1={gdata.luminance+' LUX'} 
                                    text2={'Luminance'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['luminance']} 
                                    onClick={() => toggleChartVisibility('luminance')}
                                    activeColor={'#F94144'}></CustomBtn>
                        
                        <CustomBtn  imagePath={chartVisibilityMap['inhumidity']? '/inhumidity.png':'unhumidity.png'} 
                                    text1={gdata.humidity+' %'} 
                                    text2={'Humidity'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['inhumidity']} 
                                    onClick={() => toggleChartVisibility('inhumidity')}
                                    activeColor={'#F8961E'}></CustomBtn>
                        
                        <CustomBtn  imagePath={chartVisibilityMap['inairtemp']? '/inairtemp.png':'untemp.png'} 
                                    text1={gdata.airtemp+" °C"} 
                                    text2={'Airtemp'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['inairtemp']} 
                                    onClick={() => toggleChartVisibility('inairtemp')}
                                    activeColor={'#BCAF19'}></CustomBtn>
                        </>
                    ) :
                    (
                        <>
                        {/* <button className={`${chartVisibilityMap['luminance'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('luminance')}>Brightness {''}</button>
                        <button className={`${chartVisibilityMap['inairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inairtemp')}>Airtemp {''}</button>
                        <button className={`${chartVisibilityMap['inhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inhumidity')}>Humidity {''}</button>
                        <button className={`${chartVisibilityMap['sunlong'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('sunlong')}>Sunshine Duration {''}</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['luminance']? '/luminance.png':'unluminance.png'} 
                                    text1={''} 
                                    text2={'Luminance'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['luminance']} 
                                    onClick={() => toggleChartVisibility('luminance')}
                                    activeColor={'#F94144'}></CustomBtn>
                        
                        <CustomBtn  imagePath={chartVisibilityMap['inhumidity']? '/inhumidity.png':'unhumidity.png'} 
                                    text1={''} 
                                    text2={'Humidity'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['inhumidity']} 
                                    onClick={() => toggleChartVisibility('inhumidity')}
                                    activeColor={'#F8961E'}></CustomBtn>
                        
                        <CustomBtn  imagePath={chartVisibilityMap['inairtemp']? '/inairtemp.png':'untemp.png'} 
                                    text1={""} 
                                    text2={'Airtemp'} 
                                    text3={'Inner Box'} 
                                    isActive={chartVisibilityMap['inairtemp']} 
                                    onClick={() => toggleChartVisibility('inairtemp')}
                                    activeColor={'#BCAF19'}></CustomBtn>
                        </>
                    )
                }

                {/* Outdata buttons */}
                {goutdata ?
                    (
                        <>
                        {/* <button className={`${chartVisibilityMap['watertemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('watertemp')}>Out watertemp {Math.round(outdata.watertemp*100)/100 || ''} &#8451;</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['watertemp']? '/watertemp.png':'untemp.png'} 
                                    text1={Math.round(goutdata.watertemp*100)/100 + " °C"} 
                                    text2={'Watertemp'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['watertemp']} 
                                    onClick={() => toggleChartVisibility('watertemp')}
                                    activeColor={'#90BE6D'}></CustomBtn>

                        {/* <button className={`${chartVisibilityMap['outhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outhumidity')}>Out Humidity {Math.round(goutdata.humidity*100)/100 || ''}%</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['outhumidity']? '/outhumidity.png':'unhumidity.png'} 
                                    text1={Math.round(goutdata.humidity*100)/100 +' %'} 
                                    text2={'Out Humidity'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['outhumidity']} 
                                    onClick={() => toggleChartVisibility('outhumidity')}
                                    activeColor={'#87CEEB'}></CustomBtn>

                        {/* <button className={`${chartVisibilityMap['outairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outairtemp')}>Out Airtemp {Math.round(goutdata.airtemp*100)/100 || ''} &#8451;</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['outairtemp']? '/outairtemp.png':'untemp.png'} 
                                    text1={Math.round(goutdata.airtemp*100)/100+" °C"} 
                                    text2={'Out Airtemp'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['outairtemp']} 
                                    onClick={() => toggleChartVisibility('outairtemp')}
                                    activeColor={'#7B68EE'}></CustomBtn>

                        {/* <button className={`${chartVisibilityMap['ph'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ph')}>pH<br/>{Math.round(goutdata.ph*100)/100 || ''}</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['ph']? '/ph.png':'unph.png'} 
                                    text1={Math.round(goutdata.ph*100)/100} 
                                    text2={'pH'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['ph']} 
                                    onClick={() => toggleChartVisibility('ph')}
                                    activeColor={'#488BDA'}></CustomBtn>

                        {/* <button className={`${chartVisibilityMap['ec'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ec')}>EC<br/>{roundDecimal(goutdata.ec, 3) || ''} ms/cm</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['ec']? '/ec.png':'unec.png'} 
                                    text1={Math.round(goutdata.ec*100)/100} 
                                    text2={'EC'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['ec']} 
                                    onClick={() => toggleChartVisibility('ec')}
                                    activeColor={'#F9C74F'}></CustomBtn>
                        {/* <button className={`${chartVisibilityMap['co2'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('co2')}>CO2 {roundDecimal(goutdata.co2,3) || ''} ppm</button> */}
                        <CustomBtn  imagePath={chartVisibilityMap['co2']? '/co2.png':'unco2.png'} 
                                    text1={Math.round(goutdata.co2*100)/100} 
                                    text2={'co2'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['co2']} 
                                    onClick={() => toggleChartVisibility('co2')}
                                    activeColor={'#FFA07A'}></CustomBtn>
                        <CustomBtn  imagePath={chartVisibilityMap['oxygen']? '/oxygen.png':'unoxygen.png'} 
                                    text1={Math.round(goutdata.oxygen*100)/100 + ' %'} 
                                    text2={'oxygen'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['oxygen']} 
                                    onClick={() => toggleChartVisibility('oxygen')}
                                    activeColor={'#7BB249'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['waterlevel']? '/waterlevel.png':'unwaterlevel.png'} 
                                    text1={Math.round(goutdata.waterlevel*100)/100} 
                                    text2={'Water depth'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['waterlevel']} 
                                    onClick={() => toggleChartVisibility('waterlevel')}
                                    activeColor={'#20B2AA'}></CustomBtn>
                        </>
                    ) : 
                    (
                        <>
                        <CustomBtn  imagePath={chartVisibilityMap['watertemp']? '/watertemp.png':'untemp.png'} 
                                    text1={""} 
                                    text2={'Wirtemp'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['watertemp']} 
                                    onClick={() => toggleChartVisibility('watertemp')}
                                    activeColor={'#90BE6D'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['outhumidity']? '/outhumidity.png':'unhumidity.png'} 
                                    text1={''} 
                                    text2={'Out Humidity'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['outhumidity']} 
                                    onClick={() => toggleChartVisibility('outhumidity')}
                                    activeColor={'#87CEEB'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['outairtemp']? '/outairtemp.png':'untemp.png'} 
                                    text1={""} 
                                    text2={'Out Airtemp'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['outairtemp']} 
                                    onClick={() => toggleChartVisibility('outairtemp')}
                                    activeColor={'#7B68EE'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['ph']? '/ph.png':'unph.png'} 
                                    text1={''} 
                                    text2={'pH'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['ph']} 
                                    onClick={() => toggleChartVisibility('ph')}
                                    activeColor={'#488BDA'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['ec']? '/ec.png':'unec.png'} 
                                    text1={''} 
                                    text2={'EC'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['ec']} 
                                    onClick={() => toggleChartVisibility('ec')}
                                    activeColor={'#F9C74F'}></CustomBtn>
                        <CustomBtn  imagePath={chartVisibilityMap['co2']? '/co2.png':'unco2.png'} 
                                    text1={''} 
                                    text2={'co2'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['co2']} 
                                    onClick={() => toggleChartVisibility('co2')}
                                    activeColor={'#FFA07A'}></CustomBtn>
                        <CustomBtn  imagePath={chartVisibilityMap['oxygen']? '/oxygen.png':'unoxygen.png'} 
                                    text1={''} 
                                    text2={'oxygen'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['oxygen']} 
                                    onClick={() => toggleChartVisibility('oxygen')}
                                    activeColor={'#7BB249'}></CustomBtn>

                        <CustomBtn  imagePath={chartVisibilityMap['waterlevel']? '/waterlevel.png':'unwaterlevel.png'} 
                                    text1={''} 
                                    text2={'Water depth'} 
                                    text3={'Outer Box'} 
                                    isActive={chartVisibilityMap['waterlevel']} 
                                    onClick={() => toggleChartVisibility('waterlevel')}
                                    activeColor={'#20B2AA'}></CustomBtn>
                        </>
                    )
                }
                <CustomBtn  imagePath={'/plus.png'}></CustomBtn>
                {/* <button className={`${chartVisibilityMap['hourbtn'] ? 'btn-true' : 'btn-false'}`}
                        onClick={() => toggleChartVisibility('hourbtn')}>Hour</button>
                <input
                        type="range"
                        min={minHour}
                        max={maxHour}
                        value={selectedHour}
                        onChange={(e) => {
                            const hourValue = parseInt(e.target.value, 10);
                            setSelectedHour(hourValue);
                            updateSelectedHour(hourValue); // 更新相應的狀態
                        }}
                    />
                    <span>{selectedHour} 小時</span>
                <button className={`${chartVisibilityMap['daybtn'] ? 'btn-true' : 'btn-false'}`}
                        onClick={() => toggleChartVisibility('daybtn')}>Day</button> */}
            </div>
        </>
    );
};

export default LastGrowAll;
