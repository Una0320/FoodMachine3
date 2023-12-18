//BoxBtnList.jsx
import React, {useState, useEffect} from "react";
import AddBoxForm from "./AddBoxform";

import '../CSS/BoxBtnList.css'
import sunlong from '../icon/sunlong.png'
import luminan from '../icon/luminance.png'
import airtemp from '../icon/temperature.png'
import humidit from '../icon/humidity.png'

const BoxBtnList = ({ onButtonClick }) => {
    const [boxList, setBoxList] = useState([]);
    const [showAddBoxModal, setShowAddBoxModal] = useState(false);
    const [selectedBox, setSelectedBox] = useState(1);

    const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/boxlist/1");
            if (response.ok) {
                const jsonData = await response.json();
                setBoxList(jsonData);
                console.log(jsonData)
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const latestData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/boxlist/1");
            if (response.ok) {
                const jsonData = await response.json();
                setBoxList(jsonData);
                console.log(jsonData)
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    function addnewBox()
    {
        setShowAddBoxModal(true);
    }
    useEffect(() => {

        fetchData();
    }, []);

    const handleBoxAdded = () => {
        setShowAddBoxModal(false);
        fetchData();
    };

    return (
        <div className="box-btn-list">
            {boxList.map((box) => (
                <button
                key={box.id}
                onClick={() => {
                    onButtonClick(box.id);
                    setSelectedBox(box.id);
                }}
                className={`nav-button ${selectedBox === box.id ? 'active' : ''}`}
                // className="box-button" // Apply the common button style
                >
                <div>
                    <div>
                        {box.name}
                    </div>
                    {/* <div className="box-info-item"> */}
                        {/* <img src={airtemp} alt="airtemp icon" /> */}
                        {/* 22.3{box.airtemp} */}
                    {/* </div> */}
                </div>
                </button>
            ))}
            <button onClick={addnewBox} className="add-box-button">
                ➕
            </button>
            {showAddBoxModal && (
                <AddBoxForm onClose={() => setShowAddBoxModal(false)} onBoxAdded={handleBoxAdded} />
            )}
        </div>
    );
};

export default BoxBtnList;