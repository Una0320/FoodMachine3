// ChartCtlContext.jsx
import { createContext, useContext, useState } from 'react';

const ChartCtlContext = createContext();

// 定義一個自定義 hook 來簡化使用上下文的代碼
export function useCtrline() {
    return useContext(ChartCtlContext);
}

// 提供者组件
export function ChartCtrlProvider({ children }) {
    const [chartVisibilityMap, setChartVisibilityMap] = useState({
        luminance: true,
        inairtemp: true,
        inhumidity: true,
        sunlong: false,
        
        watertemp: false,
        waterlevel: false,
        outhumidity: false,
        outairtemp: false,
        ph: false,
        ec: false,
        co2: false,
        oxygen: false,

        selectedHour: 2, // 新增選擇的小時
        daybtn:true,
        hourbtn:false,
        weekbtn:false,
        monthbtn:false,
    });

    const toggleChartVisibility = (chartId) => {
        if (chartId === 'daybtn') {
            setChartVisibilityMap((prevMap) => ({
                ...prevMap,
                daybtn: true,
                hourbtn: false,
                weekbtn:false,
                monthbtn:false,
            }));
        } else if (chartId === 'hourbtn') {
            setChartVisibilityMap((prevMap) => ({
                ...prevMap,
                daybtn: false,
                weekbtn:false,
                monthbtn:false,
                hourbtn: true,
            }));
        } else if (chartId === 'weekbtn') {
            setChartVisibilityMap((prevMap) => ({
                ...prevMap,
                daybtn: false,
                weekbtn:true,
                monthbtn:false,
                hourbtn: false,
            }));
        }else {
            setChartVisibilityMap((prevMap) => ({
                ...prevMap,
                [chartId]: !prevMap[chartId],
            }));
        }
    };

    const updateSelectedHour = (hour) => {
        setChartVisibilityMap((prevMap) => ({
            ...prevMap,
            selectedHour: hour,
        }));
    };

    return (
        <ChartCtlContext.Provider value={{ chartVisibilityMap, toggleChartVisibility, updateSelectedHour }}>
        {children}
        </ChartCtlContext.Provider>
    );
};

