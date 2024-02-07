//BoxBtnList.jsx
import React, {useState, useEffect} from "react";
import AddBoxForm from "./AddBoxform";

import '../CSS/BoxBtnList.css';

const BoxBtnList = ({ userId, onButtonClick }) => {
    const [boxList, setBoxList] = useState([]);
    const [showAddBoxModal, setShowAddBoxModal] = useState(false);
    const [selectedBox, setSelectedBox] = useState(1);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://192.168.1.213:8000/boxlist/${userId}`);
            if (response.ok) {
                const jsonData = await response.json();
                setBoxList(jsonData);
                console.log(jsonData)
            } else {
                setBoxList([]);
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
    }, [userId]);

    useEffect(() => {
        // 確保 boxList 不為空且 selectedBox 存在
        if (boxList.length > 0 && selectedBox) {
            setSelectedBox(boxList[0].id);
            onButtonClick(boxList[0].id);
        }
    }, [boxList]);

    const handleBoxAdded = () => {
        setShowAddBoxModal(false);
        fetchData();
    };

    return (
        <div>
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
                    </div>
                    </button>
                ))}
                
            </div>
            <button onClick={addnewBox} className="add-box-button">
                <img style={{width:'30px'}}src="/plus.png"></img>
            </button>
            {showAddBoxModal && (
                <AddBoxForm onClose={() => setShowAddBoxModal(false)} onBoxAdded={handleBoxAdded} />
            )}
        </div>
    );
};

export default BoxBtnList;