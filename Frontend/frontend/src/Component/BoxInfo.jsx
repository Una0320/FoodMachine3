// BoxInfo.jsx
import React, { useEffect, useState } from 'react';

const BoxInfo = ({ socket, boxId }) => {

    const [data, setdata] = useState([]);
    console.log(boxId);
    const fetchBoxInfo = async (boxId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxinfo/${boxId}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                console.log(jsonData.users);
                setdata(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    useEffect(() =>{
        fetchBoxInfo(boxId);
    }, [boxId]);
    return(
        <div>
            <h1>Box Info</h1>
            <p>Box id: {data.id}</p>
            <p>Box name: {data.name}</p>
            <p>Users: {data.users}</p>
            <p>Plant: {data.plant}</p>
        </div>
    );
};

export default BoxInfo;
