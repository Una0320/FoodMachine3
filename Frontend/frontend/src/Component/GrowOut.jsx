import React, {useState, useEffect} from "react";

// 建立 GrowOutInfo component
// 使用專屬的 GrowInfo component 顯示 GrowthRecords 資訊。
const GrowInfo = ({ data }) => (
    <div>
        <h2>GrowthRecords</h2>
        <table>
            <thead>
                <tr>
                <th>Timestamp</th>
                <th>Airtemp</th>
                <th>Watertemp</th>
                <th>CO2</th>
                </tr>
            </thead>
            <tbody>
                {data.map((record, index) => (
                <tr key={index}>
                    <td>{(record.timestamp).replace("T", " ")}</td>
                    <td>{record.airtemp}</td>
                    <td>{record.watertemp}</td>
                    <td>{record.co2}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const GrowOut = () => {

}

export default GrowOut;