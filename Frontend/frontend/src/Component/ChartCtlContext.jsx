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
    });

    const toggleChartVisibility = (chartId) => {
        setChartVisibilityMap((prevMap) => ({
        ...prevMap,
        [chartId]: !prevMap[chartId],
        }));
    };

    return (
        <ChartCtlContext.Provider value={{ chartVisibilityMap, toggleChartVisibility }}>
        {children}
        </ChartCtlContext.Provider>
    );
};

