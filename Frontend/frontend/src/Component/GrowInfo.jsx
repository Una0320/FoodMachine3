// GrowInfo.jsx
import React from 'react';
import '../CSS/Dashboard.css'
const GrowInfo = ({ data }) => (
  <div className="grow-info">
    <h2>GrowthRecords</h2>
    {/* <table style={{ margin: '0 auto' }}>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Airtemp</th>
          <th>Humidity</th>
          <th>Luminance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>{record.timestamp.replace("T", " ")}</td>
            <td>{record.airtemp}</td>
            <td>{record.humidity}</td>
            <td>{record.luminance}</td>
          </tr>
        ))}
      </tbody>
    </table> */}
    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ padding: '8px', textAlign: 'center' }}>Timestamp</th>
          <th style={{ padding: '8px', textAlign: 'center' }}>Airtemp</th>
          <th style={{ padding: '8px', textAlign: 'center' }}>Humidity</th>
          <th style={{ padding: '8px', textAlign: 'center' }}>Luminance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td style={{ padding: '8px', textAlign: 'center' }}>{record.timestamp.replace("T", " ")}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{record.airtemp}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{record.humidity}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{record.luminance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default GrowInfo;
