//BoxBtnList.jsx
import React, {useState, useEffect} from "react";

const BoxBtnList = ({ onButtonClick }) => {
  const [boxList, setBoxList] = useState([]);

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
  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div>
      {boxList.map((box) => (
        <button key={box.id} onClick={() => onButtonClick(box.id)}>
          {box.name}
        </button>
      ))}
    </div>
  );
};

export default BoxBtnList;