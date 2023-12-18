import React, {useState, useEffect} from "react";

const LastGrowOUT = ( { socket, boxId } ) => {

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
                setdata(jsonData[0]);
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
    }, [boxId]);

    return(
        <div className="grow-info">
            {data ? (
            <h2>
                {data.timestamp && data.timestamp.replace("T", " ")}<br/>
                {data.watertemp}<br/>
                {data.airtemp}<br/>
                {data.humidity}<br/>
                {data.oxygen}<br/>
                {data.ec}<br/>
                {data.ph}<br/>
                {data.co2}<br/>
            </h2>
        ) : (
            <p>No data available</p>
        )}
        </div>
    );
}

export default LastGrowOUT;