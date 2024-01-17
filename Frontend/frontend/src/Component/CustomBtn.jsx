import React from 'react';
import '../CSS/CustomBtn.css';

const CustomBtn = ({ imagePath, text1, text2, isActive, onClick, activeColor }) => {

    const buttonStyle = {
        color: isActive ? activeColor : '#fff', /* 按下去的狀態，使用 activeColor 或 白色文字 */
    };
  return (
    <button
        className={`custom-button ${isActive ? 'active' : ''}`}
        style={buttonStyle}
        onClick={onClick}
    >
        <img src={imagePath} alt="Button Icon" />
        <span className="text1">{text1}</span>
        <span className="text2">{text2}</span>
    </button>
  );
};

export default CustomBtn;
