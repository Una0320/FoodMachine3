import React, {useState, useEffect} from "react";

const GrowOut = ( { socket, boxId } ) => {

    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;
    const [data, setdata] = useState([]);

    const fetchgrowdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowout/?box_id=${boxId}&start_date=${fulldate}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setdata(jsonData);
                // console.log(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() =>{
        fetchgrowdata(boxId);
        
        function ngrowout_update() {
            console.log("N-growout update");
            fetchgrowdata(boxId);
        }

        // 移除之前的 ngrowout_update 事件監聽器
        socket.off("ngrowout_update");
        socket.on("ngrowout_update", ngrowout_update);
    }, []);

    return(
        <div className="grow-info">
            {/* <h2>GrowthRecords</h2> */}
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Timestamp</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Airtemp</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Watertemp</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>EC</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.timestamp.replace("T", " ")}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.airtemp}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.watertemp}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.ec}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GrowOut;