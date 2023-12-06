//BoxBtnList.jsx
import React, {useState, useEffect} from "react";
import AddBoxForm from "./AddBoxform";

const BoxBtnList = ({ onButtonClick }) => {
    const [boxList, setBoxList] = useState([]);
    const [showAddBoxModal, setShowAddBoxModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/boxlist/1");
            if (response.ok) {
                const jsonData = await response.json();
                setBoxList(jsonData);
                // console.log(jsonData)
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
        <div>
            {boxList.map((box) => (
                <button key={box.id} onClick={() => onButtonClick(box.id)}>
                    {box.name}
                </button>
            ))}
            <button onClick={addnewBox}>➕</button>
            {showAddBoxModal && (<AddBoxForm onClose={() => setShowAddBoxModal(false)} onBoxAdded={handleBoxAdded} />)}
        </div>
    );
};

export default BoxBtnList;